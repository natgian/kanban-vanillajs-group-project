const baseURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app";

const taskDetailsRef = document.getElementById("task-overlay");
const taskDetailsContentRef = document.getElementById("task-overlay-content");

let allTasks = [];
let currentDraggedElement;
let currentOpenMenu = null;

/**
 * This function initiates the fetching and rendering of the tasks when the board page is loaded and adds an event listener to the task search input field.
 *
 */
async function init() {
  allTasks = await fetchTasks();
  initSearch();
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
function renderBoard(tasks = allTasks) {
  const statuses = ["to-do", "in-progress", "awaiting-feedback", "done"];

  if (!tasks || tasks.length === 0) {
    statuses.forEach((status) => {
      renderTasks([], status);
    });
    return;
  }

  statuses.forEach((status) => {
    const filteredByStatus = tasks.filter((task) => task.status === status);
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

  outsideClickHandlerForOverlay(taskDetailsContentRef, closeTaskDetails);
  // taskDetailsRef.addEventListener("click", outsideClickHandler);
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

  // taskDetailsRef.removeEventListener("click", outsideClickHandler);
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
  } catch (error) {
    console.error("Update failed:", error);
  }
}

/**
 * Deletes the task, closes the task details view, shows a confirmation message and renitializes the task board
 *
 * @param {string} taskId - ID of the current task
 */
async function deleteTask(taskId) {
  try {
    await fetch(`${baseURL}/tasks/${taskId}.json`, {
      method: "DELETE",
    });

    closeTaskDetails();
    showMessage("Task successfully deleted");
    init();
  } catch (error) {
    console.error("Task deletion failed:", error);
  }
}

/**
 * Renders the edit task template inside the task overlay.
 * Stops the event from bubbling up and fetches the task data based on its ID,
 * then replaces the overlay content with the corresponding edit form.
 *
 * @param {string} taskId - ID of the current task
 * @param {Event} event - The click event that triggered the function
 */
function renderEditTaskTemplate(taskId, event) {
  event.stopPropagation();
  const currentTask = allTasks.find((task) => task.taskId === taskId);
  const formattedDueDate = currentTask.dueDate.split("/").reverse().join("-");
  // const { assignedToDetailHTML, subtasksHTML } = prepareTaskOverlayData(currentTask);
  taskDetailsContentRef.innerHTML = taskOverlayEditTaskTemplate(currentTask, formattedDueDate);
}

/**
 * Filters the list of tasks based on a search term entered by the user.
 * Search term must have minimum 3 characters and it filters by title or description.
 *
 * @param {Event} event - The input event triggered by the user typing in the search input
 * @returns - a new array including the tasks found with the search term
 */
function searchTasks(event) {
  const searchTerm = event.target.value.trim().toLowerCase();

  if (searchTerm.length < 3) {
    renderBoard();
    return;
  }

  const filteredTasks = allTasks.filter((task) => {
    const title = (task.title || "").toLowerCase();
    const description = (task.description || "").toLowerCase();
    return title.includes(searchTerm) || description.includes(searchTerm);
  });

  renderBoard(filteredTasks);
}

/**
 * Adds an event listener to the 'Find Task' search input field
 *
 */
function initSearch() {
  const searchInput = document.getElementById("find-task");
  if (searchInput) {
    searchInput.addEventListener("input", searchTasks);
  }
}

/**
 * Sets the ID of the task currently being dragged
 *
 * @param {string} taskId - ID of the task currently being dragged
 */
function startDragging(taskId) {
  currentDraggedElement = taskId;
  document.getElementById(`card${currentDraggedElement}`).classList.add("dragging");
}

/**
 * Removes the "dragging" class from the task card when the dragging ends (no matter if it is dragged
 * inside a drag area or not)
 */
function endDragging() {
  document.getElementById(`card${currentDraggedElement}`).classList.remove("dragging");
}

/**
 * Allows the drop event to occur by preventing the default behaviour
 *
 * @param {DragEvent} event - The dragover event triggered when dragging over a drop element
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Highlights the drop area while a task is being dragged over it
 *
 * @param {string} status - The status column ID where the task can be dropped
 */
function highlightDropArea(status) {
  document.getElementById(status).classList.add("drag-area-highlight");
}

/**
 * Removes the highlight from a drop area when the task is no longer dragged over it
 *
 * @param {string} status - The status column ID from which the highlight should be removed
 */
function removeHighlight(status) {
  document.getElementById(status).classList.remove("drag-area-highlight");
}

/**
 * Moves the currently dragged task to a new status and updates the backend and re-initializes the board
 *
 * @param {string} status - The status column ID where the task should be moved to
 */
async function moveTo(status) {
  document.getElementById(status).classList.remove("drag-area-highlight");
  try {
    await fetch(`${baseURL}/tasks/${currentDraggedElement}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status }),
    });
    document.getElementById(`card${currentDraggedElement}`).classList.remove("dragging");
    init();
  } catch (error) {
    console.error("Failed to move task:", error);
  }
}

//TODO:
function openMoveToMenu(event, taskId, status) {
  event.stopPropagation();
  const menuRef = document.getElementById(`move-to-menu${taskId}`);
  const items = menuRef.querySelectorAll("li");

  if (isMenuOpen(menuRef)) {
    closeMoveToMenu(menuRef);
    return;
  }

  closePreviousOpenMenu(menuRef);
  showMenu(menuRef);
  updateDisabledMenuItem(items, status);
  outsideClickHandlerForMenu(menuRef);
}

function isMenuOpen(menuRef) {
  return !menuRef.classList.contains("hide");
}

function closePreviousOpenMenu(menuRef) {
  if (currentOpenMenu && currentOpenMenu !== menuRef) {
    currentOpenMenu.classList.add("hide");
  }
}

function showMenu(menuRef) {
  menuRef.classList.remove("hide");
  currentOpenMenu = menuRef;
}

function updateDisabledMenuItem(items, status) {
  items.forEach((item) => {
    const text = item.textContent.trim().toLowerCase().replace(/\s/g, "-");
    if (text === status) {
      item.classList.add("disabled");
    } else {
      item.classList.remove("disabled");
    }
  });
}

function closeMoveToMenu(menuRef) {
  menuRef.classList.add("hide");
}

function outsideClickHandlerForMenu(menuRef) {
  function handleClick(event) {
    if (!menuRef.contains(event.target)) {
      closeMoveToMenu(menuRef);
      document.removeEventListener("click", handleClick);
    }
  }
  requestAnimationFrame(() => {
    document.addEventListener("click", handleClick);
  });
}

function outsideClickHandlerForOverlay(overlayRef, closeFn) {
  function handleClick(event) {
    if (!overlayRef.contains(event.target)) {
      closeFn();
      document.removeEventListener("click", handleClick);
    }
  }
  requestAnimationFrame(() => {
    document.addEventListener("click", handleClick);
  });
}
