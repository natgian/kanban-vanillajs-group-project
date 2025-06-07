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
      color: contact.monogramColor || "#CCCCCC",
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



// // In Progress => Save Task in Firebase
// import { initializeApp } from "firebase/app";
// import { getFirestore, doc, setDoc } from "firebase/firestore";
// import { v4 as uuidv4 } from 'uuid'; 

// // Firebase-Konfiguration
// const firebaseConfig = {
//   apiKey: "DEINE_API_KEY",
//   authDomain: "DEINE_AUTH_DOMAIN",
//   projectId: "DEINE_PROJECT_ID",
//   storageBucket: "DEINE_STORAGE_BUCKET",
//   messagingSenderId: "DEINE_MESSAGING_SENDER_ID",
//   appId: "DEINE_APP_ID"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // Funktion zum sicheren Abrufen von Elementen
// function getTextContent(id, fallback = "") {
//   return document.getElementById(id)?.textContent || fallback;
// }

// // Catch Data from AddTask-Elements
// const title = getTextContent("taskTitle", "Kein Titel");
// const description = getTextContent("taskDescription", "Keine Beschreibung");
// const dueDate = getTextContent("date-input", new Date().toISOString().split("T")[0]);
// const priority = getTextContent("priority", "medium");
// const category = getTextContent("taskCategory", "Keine Kategorie");
// const status = getTextContent("status", "open");

// // Erfassung von Listen (z. B. Kontakte und Unteraufgaben)
// const contacts = Array.from(document.querySelectorAll(".task-card-avatar")).map(el => el.textContent);
// const subtasks = Array.from(document.querySelectorAll(".subtaskListElement")).map(el => el.textContent);

// // Erstellen des Datenobjekts
// const task = {
//   taskId: uuidv4(), // Eindeutige ID mit UUID erzeugen
//   status,
//   title,
//   description,
//   dueDate,
//   priority,
//   contacts,
//   category,
//   subtasks
// };

// // Funktion zum Speichern der Aufgabe in Firebase
// async function speichereAufgabe(task) {
//   try {
//     await setDoc(doc(db, "tasks", task.taskId), task);
//     console.log("Aufgabe erfolgreich gespeichert!");
//   } catch (error) {
//     console.error("Fehler beim Speichern:", error);
//   }
// }

// // Aufruf der Speicherfunktion
// speichereAufgabe(task);





// /**
//  * Initializes the application.
//  */
// async function init() {
//   const contacts = await fetchContacts();
//   loadContacts(contacts);
// }
// document.addEventListener("DOMContentLoaded", init);
// // Add Task, END
