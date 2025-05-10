const baseURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app";

const taskDetailsRef = document.getElementById("task-overlay");
const taskDetailsContentRef = document.getElementById("task-overlay-content");

let allTasks = [];

/**
 * This function initiates the fetching, grouping and rendering of the tasks when the board page is loaded
 */
async function init() {
  allTasks = await fetchTasks();
  renderBoard();
}

/**
 * Fetches the tasks from the database
 *
 * @returns - an array of objects with the fetched tasks
 */
async function fetchTasks() {
  try {
    const response = await fetch(`${baseURL}/tasks.json`);
    const data = await response.json();
    if (!data) return [];
    const tasks = Object.values(data);
    return tasks;
  } catch (error) {
    console.error("Something went wrong:", error);
  }
}

/**
 * Fetches one specific task
 *
 * @param {string} taskId - the ID of the specific task
 * @returns - an task object containing all information of the specific task
 */
async function fetchSpecificTask(taskId) {
  const response = await fetch(`${baseURL}/tasks/${taskId}.json`);
  const task = await response.json();
  return task;
}

/**
 * Renders all tasks grouped by their status (to do, in progress, awaiting feedback, done) onto the board
 */
function renderBoard() {
  const statuses = ["to-do", "in-progress", "awaiting-feedback", "done"];

  if (!allTasks || allTasks.length === 0) {
    statuses.forEach((status) => {
      renderTasks([], status);
    });
    return;
  }

  statuses.forEach((status) => {
    const filteredByStatus = allTasks.filter((task) => task.status === status);
    renderTasks(filteredByStatus, status);
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
  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  const assignedTo = Array.isArray(task.assignedTo) ? task.assignedTo : [];

  const assignedToHTML = assignedTo.map((person) => `<div class="task-card-avatar" style="background-color: ${person.color}">${person.initials}</div>`).join("");

  const subtasksTotal = subtasks.length;
  const subtasksDone = subtasks.filter((subt) => subt.done).length;
  const progressPercent = subtasksTotal > 0 ? (subtasksDone * 100) / subtasksTotal : 0;

  return { assignedToHTML, subtasksTotal, subtasksDone, progressPercent };
}

/**
 * Opens the task details overlay and prevents background scrolling
 *
 * @param {string} id - ID of the task that should be opened
 */
function openTaskDetails(taskId) {
  taskDetailsRef.classList.toggle("show");
  document.body.classList.add("no-scroll");
  taskDetailsRef.addEventListener("click", outsideClickHandler);
  renderTaskDetails(taskId);
}

/**
 * Closes the task details overlay and enables scrolling
 *
 * @param {string} id - ID of the task that should be closed
 */
function closeTaskDetails() {
  taskDetailsRef.classList.toggle("show");
  document.body.classList.remove("no-scroll");
  taskDetailsRef.removeEventListener("click", outsideClickHandler);
}

/**
 * Renders the details of the task in the overlay
 *
 * @param {string} taskId - ID of the current task
 */
function renderTaskDetails(taskId) {
  const currentTask = allTasks.find((task) => task.taskId === taskId);
  const { assignedToDetailHTML, subtasksHTML } = prepareTaskOverlayData(currentTask);
  taskDetailsContentRef.innerHTML = taskOverlayTemplate(currentTask, assignedToDetailHTML, subtasksHTML);
}

/**
 * Prepares the 'assigned to' and 'subtasks' data to be displayed in the task details overlay
 *
 * @param {Object} task - A task object containing assigned users and subtasks
 * @returns - An object with HTML for assigned users und subtasks
 */
function prepareTaskOverlayData(task) {
  const assignedTo = Array.isArray(task.assignedTo) ? task.assignedTo : [];
  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  const assignedToDetailHTML = assignedTo.map((person) => assignedToDetailTemplate(person)).join("");
  const subtasksHTML = subtasks.map((subtask, index) => subtasksTemplate(subtask, index, task)).join("");

  return { assignedToDetailHTML, subtasksHTML };
}

/**
 * Updates the completion state of a subtask
 *
 * @param {number} subtaskIndex - Index number of the subtask
 * @param {string} taskId - ID of the current task
 */
async function updateSubtaskCompletion(subtaskIndex, taskId) {
  try {
    const task = await fetchSpecificTask(taskId);
    task.subtasks[subtaskIndex].done = !task.subtasks[subtaskIndex].done;

    await fetch(`${baseURL}/tasks/${taskId}/subtasks.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task.subtasks),
    });

    init();
  } catch (err) {
    console.error("Update failed:", err);
  }
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
