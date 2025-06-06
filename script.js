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

/**
 * Logs out the current user and redirects to the login page
 *
 */
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "../index.html";
}
