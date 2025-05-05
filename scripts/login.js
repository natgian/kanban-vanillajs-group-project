const databasURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * This function is required to start the page and to load essential functions.
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
 * Handles the sign-up button click event.
 * Redirects the user to the sign-up page located at ./pages/signUp.html.
 *
 * @event click
 * @function
 * @returns {void}
 */
document.getElementById("signUpBtn").addEventListener("click", function () {
    window.location.href = "./pages/signUp.html";
});


/**
 * Handles the guest login button click event.
 * Fetches predefined guest user data from the Firebase Realtime Database
 * and automatically fills the email and password input fields.
 *
 * Source path: /users/user1 in the database.
 *
 * @event click
 * @function
 * @async
 * @returns {void}
 */
document.getElementById("guestLoginBtn").addEventListener("click", async () => {
  try {
    const res = await fetch(`${databasURL}users/user1.json`);
    const user = await res.json();
    if (!res.ok || !user?.email || !user?.password) {
      alert("Benutzerdaten konnten nicht geladen werden.");
      return;
    }
    document.querySelector('input[name="Email"]').value = user.email;
    document.querySelector('input[name="Password"]').value = user.password;
  } catch (e) {
    console.error("Fehler beim Laden:", e);
    alert("Ein Fehler ist aufgetreten.");
  }
});