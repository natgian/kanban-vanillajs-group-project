// Add Task, START
const baseURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app";
/**
 * Fetchs Contacts from Firebase and convert to an Array.
 */
async function fetchContacts() {
  try {
    const response = await fetch(`${baseURL}/contacts.json`);
    const data = await response.json();
    if (!data) return [];
    return Object.values(data);
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
    return [];
  }
}

/**
 * Fills in addContactToTemplate().
 */
async function loadContacts() {
  const contacts = await fetchContacts();
  contacts.forEach(addContactToTemplate);
}

/**
 * Call up for loadContacts().
 */
async function init() {
  console.log("Initialisierung gestartet...");
  
  await loadContacts();
  console.log("Geladene Kontakte:", contacts);

  initSearch();
  console.log("Suchfunktion initialisiert.");

  renderBoard();
  console.log("Board gerendert.");
}

document.addEventListener("DOMContentLoaded", init);
// Add Task, END