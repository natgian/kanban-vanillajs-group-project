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
      return;
    }
    document.querySelector('input[name="Email"]').value = user.email;
    document.querySelector('input[name="Password"]').value = user.password;
    localStorage.setItem("currentUser", "Guest");
    window.location.href = "../pages/summary.html";
  } catch (e) {
    console.error("Error loading guest data:", e);
    showMessage("Something went wrong. Please try again later.");
  }
});

/**
 * Handles login form submission:
 * Validates the entered credentials against the Firebase database.
 * If the credentials are valid, stores the current user's name or email
 * in localStorage and redirects to the summary page.
 * If invalid, displays a temporary error message.
 *
 * @event submit
 * @returns {Promise<void>} A Promise that resolves after validation and redirection or message display.
 */
document.querySelector("form").addEventListener("submit", async (e) => {
  if (!e.target.checkValidity()) return;
  e.preventDefault();
  const email = e.target.querySelector('input[name="Email"]').value.trim();
  const password = e.target.querySelector('input[name="Password"]').value.trim();
  const emailInput = document.getElementById("name");
  const passwordInput = document.getElementById("password"); 
  const msg = document.getElementById("error-message");
  const showMessage = (t) => {
    msg.textContent = t;
    msg.classList.remove("d-none");
    msg.classList.add("fade-in");
    emailInput.classList.add("red-border");
    passwordInput.classList.add("red-border");
    setTimeout(() => {
        msg.classList.remove("fade-in");
        msg.classList.add("fade-out");
        emailInput.classList.remove('red-border');
        passwordInput.classList.remove('red-border');
        setTimeout(() => {
            msg.classList.add("d-none"); // Versteckt wieder die Meldung
            msg.textContent = "";
        }, 500);
    }, 3000);
  };
  try {
    const data = await (await fetch(`${databasURL}users.json`)).json();
    const user = Object.values(data || {}).find((u) => u.email === email);
    if (user?.password === password) {
      localStorage.setItem("currentUser", user.name || user.email);
      window.location.href = "../pages/summary.html";
    } else {
      showMessage(user ? "Incorrect password." : "Email not registered.");
    }
  } catch (err) {
    console.error("Login error:", err);
    showMessage("Login failed. Please try again later.");
  }
});