// Add Task, START
const baseURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * Fetchs Contacts from Firebase and converts them to an Array.
 */
async function fetchContacts() {
  try {
    const response = await fetch(`${baseURL}/contacts.json`);
    const data = await response.json();

    if (!data) return [];

    return Object.entries(data).map(([key, contact]) => ({
      name: contact.name || "Unbekannt",
      initials: contact.monogram || "??",
      color: contact.monogramColor || "#CCCCCC"
    }));
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
    return [];
  }
}

/**
 * Inserts contacts into the template.
 */
async function loadContacts(contacts) {
  if (!contacts.length) return;
  contacts.forEach(addContactToTemplate);
}

/**
 * Initializes the application.
 */
async function init() {
  const contacts = await fetchContacts();
  loadContacts(contacts);
}
document.addEventListener("DOMContentLoaded", init);
// Add Task, END