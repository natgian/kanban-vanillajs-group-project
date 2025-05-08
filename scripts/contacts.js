const databaseURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app/contacts";

const colorsObject = {
  red: "#FF0000",
  blue: "#0000FF",
  green: "#008000",
  yellow: "#FFFF00",
  orange: "#FFA500",
  purple: "#800080",
  pink: "#FFC0CB",
  brown: "#A52A2A",
  teal: "#008080",
  lime: "#00FF00"
};

let contactStore = {};

function init() {
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

    contactStore = contactsData;

    let groupContacts = groupContactsByLetter(contactsData);

    let abilityContacts = generateGroupContactsHTML(groupContacts);


    document.getElementById('contact-list-body').innerHTML = abilityContacts;

  } catch (error) {
    console.error('Fehler bei der Datenbankabfrage:', error);
    alert("Es gab ein Problem bei der Registrierung. Bitte versuchen Sie es später noch einmal.");
  }
}

function groupContactsByLetter(contactsData) {
  let groupContacts = {};

  for (let key in contactsData) {
    if (contactsData.hasOwnProperty(key)) {
      let contact = contactsData[key]; 

      if(!contact.id){
        contact.id = key;
      }

      if (!contact.monogramColor) {
        contact.monogramColor = getRandomColor();
        saveContactColor(key, contact.monogramColor); 
      }

      let firstLetter = contact.name.charAt(0).toUpperCase();

      if (!groupContacts[firstLetter]) {
        groupContacts[firstLetter] = [];
      }
      groupContacts[firstLetter].push(contact);
    }
  }

  return groupContacts;
}

function generateGroupContactsHTML(groupContacts){
  let abilityContacts = '';

    for (let letter in groupContacts) {
      abilityContacts += `
        <div class="letter-section">
          <div class="letter">${letter}</div>
          ${groupContacts[letter].map(contact => templateContacts(contact)).join('')}
        </div>
      `;
    }
    return abilityContacts;   
}

async function saveContactColor(contactKey, color){
  const contactRef = databaseURL + '/' + contactKey + '.json';
  await fetch(contactRef,{
    method: 'PATCH',
    body: JSON.stringify({
      monogramColor: color
    })
  });
}

function showContactDetails(id){
  const contact = contactStore[id];
  if(!contact){
    return console.error('Kontakt nicht gefunden:', id);
  }
  console.log(contact.monogramColor);
  document.getElementById('contenttop').innerHTML = templateContactsDetails(contact);
}