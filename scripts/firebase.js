import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

// Firebase-configuration
const firebaseConfig = {
  apiKey: "none(API-Zugriffe)",
  databaseURL: "https://join-458-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "join-458",
};

// Firebase initialisation
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Reference for contacts from DB
const contactsRef = ref(database, "contacts");

// function to call up contactinformations
async function fetchContacts() {
    try {
        const snapshot = await get(contactsRef);
        if (snapshot.exists()) {
            console.log(snapshot.val());
        } else {
            console.log("Keine Daten vorhanden!");
        }
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
    }
}

// export for using in other files
export { database, contactsRef, fetchContacts };