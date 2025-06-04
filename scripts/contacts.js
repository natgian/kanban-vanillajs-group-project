const databaseURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app/contacts";

const colorsObject = {
  darkorange: "#FF7902",
  pink:"#FF5EB3",
  blue: "#6D52FF",
  purple:"#9327FF",
  tuerkis:"#00BDE8",
  green:"#1ED7C1",
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

function init() {
  cleanNullContacts();
  loadContactsData();
}

function getRandomColor(){
  const colorKeys = Object.keys(colorsObject);
  const randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
  return colorsObject[randomKey];
}

async function loadContactsData() {
  try {
    let contactsResponse = await fetch(databaseURL + '.json');
    let contactsData = await contactsResponse.json();
    
    if(!contactsData || typeof contactsData !== 'object' || Object.keys(contactsData).length === 0){
      contactStore ={};
      document.getElementById('contact-list-body').innerHTML = '<p>Keine Kontakte vorhanden.</p>';
      return;
    }

    contactStore = contactsData;
    let groupContacts = await groupContactsByLetter(contactsData);

    let abilityContacts = generateGroupContactsHTML(groupContacts);

    document.getElementById('contact-list-body').innerHTML = abilityContacts;

  } catch (error) {
    console.error('Fehler bei der Datenbankabfrage:', error);
    alert("Es gab ein Problem bei der Registrierung. Bitte versuchen Sie es später noch einmal.");
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

async function groupContactsByLetterIfElse(contactsData, groupContacts, updatePromise) {
  for (let key in contactsData) {
    if (contactsData.hasOwnProperty(key)) {
      let contact = contactsData[key];
      if (!contact || typeof contact.name !== "string") {
        console.warn(`Ungültiger Kontakt mit Schlüssel: ${key}`);
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

async function groupContactsByLetter(contactsData) {
  let groupContacts = {};
  let updatePromise= [];

  await groupContactsByLetterIfElse(contactsData, groupContacts, updatePromise);
  
  await Promise.all(updatePromise);

  return groupContacts;
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

async function saveContactColor(contactKey, color) {
  const contactRef = `${databaseURL}/${contactKey}.json`;
  
  try {
    const res = await fetch(contactRef, {
      method: 'PATCH',
      body: JSON.stringify({ monogramColor: color })
    });

    if (!res.ok) {
      throw new Error(`Fehler beim Speichern der Farbe für ${contactKey}: ${res.statusText}`);
    }
  } catch (error) {
    console.error(`Netzwerkfehler beim Speichern der Farbe für ${contactKey}:`, error);
  }
}

function showContactDetails(id) {
  const contact = contactStore[id];
  if (!contact) {
    return console.error('Kontakt nicht gefunden:', id);
  }

  const allContacts = document.querySelectorAll('.contact');
  allContacts.forEach(c => c.classList.remove('active-contact'));

  const clickedContact = document.querySelector(`.contact[data-id="${id}"]`);
  if (clickedContact) {
    clickedContact.classList.add('active-contact');
  }

  document.getElementById('contact-list').classList.add('d_mobile_none');
  document.getElementById('contact-details').classList.add('d_block');
  if (window.innerWidth <= 905) {
  document.getElementById('contenttop').classList.add('d_block');
}
  document.getElementById('contact-details').innerHTML = templateContactsDetails(contact);
}


function openNewContact() {
  newContactMode = true;
  currentEditingContactId = null;
  const allContacts = document.querySelectorAll('.contact');
  allContacts.forEach(c => c.classList.remove('active-contact'));
  document.getElementById('contact-details').innerHTML='';

  const refOverlay = document.getElementById('layout');
  refOverlay.innerHTML = templateNewContact();
  refOverlay.classList.remove('d_none');
  refOverlay.classList.remove('flex-display');
}

function popUpClose(){
  const refOverlay = document.getElementById('layout');
  refOverlay.classList.add('d_none');
  newContactMode = false;
  currentEditingContactId = null;
  init();
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

function isDuplicate({ email, name }) {
  return !!Object.values(contactStore).find(contact =>
    contact && (contact.email === email || contact.name === name)
  );
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
  const monogram = newContact.monogram;
  const monogramColor = newContact.monogramColor;

  const detailHTML = templateContactsDetails({
    id: newId,
    name: newContact.name,
    email: newContact.email,
    phone: newContact.phone,
    monogram: newContact.monogram,
    monogramColor: newContact.monogramColor,
  });

  const detailContainer = document.getElementById('contact-details');
  if (detailContainer) {
    detailContainer.innerHTML = detailHTML;
  }

  setTimeout(popUpClose, 2000);
}

async function createNewContact(event) {
  event.preventDefault();

  const newContact = buildContactData();
  
  if (isDuplicate(newContact)) {
    return showMessage("Contact already exists!");
  }

  try {
    const response = await postContact({ ...newContact, monogramColor: newContact.monogramColor });

    if(response.ok){
      const data = await response.json();
      await newContactDetails(data, newContact);
    }
    
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Kontakts:', error);
    showMessage("Es gab ein Problem beim Speichern des Kontakts.");
  }
  showContactDetails(data.id);
}


function showMessage(text) {
  const messageBox = document.getElementById("message-box");
  const messageText = document.getElementById("message-text");
  
  messageBox.classList.add("show");
  messageText.textContent = text;

  setTimeout(() => {
    messageBox.classList.remove("show");
  }, 2000);
}

async function editContact(id) {
  currentEditingContactId = id;
  
  const contact = contactStore[id];
  const refOverlay = document.getElementById('layout');
  refOverlay.innerHTML = templateEditContact(contact, id);
  refOverlay.classList.remove('d_none');
  refOverlay.classList.remove('flex-display');

  try {
    const updatedResponse = await fetch(`${databaseURL}/${id}.json`);
    const updatedContact = await updatedResponse.json();
    document.getElementById('contact-details').innerHTML = templateContactsDetails(updatedContact);
    await loadContactsData();  
  } catch (error) {
    console.error("Fehler beim Abrufen des Kontakts:", error);
    showMessage("Fehler beim Laden des Kontakts!");
  }
}


async function editContactMobile(id) {
  currentEditingContactId = id;
  const contact = contactStore[id];

  if(!contact){
    showMessage("Kontakt nicht gefunden!");
    return;
  }

  const contactWithId = {id, ...contact};
  const refOverlay = document.getElementById('layout');
  refOverlay.innerHTML = templateEdtContactMobile(contactWithId);
  refOverlay.classList.remove('d_none');
  refOverlay.classList.add('flex-display');

  try {
    const updatedResponse = await fetch(`${databaseURL}/${id}.json`);
    const updatedContact = await updatedResponse.json();
    document.getElementById('contact-details').innerHTML = templateContactsDetails(updatedContact);
    await loadContactsData();  
  } catch (error) {
    console.error("Fehler beim Abrufen des Kontakts:", error);
    showMessage("Fehler beim Laden des Kontakts!");
  }
}


async function updateContactDetails(id, updated) {
  try {
    const res = await fetch(`${databaseURL}/${id}.json`, {
      method: 'PATCH',
      body: JSON.stringify(updated)
    });

    if (res.ok) {
      showMessage('Contact successfully updated!');
      const updatedResponse = await fetch(`${databaseURL}/${id}.json`);
      const updatedContact = await updatedResponse.json();
      document.getElementById('contact-details').innerHTML = templateContactsDetails(updatedContact);
      loadContactsData();
      setTimeout(popUpClose, 2000);
      setTimeout(closeMobilePopUp, 2000);
    }
  } catch (error) {
    console.error('Update failed:', error);
    showMessage('Update failed. Please try again!');
  }
}

async function updateContact(event, id) {
  event.preventDefault();

  const { name, email, phone, monogram } = buildContactData();

  const updated = {id, name, email, phone, monogram, monogramColor:contactStore[id].monogramColor || getRandomColor() };

  await updateContactDetails(id, updated);
}

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

function backTocontacts(){
  document.getElementById('contact-list').classList.remove('d_mobile_none');
  document.getElementById('contenttop').classList.add('d_mobile_none');
  document.getElementById('contenttop').classList.remove('d_block');
  document.getElementById('contact-details').classList.add('d_none');
  document.getElementById('contact-details').classList.remove('d_block');
  const allContacts = document.querySelectorAll('.contact');
  allContacts.forEach(c => c.classList.remove('active-contact'));
}

function toggleDropdown(id) {
  const menu = document.getElementById(`dropdown-menu-${id}`);
  if (menu) {
    menu.classList.toggle('hidden');
  }
}


function closeMobilePopUp(){
  const refOverlay = document.getElementById('layout');
  const refOverlayMobile = document.querySelector('.popupMobile');
  if (refOverlayMobile) {
    refOverlayMobile.style.display = 'none';
  }
  refOverlay.classList.remove('flex-display');
  refOverlay.classList.add('d_none');

  newContactMode = false;
  currentEditingContactId = null;
}