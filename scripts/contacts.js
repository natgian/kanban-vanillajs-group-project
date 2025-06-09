const databaseURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app/contacts";

const colorsObject = {
  darkorange: "#FF7902",
  pink:"#FF5EB3",
  blue: "#6D52FF",
  purple:"#9327FF",
  tuerkis:"#00BDE8",
  bloodorange:"#FE745E",
  peach:"#FFA35E",
  magenta:"#FC71FF",
  darkyellow:"#FFC701",
  darkblue:"#0138FF",
  green:"#C3FF2B",
  lightorange:"#FFE52B",
  red:"#FE4646",
  orange:"#FEBB2A"
};

let contactStore = {};
let currentEditingContactId = null;
let newContactMode = false;
let popupJustClosed = false;
let lastOpenedDropdownId = null;


function init() {
  cleanNullContacts();
  loadContactsData();
}

async function cleanNullContacts() {
  const response = await fetch(databaseURL + '.json');
  let data = await response.json();

  if(Array.isArray(data)){
    data = data.filter(item => item !== null);
  }else{
    for (const key in data) {
    if (!data[key]) {
      await fetch(`${databaseURL}/${key}.json`, { 
        method: 'DELETE' });
      }
    }
  }
}

async function loadContactsData() {
  try {
    let contactsResponse = await fetch(databaseURL + '.json');
    let contactsData = await contactsResponse.json();

    contactStore = contactsData;
    let groupContacts = await groupContactsByLetter(contactsData);

    let abilityContacts = generateGroupContactsHTML(groupContacts);

    document.getElementById('contact-list-body').innerHTML = abilityContacts;

  } catch (error) {
    console.error('Problem checking the database:', error);
    alert("There was a problem with the registration. Please try again later.");
  }
}

async function groupContactsByLetter(contactsData) {
  let groupContacts = {};
  let updatePromise= [];

  await groupContactsByLetterIfElse(contactsData, groupContacts, updatePromise);
  
  await Promise.all(updatePromise);

  return groupContacts;
}

async function groupContactsByLetterIfElse(contactsData, groupContacts, updatePromise) {
  for (let key in contactsData) {
    if (contactsData.hasOwnProperty(key)) {
      let contact = contactsData[key];
      if (!contact || typeof contact.name !== "string") {
        console.warn(`Invalid contact with this key: ${key}`);
        continue;
      }
      if (!contact.id) {
        contact.id = key;
      }
      ensureMonogramColor(contact, key, updatePromise);
      contactsFilterFirstLetter(contact, groupContacts);
    }
  }
}

function ensureMonogramColor(contact, key, updatePromise){
  if (!contact.monogramColor) {
        contact.monogramColor = getRandomColor();
        updatePromise.push(saveContactColor(key, contact.monogramColor));
      }
}

function contactsFilterFirstLetter(contact, groupContacts){
  let firstLetter = contact.name.charAt(0).toUpperCase();
      if (!groupContacts[firstLetter]) {
        groupContacts[firstLetter] = [];
      }
      groupContacts[firstLetter].push(contact);
}

function generateGroupContactsHTML(groupContacts){

  const letters = Object.keys(groupContacts).sort();

  let abilityContacts = '';

    for (const letter of letters) {
      abilityContacts += `
        <div class="letter-section">
          <div class="letter">${letter}</div>
          ${groupContacts[letter].map(contact => templateContacts(contact)).join('')}
        </div>
      `;
    }
    return abilityContacts;   
}
//
function openNewContact() {
  newContactMode = true;
  currentEditingContactId = null;
  mobileAddButtonHoverColorAdd();

  clearActiveContacts();

  document.getElementById('contact-details').innerHTML = '';

  const refOverlay = document.getElementById('layout');
  refOverlay.innerHTML = templateNewContact();
  refOverlay.classList.remove('d_none');
  const popup = document.getElementById('popup');

  showPopup(refOverlay, popup);
}

function buildContactData(){
  const fullName = document.getElementById('name').value.trim();
  const email    = document.getElementById('email').value.trim();
  const phone    = document.getElementById('phone').value.trim();

  const parts = fullName.split(' ').filter(Boolean);
  let monogram;
  if (parts.length >= 2) {
    monogram = parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
  } else {
    monogram = fullName.charAt(0).toUpperCase();
  }

  const monogramColor = getRandomColor();
  return { name: fullName, email, phone, monogram, monogramColor };
}

async function createNewContact(event) {
  event.preventDefault();

  const newContact = buildContactData();

  if (isDuplicate(newContact)) {
    return showMessage(`Contact already exists! <img src="../assets/icons/check_icon.svg" alt="Success">`);
  }

  try {
    const response = await postContact({
      ...newContact,
      monogramColor: newContact.monogramColor
    });

    if (response.ok) {
      const data = await response.json();
      setTimeout(popUpClose, 200);
      await handleSuccessfulContactCreation(data, newContact);
      await loadContactsData();
      showContactDetails(data.name);
    } else {
      throw new Error('Server response not ok');
    }
  } catch (error) {
    handleContactCreationError(error);
  }
}

async function postContact(data) {
  return fetch(databaseURL + '.json', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function newContactDetails(data, newContact) {
  showMessage('Contact successfully added!');
  loadContactsData();

  const newId = data.name;

  renderContactDetails('contact-details', {
    id: newId,
    name: newContact.name,
    email: newContact.email,
    phone: newContact.phone,
    monogram: newContact.monogram,
    monogramColor: newContact.monogramColor,
  });

  closePopupAfterDelay();
}

function renderContactDetails(containerId, contact) {
  const detailHTML = templateContactsDetails(contact);
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = detailHTML;
  }
}

function closePopupAfterDelay(delay = 2000) {
  setTimeout(popUpClose, delay);
}

function handleSuccessfulContactCreation(data, newContact) {
  return newContactDetails(data, newContact);
}

function handleContactCreationError(error) {
  console.error('There was a problem adding the contact:', error);
  showMessage("There was a problem saving the contact!");
}

function isDuplicate({ email, name }) {
  return !!Object.values(contactStore).find(contact =>
    contact && (contact.email === email || contact.name === name)
  );
}
//
function showContactDetails(id) {
  const contact = contactStore[id];
  if (!contact) {
    return console.error('Contact not found:', id);
  }

  setActiveContact(id);

  document.getElementById('contact-list').classList.add('d_mobile_none');
  document.getElementById('contact-details').classList.add('d_block');
  if (window.innerWidth <= 1000) {
  document.getElementById('contenttop').classList.add('d_block');
}
  document.getElementById('contact-details').innerHTML = templateContactsDetails(contact);
}

function setActiveContact(id) {
  const allContacts = document.querySelectorAll('.contact');
  allContacts.forEach(c => c.classList.remove('active-contact'));

  const clickedContact = document.querySelector(`.contact[data-id="${id}"]`);
  if (clickedContact) {
    clickedContact.classList.add('active-contact');
  }
}

function clearActiveContacts() {
  const allContacts = document.querySelectorAll('.contact');
  allContacts.forEach(c => c.classList.remove('active-contact'));
}
//
async function editContact(id, event) {
  event.stopPropagation();
  currentEditingContactId = id;

  const contact = contactStore[id];
  showEditContactOverlay(contact, id);

  await refreshContactData(id);
}

function showEditContactOverlay(contact, id) {
  const refOverlay = document.getElementById('layout');
  refOverlay.innerHTML = templateEditContact(contact, id);
  refOverlay.classList.remove('d_none', 'flex-display');

  const popup = document.getElementById('popup');
  requestAnimationFrame(() => {
    if (popup) popup.classList.add('show');
    refOverlay.classList.add('active');
  });
}

async function refreshContactData(id) {
  try {
    const response = await fetch(`${databaseURL}/${id}.json`);
    const data = await response.json();
    await loadContactsData();
    return data;
  } catch (error) {
    console.error("Failed to retrieve contact:", error);
    showMessage("There was a problem loading the contact!");
    return null;
  }
}

async function updateContact(event, id) {
  event.preventDefault();

  const { name, email, phone, monogram } = buildContactData();

  const updated = {id, name, email, phone, monogram, monogramColor:contactStore[id].monogramColor || getRandomColor() };

  await updateContactDetails(id, updated);
}

async function updateContactDetails(id, updated) {
  try {
    const res = await fetch(`${databaseURL}/${id}.json`, {
      method: 'PATCH',
      body: JSON.stringify(updated)
    });

    if (res.ok) {
      showMessage('Contact successfully updated!');
      document.getElementById('contact-details').innerHTML = templateContactsDetails(updated);

      loadContactsData();
      setTimeout(popUpClose, 2000);
    }
  } catch (error) {
    console.error('Update failed:', error);
    showMessage('Update failed. Please try again!');
  }
}

//
async function deleteContact(event, id) {
  event.preventDefault();
  const contact = contactStore[id];
  try{
    const res = await fetch(`${databaseURL}/${id}.json`,{
      method: 'DELETE',
    });
    if (res.ok) {
      showMessage('Contact succesfully deleted!');
      loadContactsData();
      setTimeout(popUpClose, 2000);
    }
  }catch(error){
    console.error('Update failed:', error);
    showMessage('Update failed. Please try again!');
  }
  document.getElementById('contact-details').innerHTML = '';
  init();
}
//
function getRandomColor(){
  const colorKeys = Object.keys(colorsObject);
  const randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
  return colorsObject[randomKey];
}

async function saveContactColor(contactKey, color) {
  const contactRef = `${databaseURL}/${contactKey}.json`;
  
  try {
    const res = await fetch(contactRef, {
      method: 'PATCH',
      body: JSON.stringify({ monogramColor: color })
    });

    if (!res.ok) {
      throw new Error(`There was a problem saving the color for ${contactKey}: ${res.statusText}`);
    }
  } catch (error) {
    console.error(`Network error while saving the color for ${contactKey}:`, error);
  }
}
//
function showPopup(refOverlay, popup) {
  requestAnimationFrame(() => {
    if (popup) popup.classList.add('show');
    refOverlay.classList.add('active');
  });
}

function popUpClose() {
  const refOverlay = document.getElementById('layout');
  const popup = document.getElementById('popup');
  mobileAddButtonHoverColorRemove();
  
  if (popup) popup.classList.remove('show');
  refOverlay.classList.remove('active');

  setTimeout(() => {
    refOverlay.classList.add('d_none');
    refOverlay.innerHTML = '';
    newContactMode = false;
    currentEditingContactId = null;
    init();
  }, 400);
}

function showMessage(text) {
  const messageBox = document.getElementById("message-box");
  const messageText = document.getElementById("message-text");

  const isMobile = window.innerWidth < 1080;
  const deviceClass = isMobile ? "mobile" : "desktop";

  messageBox.classList.remove("hide", "desktop", "mobile");
  messageBox.classList.add("show", deviceClass);
  messageText.textContent = text;

  setTimeout(() => {
    messageBox.classList.remove("show");
    messageBox.classList.add("hide");
  }, 2000);
}

//
function mobileAddButtonHoverColorAdd(){
  const openNewContactButton = document.getElementById('mobile-add-button');
  openNewContactButton.classList.add('button-hover-style');
}

function mobileAddButtonHoverColorRemove(){
  const openNewContactButton = document.getElementById('mobile-add-button');
  openNewContactButton.classList.remove('button-hover-style');
}

function mobileDropdownButtonHoverColorAdd(){
  const button = document.getElementById('mobile-dropdown-button');
  if (button) button.classList.add('button-hover-style');
}
function mobileDropdownButtonHoverColorRemove(){
  const button = document.getElementById('mobile-dropdown-button');
  if (button) button.classList.remove('button-hover-style');
}

function backTocontacts(){
  document.getElementById('contact-list').classList.remove('d_mobile_none');
  document.getElementById('contenttop').classList.add('d_mobile_none');
  document.getElementById('contenttop').classList.remove('d_block');
  document.getElementById('contact-details').classList.add('d_none');
  document.getElementById('contact-details').classList.remove('d_block');
  const allContacts = document.querySelectorAll('.contact');
  allContacts.forEach(c => c.classList.remove('active-contact'));
}
//
function toggleDropdown(id, event) {
  event.stopPropagation();
  const menu = document.getElementById(`dropdown-menu-${id}`);
  if (!menu) return;

  if (menu.classList.contains('show')) {
    return;
  } else {
    menu.classList.remove('hidden');
    requestAnimationFrame(() => {
      menu.classList.add('show');
    });
    mobileDropdownButtonHoverColorAdd();
    lastOpenedDropdownId = id;
  }
}

function closeAllDropdownsIfClickedOutside(event) {
  let dropdownWasOpen = false;
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    if (menu.classList.contains('hidden')) return;
    const id = menu.id.replace('dropdown-menu-', '');
    const button = document.getElementById(`mobile-dropdown-button-${id}`);
    const clickedInsideMenu = menu.contains(event.target);
    const clickedOnButton = button && button.contains(event.target);

    if (!clickedInsideMenu && !clickedOnButton) {
      if (menu.classList.contains('show')) {
        menu.classList.remove('show');
        setTimeout(() => menu.classList.add('hidden'), 300);
      } else {
        menu.classList.add('hidden');
      }
      dropdownWasOpen = true;
      setTimeout(() => {
        mobileDropdownButtonHoverColorRemove();
        lastOpenedDropdownId = null;
      }, 1000);
    }
  });
  return dropdownWasOpen;
}

function handleDropdownOnClick(event) {
  const refOverlay = document.getElementById('layout');
  const popupOpen = refOverlay && !refOverlay.classList.contains('d_none');
  if (popupOpen) return false;

  return closeAllDropdownsIfClickedOutside(event);
}
//
document.addEventListener('click', (event) => {
  const targetID = event.target.id;

  if (targetID === 'save' || targetID === 'delete') {
    event.stopPropagation();
    popUpClose();
    return;
  }

  const refOverlay = document.getElementById('layout');
  const popupOpen = refOverlay && !refOverlay.classList.contains('d_none');
  if (popupOpen) return;

  const dropdownWasOpen = closeAllDropdownsIfClickedOutside(event);
  if (dropdownWasOpen) event.stopPropagation();
});