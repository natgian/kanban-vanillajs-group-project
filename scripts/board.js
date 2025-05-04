const taskDetailsRef = document.getElementById("task-overlay");
const taskDetailsContentRef = document.getElementById("task-overlay-content");

/**
 * This function opens the task details and prevents background scrolling
 *
 * @param {string} id - This is the id of the task that should be opened
 */
function openTaskDetails(id) {
  taskDetailsRef.classList.toggle("show");
  document.body.classList.add("no-scroll");
  taskDetailsRef.addEventListener("click", outsideClickHandler);
}

/**
 * This function closes the task details and and enables scrolling
 *
 * @param {string} id - This is the id of the task that should be closed
 */
function closeTaskDetails(id) {
  taskDetailsRef.classList.toggle("show");
  document.body.classList.remove("no-scroll");
  taskDetailsRef.removeEventListener("click", outsideClickHandler);
}

/**
 * This function enables closing the task details overlay when clicking outside the content
 *
 * @param {*} event - This is the clicking event
 */
function outsideClickHandler(event) {
  if (!taskDetailsContentRef.contains(event.target)) {
    closeTaskDetails();
  }
}
