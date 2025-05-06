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
