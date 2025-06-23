/**
 * Removes null contacts from the database.
 * Deletes entries that are null or undefined.
 */
async function cleanNullContacts() {
  const response = await fetch(databaseURL + ".json");
  let data = await response.json();

  if (Array.isArray(data)) {
    data = data.filter((item) => item !== null);
  } else {
    for (const key in data) {
      if (!data[key]) {
        await fetch(`${databaseURL}/${key}.json`, {
          method: "DELETE",
        });
      }
    }
  }
}

/**
 * Loads all contacts from the database and renders them.
 * Shows an error message if the request fails.
 */
async function loadContactsData() {
  try {
    let contactsResponse = await fetch(databaseURL + ".json");
    let contactsData = await contactsResponse.json();

    contactStore = contactsData;
    let groupContacts = await groupContactsByLetter(contactsData);

    let abilityContacts = generateGroupContactsHTML(groupContacts);

    document.getElementById("contact-list-body").innerHTML = abilityContacts;
  } catch (error) {
    console.error("Problem checking the database:", error);
    alert("There was a problem with the registration. Please try again later.");
  }
}

/**
 * Groups contacts by the first letter of their name.
 * Also ensures each contact has a monogram color.
 *
 * @param {Object} contactsData - Key-value contact object from the database.
 * @returns {Promise<Object>} Grouped contacts by letter.
 */
async function groupContactsByLetter(contactsData) {
  let groupContacts = {};
  let updatePromise = [];

  await groupContactsByLetterIfElse(contactsData, groupContacts, updatePromise);

  await Promise.all(updatePromise);

  return groupContacts;
}

/**
 * Helper function that loops through contacts to group them
 * and assigns monogram colors where needed.
 *
 * @param {Object} contactsData - Contacts from the database.
 * @param {Object} groupContacts - Object to collect grouped contacts.
 * @param {Promise[]} updatePromise - Promises for updating contact colors.
 */
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

/**
 * Ensures a contact has a monogram color and pushes update promise if not.
 *
 * @param {Object} contact - The contact object.
 * @param {string} key - Contact's database key.
 * @param {Promise[]} updatePromise - Array of promises for saving color.
 */
function ensureMonogramColor(contact, key, updatePromise) {
  if (!contact.monogramColor) {
    contact.monogramColor = getRandomColor();
    updatePromise.push(saveContactColor(key, contact.monogramColor));
  }
}

/**
 * Groups a contact into an object by the first letter of their name.
 *
 * @param {Object} contact - Contact to be grouped.
 * @param {Object} groupContacts - Accumulator object for grouped contacts.
 */
function contactsFilterFirstLetter(contact, groupContacts) {
  let firstLetter = contact.name.charAt(0).toUpperCase();
  if (!groupContacts[firstLetter]) {
    groupContacts[firstLetter] = [];
  }
  groupContacts[firstLetter].push(contact);
}

/**
 * Generates HTML for displaying grouped contacts by letter.
 *
 * @param {Object} groupContacts - Object with letters as keys and contact arrays as values.
 * @returns {string} HTML string of all contacts grouped by letter.
 */
function generateGroupContactsHTML(groupContacts) {
  const letters = Object.keys(groupContacts).sort();

  let abilityContacts = "";

  for (const letter of letters) {
    abilityContacts += `
        <div class="letter-section">
          <div class="letter">${letter}</div>
          ${groupContacts[letter].map((contact) => templateContacts(contact)).join("")}
        </div>
      `;
  }
  return abilityContacts;
}

/**
 * Opens the overlay to create a new contact.
 */
function openNewContact() {
  newContactMode = true;
  currentEditingContactId = null;
  mobileAddButtonHoverColorAdd();

  clearActiveContacts();

  document.getElementById("contact-details").innerHTML = "";

  const refOverlay = document.getElementById("layout");
  refOverlay.innerHTML = templateNewContact();
  refOverlay.classList.remove("d_none");
  const popup = document.getElementById("popup");

  showPopup(refOverlay, popup);
  initFocusHideValidation();
}

/**
 * Builds a contact object using input values from the form.
 *
 * @returns {Object} Contact data containing:
 *   - name {string} Full name (trimmed)
 *   - email {string} Email address (trimmed)
 *   - phone {string} Phone number (trimmed, empty if no phone input present)
 *   - monogram {string} Initials from the full name (1 or 2 letters, uppercase)
 *   - monogramColor {string} A randomly generated color string
 */
function buildContactData() {
  const fullName = document.getElementById("name")?.value.trim() || "";
  const email = document.getElementById("email")?.value.trim() || "";
  const phoneEl = document.getElementById("phone");
  const phone = phoneEl ? phoneEl.value.trim() : "";

  const parts = fullName.split(" ").filter(Boolean);
  const monogram = parts.length >= 2 ? parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase() : fullName.charAt(0).toUpperCase();

  const monogramColor = getRandomColor();

  return { name: fullName, email, phone, monogram, monogramColor };
}

/**
 * Sends a request to save a contact to the backend.
 *
 * @param {Object} contact - The contact data to be saved.
 * @param {string} contact.name - Full name of the contact.
 * @param {string} contact.email - Email address of the contact.
 * @param {string} contact.phone - Phone number of the contact.
 * @param {string} contact.monogram - Initials (monogram) of the contact.
 * @param {string} contact.monogramColor - Color associated with the contact's monogram.
 * @returns {Promise<Object>} The parsed JSON response from the server if successful.
 * @throws {Error} If the server response is not ok.
 */
async function saveContact(contact) {
  const response = await postContact({
    ...contact,
    monogramColor: contact.monogramColor,
  });

  if (!response.ok) {
    throw new Error("Server response not ok");
  }

  return await response.json();
}

/**
 * Handles the form submission event to create a new contact.
 * Validates input, checks for duplicates, saves the contact, updates UI, and shows contact details.
 *
 * @param {Event} event - The form submit event.
 * @returns {Promise<void>}
 */
async function createNewContact(event) {
  event.preventDefault();

  const { fullName, email, phone } = getInputValues();
  const isValid = validateContact(fullName, email, phone);

  if (!isValid) return;

  const newContact = buildContactData();

  if (isDuplicate(newContact)) {
    return showMessage("Contact already exists!", "../assets/icons/close.svg", "Error");
  }

  try {
    const savedData = await saveContact(newContact);
    setTimeout(popUpClose, 2000);
    await handleSuccessfulContactCreation(savedData, newContact);
    await loadContactsData();
    showContactDetails(savedData.name);
  } catch (error) {
    handleContactCreationError(error);
  }
}

/**
 * Sends a POST request to add a new contact to the database.
 *
 * @param {Object} data - The new contact data.
 * @returns {Promise<Response>} Fetch response object.
 */
async function postContact(data) {
  return fetch(databaseURL + ".json", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Shows success message and renders the new contact details.
 *
 * @param {Object} data - Response data from the server.
 * @param {Object} newContact - Original contact data submitted.
 */
async function newContactDetails(data, newContact) {
  showMessage("Contact successfully added!", "../assets/icons/check_icon.svg", "Success");
  loadContactsData();

  const newId = data.name;

  renderContactDetails("contact-details", {
    id: newId,
    name: newContact.name,
    email: newContact.email,
    phone: newContact.phone,
    monogram: newContact.monogram,
    monogramColor: newContact.monogramColor,
  });

  closePopupAfterDelay();
}

/**
 * Renders the contact details view into a specific container.
 *
 * @param {string} containerId - HTML ID of the target container.
 * @param {Object} contact - The contact data to render.
 */
function renderContactDetails(containerId, contact) {
  const detailHTML = templateContactsDetails(contact);
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = detailHTML;
  }
}

/**
 * Closes the popup after a delay.
 *
 * @param {number} [delay=2000] - Optional delay in milliseconds.
 */
function closePopupAfterDelay(delay = 2000) {
  setTimeout(popUpClose, delay);
}

/**
 * Handles successful contact creation logic.
 *
 * @param {Object} data - Server response with contact ID.
 * @param {Object} newContact - Original contact object.
 */
function handleSuccessfulContactCreation(data, newContact) {
  return newContactDetails(data, newContact);
}

/**
 * Handles any error during contact creation.
 *
 * @param {Error} error - Error thrown during operation.
 */
function handleContactCreationError(error) {
  console.error("There was a problem adding the contact:", error);
  showMessage("There was a problem saving the contact!");
}

/**
 * Checks if a contact with the same email or name already exists.
 *
 * @param {Object} contact - Contact object with name and email.
 * @returns {boolean} True if duplicate found, false otherwise.
 */
function isDuplicate({ email, name }) {
  return !!Object.values(contactStore).find((contact) => contact && (contact.email === email || contact.name === name));
}

/**
 * Displays the detailed view of a selected contact.
 *
 * @param {string} id - Contact's database key.
 */
function showContactDetails(id) {
  const contact = contactStore[id];
  if (!contact) {
    return console.error("Contact not found:", id);
  }

  setActiveContact(id);

  document.getElementById("contact-list").classList.add("d_mobile_none");
  document.getElementById("contact-details").classList.add("d_block");
  if (window.innerWidth <= 1000) {
    document.getElementById("contenttop").classList.add("d_block");
  }
  document.getElementById("contact-details").innerHTML = templateContactsDetails(contact);
}

/**
 * Highlights the selected contact in the contact list.
 *
 * @param {string} id - ID of the contact to highlight.
 */
function setActiveContact(id) {
  const allContacts = document.querySelectorAll(".contact");
  allContacts.forEach((c) => c.classList.remove("active-contact"));

  const clickedContact = document.querySelector(`.contact[data-id="${id}"]`);
  if (clickedContact) {
    clickedContact.classList.add("active-contact");
  }
}

/**
 * Removes the 'active' class from all contacts in the list.
 */
function clearActiveContacts() {
  const allContacts = document.querySelectorAll(".contact");
  allContacts.forEach((c) => c.classList.remove("active-contact"));
}

/**
 * Opens the contact edit overlay for the selected contact.
 *
 * @param {string} id - Contact ID to edit.
 * @param {Event} event - Click event to prevent bubbling.
 */
async function editContact(id, event) {
  event.stopPropagation();
  currentEditingContactId = id;

  const contact = contactStore[id];
  showEditContactOverlay(contact, id);
  initFocusHideValidation();

  await refreshContactData(id);
}

/**
 * Displays the edit overlay with the contact's current info.
 *
 * @param {Object} contact - Contact to be edited.
 * @param {string} id - Contact ID.
 */
function showEditContactOverlay(contact, id) {
  const refOverlay = document.getElementById("layout");
  refOverlay.innerHTML = templateEditContact(contact, id);
  refOverlay.classList.remove("d_none", "flex-display");

  const popup = document.getElementById("popup");
  requestAnimationFrame(() => {
    if (popup) popup.classList.add("show");
    refOverlay.classList.add("active");
  });
}
