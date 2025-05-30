const baseURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app";

const contacts = [
  {
    email: "anna.schmitt@example.com",
    monogram: "AS",
    monogramColor: "#FF7A00",
    name: "Anna Schmitt",
    phone: "+4915112345678",
  },
  {
    email: "benno.meier@example.com",
    monogram: "BM",
    monogramColor: "#FF5EB3",
    name: "Benno Meier",
    phone: "+4915234567890",
  },
  {
    email: "carla.unger@example.com",
    monogram: "CU",
    monogramColor: "#6E52FF",
    name: "Carla Unger",
    phone: "+4915345678901",
  },
  {
    email: "david.schwarz@example.com",
    monogram: "DS",
    monogramColor: "#9327FF",
    name: "David Schwarz",
    phone: "+4915456789012",
  },
  {
    email: "emily.hartmann@example.com",
    monogram: "EH",
    monogramColor: "#00BEE8",
    name: "Emily Hartmann",
    phone: "+4915567890123",
  },
  {
    email: "fabian.klein@example.com",
    monogram: "FK",
    monogramColor: "#1FD7C1",
    name: "Fabian Klein",
    phone: "+4915678901234",
  },
  {
    email: "greta.voelker@example.com",
    monogram: "GV",
    monogramColor: "#FF745E",
    name: "Greta Völker",
    phone: "+4915789012345",
  },
  {
    email: "hannes.zimmer@example.com",
    monogram: "HZ",
    monogramColor: "#FFA35E",
    name: "Hannes Zimmer",
    phone: "+4915890123456",
  },
  {
    email: "isabel.kranz@example.com",
    monogram: "IK",
    monogramColor: "#FC71FF",
    name: "Isabel Kranz",
    phone: "+4915901234567",
  },
  {
    email: "jonas.reuter@example.com",
    monogram: "JR",
    monogramColor: "#FFC701",
    name: "Jonas Reuter",
    phone: "+4916012345678",
  },
];

/**
 * Creates example tasks to add to the Firebase database
 *
 */
async function seedContacts() {
  for (const contact of contacts) {
    try {
      const response = await fetch(`${baseURL}/contacts.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });

      const postData = await response.json();
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  }
}

seedContacts();
