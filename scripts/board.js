const baseURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app";

const taskDetailsRef = document.getElementById("task-overlay");
const taskDetailsContentRef = document.getElementById("task-overlay-content");

function init() {
  fetchTasks();
}

/**
 * Opens the task details overlay and prevents background scrolling
 *
 * @param {string} id - ID of the task that should be opened
 */
function openTaskDetails(id) {
  taskDetailsRef.classList.toggle("show");
  document.body.classList.add("no-scroll");
  taskDetailsRef.addEventListener("click", outsideClickHandler);
}

/**
 * Closes the task details overlay and enables scrolling
 *
 * @param {string} id - ID of the task that should be closed
 */
function closeTaskDetails(id) {
  taskDetailsRef.classList.toggle("show");
  document.body.classList.remove("no-scroll");
  taskDetailsRef.removeEventListener("click", outsideClickHandler);
}

/**
 * Enables closing the task details overlay when clicking outside the content
 *
 * @param {*} event - clicking event
 */
function outsideClickHandler(event) {
  if (!taskDetailsContentRef.contains(event.target)) {
    closeTaskDetails();
  }
}

/**
 * Fetches the tasks from the database
 *
 * @returns - an array with the fetched tasks
 */
async function fetchTasks() {
  try {
    const response = await fetch(`${baseURL}/tasks.json`);
    const data = await response.json();
    const tasks = Object.values(data);
    console.log(tasks);
    return tasks;
  } catch (error) {
    console.error("Something went wrong:", error);
  }
}
