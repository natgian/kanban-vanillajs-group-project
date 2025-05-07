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
 * Handles the form submission for user login.
 * 
 * Validates the form using HTML5 validation, fetches users from the Firebase database,
 * compares credentials, and redirects to the summary page if a match is found.
 * Otherwise, displays an error message.
 * 
 * @param {SubmitEvent} e - The form submit event.
 */
document.querySelector('form').addEventListener('submit', async (e) => {
  if (!e.target.checkValidity()) return;
  e.preventDefault();

  const email = e.target.querySelector('input[name="Email"]').value.trim();
  const password = e.target.querySelector('input[name="Password"]').value.trim();

  try {
    const res = await fetch(`${databasURL}users.json`);
    const users = await res.json();
    const match = Object.values(users || {}).find(u => u.email === email && u.password === password);

    if (match) window.location.href = "../pages/summary.html";
    else alert("No matching user found. Please sign up first.");
  } catch (err) {
    console.error("Login error:", err);
    alert("An error occurred while trying to log in.");
  }
});