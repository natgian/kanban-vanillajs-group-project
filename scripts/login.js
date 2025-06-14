const databasURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Starts the app: triggers the logo animation
 * and hides the loading screen after a short delay.
 */
function init() {
  const loader = document.getElementById("loader");
  const logo = document.getElementById("logo");
  logo.classList.add("fly");
  setTimeout(() => {
    loader.classList.add("hidden");
  }, 1500);
}

/**
 * Redirects the user to the sign-up page
 * when the "Sign up" button is clicked.
 */
function changeToSignup(){
  window.location.href = "../pages/signUp.html";
}

/**
 * Handles guest login button click:
 * Fetches predefined guest user data from the Firebase database.
 * If successful, fills in the email and password fields,
 * stores the guest user name in localStorage,
 * and redirects to the guest summary page.
 * If the fetch fails or data is incomplete, shows an alert message.
 *
 * @event click
 * @returns {Promise<void>} A Promise that resolves after processing the guest login.
 */
document.getElementById("guestLoginBtn").addEventListener("click", async () => {
  try {
    const res = await fetch(`${databasURL}users/user1.json`);
    const user = await res.json();
    if (!res.ok || !user?.email || !user?.password) {
      alert("Guest data could not be loaded.");
      return;}
    document.querySelector('input[name="Email"]').value = user.email;
    document.querySelector('input[name="Password"]').value = user.password;
    localStorage.setItem("currentUser", "Guest");
    window.location.href = "../pages/summary.html";
  } catch (e) {
    console.error("Error loading guest data:", e);
    showMessage("Something went wrong. Please try again later.");
  }
});

document.querySelector("form").addEventListener("submit", handleSubmit);
/**
 * Handles the form submission, including validation, user authentication,
 * and redirecting or displaying error messages.
 * @param {Event} e - The submit event triggered by the form.
 */
async function handleSubmit(e) {
  if (!e.target.checkValidity()) return;
  e.preventDefault();
  const { email, password } = getFormValues(e.target);
  const elements = getFormElements();
  try {
    const user = await findUserByEmail(email);
    if (user?.password === password) {
      loginUser(user);
    } else {
      showError(elements, user ? "Incorrect password." : "Email not registered.");
    }
  } catch (err) {
    console.error("Login error:", err);
    showError(elements, "Login failed. Please try again later.");
  }
}

/**
 * Extracts and returns the email and password input values from the form.
 * @param {HTMLFormElement} form - The form element containing the inputs.
 * @returns {{ email: string, password: string }} The extracted email and password.
 */
function getFormValues(form) {
  return {
    email: form.querySelector('input[name="Email"]').value.trim(),
    password: form.querySelector('input[name="Password"]').value.trim(),
  };
}

/**
 * Retrieves important DOM elements used for error display and styling.
 * @returns {{ emailInput: HTMLElement, passwordInput: HTMLElement, msg: HTMLElement }} The required DOM elements.
 */
function getFormElements() {
  return {
    emailInput: document.getElementById("name"),
    passwordInput: document.getElementById("password"),
    msg: document.getElementById("error-message"),
  };
}

/**
 * Fetches all users from the database and returns the one matching the provided email.
 * @param {string} email - The email to search for.
 * @returns {Promise<Object|undefined>} The user object if found; otherwise undefined.
 */
async function findUserByEmail(email) {
  const res = await fetch(`${databasURL}users.json`);
  const data = await res.json();
  return Object.values(data || {}).find((u) => u.email === email);
}

/**
 * Logs in the user by storing their data in local storage and redirecting to the summary page.
 * @param {Object} user - The user object containing at least email or name.
 */
function loginUser(user) {
  localStorage.setItem("currentUser", user.name || user.email);
  window.location.href = "../pages/summary.html";
}

/**
 * Displays an error message with animation and highlights the email and password inputs.
 * @param {{ emailInput: HTMLElement, passwordInput: HTMLElement, msg: HTMLElement }} elements - Elements to update for error display.
 * @param {string} text - The error message text to display.
 */
function showError({ emailInput, passwordInput, msg }, text) {
  msg.textContent = text;
  msg.classList.remove("d-none");
  msg.classList.add("fade-in");
  emailInput.classList.add("red-border");
  passwordInput.classList.add("red-border");

  setTimeout(() => hideError({ emailInput, passwordInput, msg }), 3000);
}

/**
 * Hides the currently displayed error message and resets the styles of inputs.
 * @param {{ emailInput: HTMLElement, passwordInput: HTMLElement, msg: HTMLElement }} elements - Elements to reset after hiding error.
 */
function hideError({ emailInput, passwordInput, msg }) {
  msg.classList.remove("fade-in");
  msg.classList.add("fade-out");
  emailInput.classList.remove("red-border");
  passwordInput.classList.remove("red-border");

  setTimeout(() => {
    msg.classList.add("d-none");
    msg.textContent = "";
  }, 500);
}