//------DIESEN CODE FREIGEBEN SOBALD WIR DURCH SIND MIT DER ENTWICKLUNG!! -----//
// /**
//  * Checks if user is logged in, if not, it redirects the user to the login page.
//  * This ensures that the user has no access login protected pages (Summary, Add Task, Board, Contacts).
//  *
//  */
// if (!localStorage.getItem("currentUser")) {
//   window.location.href = "../index.html";
// }

/**
 * Renders the current user's initials into the profile UI element
 */
function renderUserInitials() {
  const userInitials = getCurrentUserInitials();
  const userProfileRef = document.getElementById("user-profile-initials");
  if (userProfileRef) {
    userProfileRef.textContent = userInitials;
  }
}

document.addEventListener("DOMContentLoaded", renderUserInitials);

/**
 * Gets the current user from the local storage. If there is no current user it returns en empty string.
 * If the current user is "Guest" it returns the string "G", otherwise it returns the initials of the
 * current user.
 *
 * @returns - A string with the current user's initials or an empty string if there is no current user
 */
function getCurrentUserInitials() {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return "";

  if (currentUser === "Guest") {
    return "G";
  }
  const userNameArray = currentUser.trim().split(" ");
  const firstInitial = userNameArray[0]?.charAt(0).toUpperCase() || "";
  const secondInitial = userNameArray.length > 1 ? userNameArray[1].charAt(0).toUpperCase() : "";

  return firstInitial + secondInitial;
}

/**
 * Logs out the current user, shows a confirmation message and redirects to the login page
 *
 */
function logout() {
  localStorage.removeItem("currentUser");
  showMessage("Logging out...");
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 500);
}

/**
 * Displays a temporary message by adding a "show" class to the message box element.
 * The message box is shown for 1.5 seconds and then automatically hidden.
 */
function showMessage(text) {
  const messageBox = document.getElementById("message-box");
  const messageText = document.getElementById("message-text");
  messageBox.classList.add("show");
  messageText.innerText = text;

  setTimeout(() => {
    messageBox.classList.remove("show");
  }, 1500);
}
