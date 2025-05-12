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
  renderTasks(todo, "to-do");
  renderTasks(inProgress, "in-progress");
  renderTasks(awaitingFeedback, "awaiting-feedback");
  renderTasks(done, "done");
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
 * Groupes the tasks by status into arrays of task objects (todo, in progress etc.)
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

/**
 * Renders the task cards into the specified container element on the board.
 * If there are not tasks, it displays a message.
 *
 * @param {Array} tasksArray - Array of task objects to render
 * @param {string} containerId - ID of the container element where the tasks should be rendered
 */
function renderTasks(tasksArray, containerId) {
  const container = document.getElementById(containerId);
  let cardHTML = "";

  if (tasksArray.length === 0) {
    cardHTML += noTasksTemplate(containerId);
  } else {
    tasksArray.forEach((task) => {
      const { assignedToHTML, subtasksTotal, subtasksDone, progressPercent } = prepareTaskDisplayData(task);

      cardHTML += cardTemplate(task, subtasksTotal, subtasksDone, progressPercent, assignedToHTML);
    });
  }
  container.innerHTML = cardHTML;
}

/**
 * Prepares the data to be displayed in the card including avatars and subtasks progress information
 *
 * @param {Object} task - A task object containing assigned users and subtasks
 * @returns - An object with HTML for assigned users, total subtasks, total of completed subtasks and progress percentage
 */
function prepareTaskDisplayData(task) {
  const assignedToHTML = task.assignedTo.map((person) => `<div class="task-card-avatar" style="background-color: ${person.color}">${person.initials}</div>`).join("");

  const subtasksTotal = task.subtasks.length;
  const subtasksDone = task.subtasks.filter((subt) => subt.done).length;
  const progressPercent = subtasksTotal > 0 ? (subtasksDone * 100) / subtasksTotal : 0;

  return { assignedToHTML, subtasksTotal, subtasksDone, progressPercent };
}
