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
document.getElementById("signUpBtn").addEventListener("click", () => {
  window.location.href = "./pages/signUp.html";
});

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
    alert("Something went wrong. Please try again later.");
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
      loginUser(user);
    } else {
      showError(elements, user ? "Incorrect password." : "Email not registered.");
    }
  } catch (err) {
    console.error("Login error:", err);
    showMessage("Login failed. Please try again later.");
  }
});