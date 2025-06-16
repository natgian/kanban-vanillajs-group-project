/**
 * The base URL of the Firebase Realtime Database.
 * @constant {string}
 */
const databasURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app/";

/** @type {HTMLButtonElement} */
const signupbutton = document.getElementById("signupbutton");

/** @type {HTMLInputElement} */
const checkbox = document.getElementById("checkbox");

/** @type {HTMLElement} */
const passwordError = document.getElementById("passwordError");

/** @type {HTMLElement} */
const accountError = document.getElementById("accountError");

/** @type {HTMLFormElement} */
const form = document.querySelector("form");


/**
 * Initializes the signup form state.
 */
function init() {
  updateSignupState();
}

/**
 * Updates the state of the signup button based on the checkbox.
 */
function updateSignupState() {
  signupbutton.disabled = !checkbox.checked;
}

/**
 * Validates form fields and checks if the password matches the confirmation.
 * 
 * @param {string} password - The password entered by the user.
 * @param {string} confirmpassword - The confirmed password entered by the user.
 * @returns {boolean} - True if the form is valid and passwords match; otherwise false.
 */
function formAndPasswordIf(password, confirmpassword) {
  const confirmInput = document.getElementById('confirmpassword');

  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }

  if (password !== confirmpassword) {
    passwordError.classList.remove("d-none");
    confirmInput.classList.add('red-border');
    console.log(confirmInput.classList)
    return false;
  } else {
    passwordError.classList.add("d-none");
  }

  return true;
}

/**
 * Checks if the email address already exists in the database.
 * 
 * @param {string} email - The email to check.
 * @returns {Promise<string|null>} - The user ID if the email exists, or null otherwise.
 */
async function checkIfEmailExists(email) {
  try {
    let response = await fetch(databasURL + ".json");
    let responseJSON = await response.json();

    for (let id in responseJSON) {
      const user = responseJSON[id];
      if (user.email === email) {
        return id;
      }
    }
    return null;
  } catch (error) {
    console.error("Fehler bei der Datenbankabfrage:", error);
    alert("Es gab ein Problem bei der Registrierung. Bitte versuchen Sie es später noch einmal.");
    return null;
  }
}

/**
 * Saves a new user's data to the Firebase Realtime Database.
 * 
 * @param {{name: string, email: string, password: string, acceptedPolicy: boolean}} data - The user data to store.
 * @returns {Promise<void>}
 */
async function saveUserData(data) {
  try {
    await fetch(databasURL + "users.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Fehler bei der Datenbankabfrage:", error);
    alert("Es gab ein Problem bei der Registrierung. Bitte versuchen Sie es später noch einmal.");
  }
}

/**
 * Gathers form input, validates it, checks for duplicates, and saves the new user.
 * Redirects to the summary page if successful.
 * 
 * @returns {Promise<void>}
 */
async function postData() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmpassword = document.getElementById("confirmpassword").value;

  if (!formAndPasswordIf(password, confirmpassword)) {
    return;
  }

  const existingID = await checkIfEmailExists(email);

  if (existingID !== null) {
    accountError.classList.remove("d-none");
    return;
  } else {
    accountError.classList.add("d-none");
    const data = {
      name: name,
      email: email,
      password: password,
      acceptedPolicy: checkbox.checked,
    };

    await saveUserData(data);
    localStorage.setItem("currentUser", name);
  }
  window.location.href = "summary.html";
  form.reset();
}

/**
 * Navigates the user back to the login page.
 */
function backToLogin() {
  window.location.href = "/index.html";
}