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
const passwordError = document.getElementById("password-error");

/** @type {HTMLElement} */
const emailError = document.getElementById("email-error");

/** @type {HTMLElement} */
const accountError = document.getElementById("account-error");

/** @type {HTMLFormElement} */
const form = document.querySelector("form");

const fields = [
  { id: "name", validate: validateSignupName, errorId: "name-error" },
  { id: "email", validate: validateSignupEmail, errorId: "email-error" },
  { id: "password", validate: validateSignupPassword, errorId: "password-error" },
  { id: "confirmpassword", validate: validatePasswordMatch, errorId: "password-match-error" },
];

/**
 * Initializes the signup form state and initiates the input fields live validation.
 */
function init() {
  updateSignupState();
  initSignupLiveValidation();
}

/**
 * Updates the state of the signup button based on the checkbox.
 */
function updateSignupState() {
  signupbutton.disabled = !checkbox.checked;
}

/**
 * Initializes live validation on signup input fields.
 * Adds a "blur" event listener to each input to validate the field when the user leaves it.
 * If the value is invalid, a corresponding error message is shown.
 * Adds a "focus" event listener to hide the message when the user clicks into the input field.
 *
 */
function initSignupLiveValidation() {
  fields.forEach(({ id, validate, errorId }) => {
    const input = document.getElementById(id);
    const errorElement = document.getElementById(errorId);
    if (!input || !errorElement) return;

    input.addEventListener("blur", () => {
      const value = input.value.trim();
      if (value === "") {
        errorElement.classList.add("d-none");
        return;
      }

      const isValid = validate(value);
      toggleSignupValidationMessage(isValid, errorId);
    });

    input.addEventListener("focus", () => {
      errorElement.classList.add("d-none");
    });
  });
}

/**
 * Checks if the name is in a valid format
 *
 * @param {string} name - The full name to validate
 * @returns - "true" if the name is valid, otherwise "false"
 */
function validateSignupName(name) {
  const fullNamePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ'’\-]+(?: [A-Za-zÀ-ÖØ-öø-ÿ'’\-]+)+$/;
  return fullNamePattern.test(name.trim());
}

/**
 * Checks if the email is in a valid format
 *
 * @param {string} email - The email address
 * @returns - "true" if the email is valid, otherwise "false"
 */
function validateSignupEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email.trim());
}

/**
 * Checks if the password is in a valid format
 *
 * @param {string} password - The password
 * @returns - "true" if the password is valid, otherwise "false"
 */
function validateSignupPassword(password) {
  return password.trim().length >= 6;
}

/**
 *
 * @param {string} confirmPassword - The confirmation password
 * @returns - "true" if the password is and confirmPassword are the same, otherwise "false"
 */
function validatePasswordMatch(confirmPassword) {
  const password = document.getElementById("password").value;
  return confirmPassword === password;
}

/**
 * Shows or hides the validation message
 *
 * @param {boolean} isValid - Is the input valid (true or false)
 * @param {string} elementId - The ID of the validation message element
 */
function toggleSignupValidationMessage(isValid, elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.classList.toggle("d-none", isValid);
}

/**
 * Validates the full signup form (name, email, password and password match)
 *
 * @returns {boolean} - True if all validations pass
 */
function validateSignupForm() {
  const { name, email, password, confirmPassword } = getFormValues();

  let isValid = true;

  if (!validateSignupName(name)) {
    toggleSignupValidationMessage(false, "name-error");
    isValid = false;
  }

  if (!validateSignupEmail(email)) {
    toggleSignupValidationMessage(false, "email-error");
    isValid = false;
  }

  if (!validateSignupPassword(password)) {
    toggleSignupValidationMessage(false, "password-error");
    isValid = false;
  }

  if (!validatePasswordMatch(confirmPassword)) {
    toggleSignupValidationMessage(false, "password-match-error");
    isValid = false;
  }

  return isValid;
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
    console.error("Error during database query:", error);
    showMessage("There was a problem with the registration. Please try again later.", "../assets/icons/close.svg", "error");
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
    console.error("Error during database query:", error);
    showMessage("There was a problem with the registration. Please try again later.", "../assets/icons/close.svg", "error");
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
    confirmPassword: document.getElementById("confirmpassword").value,
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
async function maybeSaveContact() {
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
  showMessage("You signed up successfully", "../assets/icons/check_icon.svg", "Success");
  form.reset();
  setTimeout(() => {
    window.location.href = "../index.html?skipAnimation=true";
  }, 1000);
}

/**
 * Displays an error on the email input field and hides it after 3 seconds.
 */
function showEmailError() {
  const confirmEmailInput = document.getElementById("email");
  accountError.classList.remove("d-none");
  confirmEmailInput.classList.add("red-border");

  setTimeout(() => {
    confirmEmailInput.classList.remove("red-border");
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
  const { name, email, password } = getFormValues();
  if (!validateSignupForm()) return;

  if (await validateEmailUniqueness(email)) {
    return;
  }

  await saveUser({ name, email, password });
  await maybeSaveContact();
  finishSignUp(name);
}

/**
 * Navigates the user back to the login page.
 */
function backToLogin() {
  window.location.href = "../index.html?skipAnimation=true";
}
