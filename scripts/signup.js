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

    setTimeout(() => {
      passwordError.classList.add('d-none');
      confirmInput.classList.remove('red-border');
    }, 3000);
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
    let response = await fetch(databasURL + "users.json");
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
 * Extracts and returns the input values from the sign-up form.
 *
 * @returns {Object} An object containing name, email, password, and confirmpassword.
 */
function getFormValues() {
  return {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value,
    confirmpassword: document.getElementById("confirmpassword").value
  };
}

/**
 * Saves a new user's data to the database.
 *
 * @param {Object} data - The user information.
 * @param {string} data.name - The user's name.
 * @param {string} data.email - The user's email.
 * @param {string} data.password - The user's password.
 * @returns {Promise<void>}
 */
async function saveUser(data) {
  const userData = {
    name: data.name,
    email: data.email,
    password: data.password,
    acceptedPolicy: checkbox.checked,
  };
  await saveUserData(userData);
}

/**
 * Optionally creates a new contact entry for the user
 * if no duplicate exists.
 *
 * @param {Object} param0 - The user contact information.
 * @param {string} param0.name - The user's name.
 * @param {string} param0.email - The user's email.
 * @returns {Promise<void>}
 */
async function maybeSaveContact({ name, email }) {
  const contactData = buildContactData();
  if (!isDuplicate(contactData)) {
    await postContact(contactData);
  }
}

/**
 * Finalizes the signup process:
 * stores current user, redirects to summary, and resets form.
 *
 * @param {string} name - The name of the signed-up user.
 */
function finishSignUp(name) {
  localStorage.setItem("currentUser", name);
  window.location.href = "summary.html";
  form.reset();
}

/**
 * Displays an error on the email input field and hides it after 3 seconds.
 */
function showEmailError() {
  const confirmEmailInput = document.getElementById('email');
  accountError.classList.remove("d-none");
  confirmEmailInput.classList.add('red-border');

  setTimeout(() => {
    confirmEmailInput.classList.remove('red-border');
    accountError.classList.add("d-none");
  }, 3000);
}

/**
 * Checks if the email already exists in the database and shows an error if it does.
 * 
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean>} - Returns true if the email exists, otherwise false.
 */
async function validateEmailUniqueness(email) {
  if (await checkIfEmailExists(email)) {
    showEmailError();
    return true;
  }
  return false;
}

/**
 * Collects form input, validates password and confirmation, checks for duplicate emails,
 * saves the new user, and completes the signup process.
 * 
 * @returns {Promise<void>} - Resolves when the signup process is complete.
 */
async function postData() {
  const { name, email, password, confirmpassword } = getFormValues();

  if (!formAndPasswordIf(password, confirmpassword)) return;

  if (await validateEmailUniqueness(email)) {
    return;
  }

  await saveUser({ name, email, password });
  await maybeSaveContact({ name, email });
  finishSignUp(name);
}


/**
 * Navigates the user back to the login page.
 */
function backToLogin() {
  window.location.href = "/index.html";
}