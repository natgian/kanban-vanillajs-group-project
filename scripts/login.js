const databasURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Initializes the page and runs essential startup functions.
 */
function init() {
  let loader = document.getElementById('loader');
  let logo = document.getElementById('logo');
  logo.classList.add('fly');
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1500);
}

/**
 * Opens the sign-up page when the button is clicked.
 */
document.getElementById("signUpBtn").addEventListener("click", function () {
  window.location.href = "./pages/signUp.html";
});

/**
 * Logs in as a guest by loading predefined user data
 * from the database and filling the login form fields.
 */
document.getElementById("guestLoginBtn").addEventListener("click", async () => {
  try {
    const res = await fetch(`${databasURL}users/user1.json`);
    const user = await res.json();
    if (!res.ok || !user?.email || !user?.password) {
      alert("User data could not be loaded.");
      return;
    }
    document.querySelector('input[name="Email"]').value = user.email;
    document.querySelector('input[name="Password"]').value = user.password;
  } catch (e) {
    console.error("Error loading user data:", e);
    alert("An error occurred.");
  }
});

/**
 * Handles login form submission: validates user credentials from Firebase,
 * shows a fade-in/out message for incorrect login attempts, and redirects on success.
 * 
 * @param {Event} e - The form submit event triggered by the user.
 */
document.querySelector('form').addEventListener('submit', async (e) => {
  if (!e.target.checkValidity()) return;
  e.preventDefault();
  const email = e.target.querySelector('input[name="Email"]').value.trim();
  const password = e.target.querySelector('input[name="Password"]').value.trim();
  const msg = Object.assign(document.getElementById('loginMessage'), { textContent: "", className: "" });
  const showMessage = t => {
    msg.textContent = t; msg.classList.add("fade-in");
    setTimeout(() => {
      msg.classList.replace("fade-in", "fade-out");
      setTimeout(() => msg.textContent = "", 500);
    }, 3000);
  };
  try {
    const users = Object.values(await (await fetch(`${databasURL}users.json`)).json() || {});
    const u = users.find(u => u.email === email);
    u && u.password === password ? location.href = "../pages/summary.html" : showMessage(u ? "Incorrect password." : "Email not registered.");
  } catch (err) {
    console.error("Login error:", err); showMessage("Login failed. Please try again later.");
  }
});