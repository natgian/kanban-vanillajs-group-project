const baseURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app";

const taskDetailsRef = document.getElementById("task-overlay");
const taskDetailsContentRef = document.getElementById("task-overlay-content");

let todo = [];
let inProgress = [];
let awaitingFeedback = [];
let done = [];

async function init() {
  const tasks = await fetchTasks();
  groupTasksByStatus(tasks);
  console.log(todo);
  console.log(inProgress);
  console.log(awaitingFeedback);
  console.log(done);
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
 * @param {Event} event - clicking event
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
    return tasks;
  } catch (error) {
    console.error("Something went wrong:", error);
  }
}

/**
 *
 * @param {Array<Object>} tasks - array of task objects with a "status" property
 */
function groupTasksByStatus(tasks) {
  tasks.forEach((task) => {
    switch (task.status) {
      case "todo":
        todo.push(task);
        break;
      case "in-progress":
        inProgress.push(task);
        break;
      case "awaiting-feedback":
        awaitingFeedback.push(task);
        break;
      case "done":
        done.push(task);
    }
  });
}
