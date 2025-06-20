//------DIESEN CODE FREIGEBEN SOBALD WIR DURCH SIND MIT DER ENTWICKLUNG!! -----//
/**
 * Checks if user is logged in, if not, it redirects the user to the login page.
 * This ensures that the user has no access login protected pages (Summary, Add Task, Board, Contacts).
 *
 */
if (!localStorage.getItem("currentUser")) {
  window.location.href = "../index.html";
}

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
  showMessage("Logging out...", "../assets/icons/check_icon.svg", "Success");
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 1000);
}

/**
 * Displays a temporary message with optional icon.
 * The message is shown by adding a class based on device type and is hidden after 2 seconds.
 *
 * @param {string} text - The message text to display
 * @param {string} iconPath - Optional path to an icon to display alongside the message
 * @param {string} altText - Optional alt text for the icon
 */
function showMessage(text, iconPath, altText) {
  const { messageBox, messageText, messageIcon } = getMessageElements();
  const deviceClass = getDeviceClass();

  setTextAndIcon(text, iconPath, altText, messageText, messageIcon);

  messageBox.classList.remove("hide", "desktop", "mobile");
  messageBox.classList.add("show", deviceClass);

  setTimeout(() => {
    messageBox.classList.remove("show");
    messageBox.classList.add("hide");
  }, 2000);
}

/**
 * Retrieves the DOM elements related to the message box display
 *
 * @returns {Object} - An object containing the message box container, text element, and icon element
 */
function getMessageElements() {
  const messageBox = document.getElementById("message-box");
  const messageText = document.getElementById("message-text");
  const messageIcon = document.getElementById("message-icon");

  return { messageBox, messageText, messageIcon };
}

/**
 * Returns the device class based on the current screen width
 *
 * @returns {string} - "mobile" if screen width < 1080px, otherwise "desktop"
 */
function getDeviceClass() {
  return window.innerWidth < 1080 ? "mobile" : "desktop";
}

/**
 * Sets the text and optionally the icon for the message box
 *
 * @param {string} text - The message text to display.
 * @param {string} iconPath - The path to the icon image
 * @param {string} altText - The alt text for the icon image (optional)
 * @param {HTMLElement} messageText - The element where the text will be inserted
 * @param {HTMLImageElement} messageIcon - The image element for displaying the icon
 */
function setTextAndIcon(text, iconPath, altText, messageText, messageIcon) {
  messageText.textContent = text;

  if (iconPath && messageIcon) {
    messageIcon.src = iconPath;
    messageIcon.alt = altText || ""; // altText can be empty
  }
}

/**
 * Navigates the browser to the previous page in the session history.
 *
 * This function mimics the behavior of the browser's back button.
 * If there is no previous page in the history, the function does nothing.
 */
function goBack() {
  window.history.back();
}

/**
 * Closes the header navigation dropdown if the user clicks outside of it
 *
 * @param {event} - The click event triggered by the user
 */
document.addEventListener("click", (event) => {
  const nav = document.querySelector(".header-nav");
  const checkbox = document.getElementById("header-nav-dropdown-toggle");

  if (checkbox && !nav.contains(event.target)) {
    checkbox.checked = false;
  }
});

/**
 * Makes sure the header navigation dropdown is closed when the page is (re)loaded.
 * Using the "pageshow" event instead of "DOMContentLoaded" because it also runs when the user goes
 * back to the page using the browser's back button. In that case, the browser may restore the
 * previous state, including the open menu.
 * This makes sure the menu is always closed when the page loads.
 */
window.addEventListener("pageshow", () => {
  const checkbox = document.getElementById("header-nav-dropdown-toggle");
  if (checkbox) checkbox.checked = false;
});
