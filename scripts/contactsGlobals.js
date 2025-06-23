/**
 * URL of the Firebase Realtime Database used for storing contact data.
 * Contacts are stored as JSON objects at this endpoint.
 *
 * @constant {string}
 */
const databaseURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app/contacts";

/**
 * An object containing named color values used for contact monogram backgrounds.
 * Each key is a color name and the value is its corresponding hex color code.
 *
 * @constant {Object.<string, string>}
 */
const colorsObject = {
  darkorange: "#FF7902",
  pink: "#FF5EB3",
  blue: "#6D52FF",
  purple: "#9327FF",
  tuerkis: "#00BDE8",
  bloodorange: "#FE745E",
  peach: "#FFA35E",
  magenta: "#FC71FF",
  darkyellow: "#FFC701",
  darkblue: "#0138FF",
  green: "#C3FF2B",
  lightorange: "#FFE52B",
  red: "#FE4646",
  orange: "#FEBB2A",
};

/**
 * In-memory cache of all loaded contacts from the database.
 * Keys are Firebase document IDs; values are contact objects.
 *
 * @type {Object.<string, Object>}
 */
let contactStore = {};
/**
 * The ID of the contact currently being edited.
 * Used to distinguish between creating a new contact and editing an existing one.
 *
 * @type {string|null}
 */
let currentEditingContactId = null;
/**
 * A flag indicating whether the user is currently adding a new contact.
 *
 * @type {boolean}
 */
let newContactMode = false;
/**
 * A flag used to prevent immediate re-opening of the popup after closing.
 * Helps avoid unintended UI behavior.
 *
 * @type {boolean}
 */
let popupJustClosed = false;
/**
 * Stores the ID of the last opened dropdown (e.g., for contact settings).
 * Useful for closing the previous dropdown before opening a new one.
 *
 * @type {string|null}
 */
let lastOpenedDropdownId = null;

/**
 * Initializes the app by cleaning null contacts and loading contact data.
 */
function init() {
  cleanNullContacts();
  loadContactsData();
}

/**
 * Shows a popup overlay with animation.
 *
 * @param {HTMLElement} refOverlay - Overlay element.
 * @param {HTMLElement} popup - Popup element.
 */
function showPopup(refOverlay, popup) {
  requestAnimationFrame(() => {
    if (popup) popup.classList.add("show");
    refOverlay.classList.add("active");
  });
}

/**
 * Handles popup closing animation and state reset.
 *
 * @param {HTMLElement} refOverlay - Overlay element.
 * @param {HTMLElement} popup - Popup element.
 */
function closePopupActions(refOverlay, popup) {
  mobileAddButtonHoverColorRemove();
  if (popup) popup.classList.remove("show");
  refOverlay.classList.remove("active");

  setTimeout(() => {
    refOverlay.classList.add("d_none");
    refOverlay.innerHTML = "";
    newContactMode = false;
    currentEditingContactId = null;
    init();
  }, 400);
}

/**
 * Handles different click events to close the popup if needed.
 *
 * @param {Event} event - Click event.
 */
function popUpClose(event) {
  const refOverlay = document.getElementById("layout");
  const popup = document.getElementById("popup");

  if (!event) {
    // Direktes Schließen ohne Klick
    closePopupActions(refOverlay, popup);
    return;
  }

  const clickedInsidePopup = popup && popup.contains(event.target);
  const clickedCloseButton = event.target.closest("#popupCloseBtn");
  const clickedOverlay = event.target.id === "layout";

  if (clickedOverlay || clickedCloseButton) {
    event.stopPropagation();
    closePopupActions(refOverlay, popup);
  } else if (clickedInsidePopup) {
    event.stopPropagation();
  }
}

/**
 * Deletes a contact from the database (from the contact list and tasks) and updates the UI.
 *
 * @param {Event} event - Submit or click event.
 * @param {string} id - Contact ID.
 */
async function deleteContact(event, id) {
  event.preventDefault();
  const contactToRemove = await fetchSpecificContact(id);
  removeContactFromAllTasks(contactToRemove);

  try {
    const res = await fetch(`${databaseURL}/${id}.json`, {
      method: "DELETE",
    });
    if (res.ok) {
      showMessage("Contact successfully deleted", "../assets/icons/check_icon.svg", "Success");
      loadContactsData();
      setTimeout(popUpClose, 2000);
    }
  } catch (error) {
    console.error("Update failed:", error);
    showMessage("Update failed. Please try again!");
  }
  document.getElementById("contact-details").innerHTML = "";
  init();
}

/**
 * Removes a contact from all tasks it's assigned to.
 *
 * @param {string} contactToRemove - The contact name of the contact to remove
 */
async function removeContactFromAllTasks(contactToRemove) {
  try {
    const response = await fetch(`https://join-458-default-rtdb.europe-west1.firebasedatabase.app/tasks.json`);
    const tasks = await response.json();
    if (!tasks) return;

    for (const taskId in tasks) {
      const task = tasks[taskId];
      const assignedContacts = task.assignedTo || [];
      const updatedAssignedTo = assignedContacts.filter((contact) => contact.name !== contactToRemove);

      if (updatedAssignedTo.length !== assignedContacts.length) {
        await updateTaskAssignedTo(taskId, updatedAssignedTo);
      }
    }
  } catch (error) {
    console.error("Something went wrong removing contact from tasks:", error);
  }
}

/**
 * Fetches the name of a specific contact.
 *
 * @param {string} id - The ID of the contact to fetch
 * @returns - The contact name as a string
 */
async function fetchSpecificContact(id) {
  try {
    const response = await fetch(`${databaseURL}/${id}.json`);
    const contact = await response.json();
    return contact.name;
  } catch (error) {
    console.error("Something went wrong fetching the contact:", error);
  }
}

/**
 * Updates the "assignedTo" field of a task in the database.
 *
 * @param {string} taskId - The ID of the task to update
 * @param {Array<Object>} updatedAssignedTo - An updated array of assigned contacts
 */
async function updateTaskAssignedTo(taskId, updatedAssignedTo) {
  try {
    await fetch(`https://join-458-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedTo: updatedAssignedTo }),
    });
  } catch (error) {
    console.error(`Failed to update task ${taskId}:`, error);
  }
}

/**
 * Returns a random color from the color palette.
 *
 * @returns {string} Hex or RGB color string.
 */
function getRandomColor() {
  const colorKeys = Object.keys(colorsObject);
  const randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
  return colorsObject[randomKey];
}

/**
 * Saves the monogram color of a contact to the database.
 *
 * @param {string} contactKey - Contact ID.
 * @param {string} color - Color value to save.
 */
async function saveContactColor(contactKey, color) {
  const contactRef = `${databaseURL}/${contactKey}.json`;

  try {
    const res = await fetch(contactRef, {
      method: "PATCH",
      body: JSON.stringify({ monogramColor: color }),
    });

    if (!res.ok) {
      throw new Error(`There was a problem saving the color for ${contactKey}: ${res.statusText}`);
    }
  } catch (error) {
    console.error(`Network error while saving the color for ${contactKey}:`, error);
  }
}

/**
 * Fetches fresh contact data from the database for editing.
 *
 * @param {string} id - Contact ID.
 * @returns {Promise<Object|null>} Fetched contact or null if failed.
 */
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

/**
 * Updates a contact's data in the database and UI.
 *
 * @param {Event} event - Submit event.
 * @param {string} id - Contact ID.
 */
async function updateContact(event, id) {
  event.preventDefault();

  const { name, email, phone, monogram } = buildContactData();

  const isValid = validateContact(name, email, phone);
  if (!isValid) return;

  const updated = { id, name, email, phone, monogram, monogramColor: contactStore[id].monogramColor || getRandomColor() };

  await updateContactDetails(id, updated);
}

/**
 * Sends PATCH request to update a contact.
 *
 * @param {string} id - Contact ID.
 * @param {Object} updated - Updated contact data.
 */
async function updateContactDetails(id, updated) {
  try {
    const res = await fetch(`${databaseURL}/${id}.json`, {
      method: "PATCH",
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      showMessage("Contact successfully updated!", "../assets/icons/check_icon.svg", "Success");
      document.getElementById("contact-details").innerHTML = templateContactsDetails(updated);

      loadContactsData();
      setTimeout(popUpClose, 2000);
    }
  } catch (error) {
    console.error("Update failed:", error);
    showMessage("Update failed. Please try again!");
  }
}
