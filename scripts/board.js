const taskDetailsRef = document.getElementById("task-overlay");

/**
 * This function opens the task details and prevents background scrolling
 *
 * @param {string} id - This is the id of the task that should be opened
 */
function openTaskDetails(id) {
  taskDetailsRef.classList.toggle("show");
  taskDetailsRef.classList.add("active");
  document.body.classList.add("no-scroll");
}

/**
 * This function closes the task details and and enables scrolling
 *
 * @param {string} id - This is the id of the task that should be closed
 */
function closeTaskDetails(id) {
  taskDetailsRef.classList.toggle("show");
  taskDetailsRef.classList.add("active");
  document.body.classList.remove("no-scroll");
}
