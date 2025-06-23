let allTasks = [];
let currentDraggedElement;
let currentOpenMenu = null;
let boardAddTaskAlreadyInitialized = false;

/**
 * This function initiates the fetching and rendering of the tasks when the board page is loaded and adds an event listener to the task search input field.
 *
 */
async function initBoard() {
  allTasks = await fetchTasks();
  initSearch();
  renderBoard();
  renderAddTaskContent();
}

/**
 * Initializes the "Add Task" overlay or redirects to the mobile version
 *
 */
async function initBoardAddTask() {
  openAddTask();

  if (!boardAddTaskAlreadyInitialized) {
    initializePriorityButtons();
    initializeObserveDropdownChanges();
    initializeCloseAllDropdowns();
    initializeSubtasksButtons();
    initializeSubtasksimulateInputClick();
    initializeResetAllOptions();
    noBehindDate();
    const contacts = await fetchContacts();
    loadContacts(contacts);
    boardAddTaskAlreadyInitialized = true;
  }

  openAddTaskOverlay();
  updateSelectedContactsDisplay();
}

/**
 * Checks the screen width, if the screen with is equal or under 1080px it redirects to the addTask.html
 * page. If not, it opens the Add Task Overlay.
 *
 */
function openAddTask() {
  const screenWidth = window.innerWidth;

  if (screenWidth <= 1080) {
    window.location.href = "./addTask.html";
    return;
  }
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

  const assignedToHTML = assignedTo
    .map((person) => `<div class="task-card-avatar" style="background-color: ${person.color}">${person.initials}</div>`)
    .slice(0, 5)
    .join("");

  const subtasksTotal = subtasks.length;
  const subtasksDone = subtasks.filter((subt) => subt.done).length;
  const progressPercent = subtasksTotal > 0 ? (subtasksDone * 100) / subtasksTotal : 0;

  return { assignedToHTML, subtasksTotal, subtasksDone, progressPercent };
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
 * Moves the currently dragged task to a new status, updates the backend and re-initializes the board
 *
 * @param {string} newStatus - The status column ID where the task should be moved to
 */
async function moveTo(newStatus) {
  document.getElementById(newStatus).classList.remove("drag-area-highlight");
  try {
    await updateTaskStatus(currentDraggedElement, newStatus);
    document.getElementById(`card${currentDraggedElement}`).classList.remove("dragging");
    initBoard();
  } catch (error) {
    console.error("Failed to move task:", error);
  }
}

/**
 * Moves the current task to the new clicked status, updates the backend and re-initializes the board
 *
 * @param {string} taskId - The ID of the task that should be moved
 * @param {string} newStatus - The status column ID where the task should be moved to
 */
async function moveToByClick(taskId, newStatus) {
  try {
    await updateTaskStatus(taskId, newStatus);
    initBoard();
  } catch (error) {
    console.error("Failed to move task:", error);
  }
}

/**
 * Updates the new status of the task in the database
 *
 * @param {string} taskId taskId - The ID of the task that should be moved
 * @param {string} newStatus - The status column ID where the task should be moved to
 */
async function updateTaskStatus(taskId, newStatus) {
  await fetch(`${baseURL}/tasks/${taskId}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });
}

/**
 * Opens the "Move To" menu for a specific task when the corresponding button is clicked.
 * Closes any previously open menus, disables the current status item in the menu and
 * sets up a click handler to close the menu when clicking outside.
 * If the same menu is already open, it will close on click.
 *
 * @param {Event} event - The click event
 * @param {string} taskId - The ID of the task for which the menu is opened
 * @param {string} status - The current status of the task (to-do, in-progress...)
 */
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
  setupOutsideClickHandler(menuRef, () => closeMoveToMenu(menuRef));
}

/**
 * Checks if the menu is open
 *
 * @param {HTMLElement} menuRef - The DOM element of the menu to check
 * @returns {boolean} - Returns 'true' if the menu is visible, otherwise 'false'
 */
function isMenuOpen(menuRef) {
  return !menuRef.classList.contains("hide");
}

/**
 * Closes the menu by adding the 'hide' class
 *
 * @param {HTMLElement} menuRef - The DOM element of the menu to close
 */
function closeMoveToMenu(menuRef) {
  menuRef.classList.add("hide");
}

/**
 * Closes the previously opened menu if it is different from the currently opened one
 *
 * @param {HTMLElement} menuRef - The DOM element of the menu that is being opened
 */
function closePreviousOpenMenu(menuRef) {
  if (currentOpenMenu && currentOpenMenu !== menuRef) {
    currentOpenMenu.classList.add("hide");
  }
}

/**
 * Shows the menu of the currently clicked task by removing the 'hide' class and sets it as the
 * current open menu.
 *
 * @param {HTMLElement} menuRef - The DOM element of the menu that is being opened
 */
function showMenu(menuRef) {
  menuRef.classList.remove("hide");
  currentOpenMenu = menuRef;
}

/**
 * Iterates through the items and checks the status, if it's equal to the current status it is
 * disabled. Otherwise the 'disabled' class is removed.
 *
 * @param {NodeListOf<HTMLElement>} items - List of menu item elements
 * @param {string} status - The current status fo the task (to-do, in-progress...)
 */
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

/**
 * Sets up a click listener that triggers a function when a click occurs outside the element.
 * Makes sure only one outside click listener is active by removing any previous one.
 *
 * @param {HTMLElement} ref - The element to monitor for outside clicks
 * @param {Function} closeFunction - The function to call when an outside click is detected
 *
 */
function setupOutsideClickHandler(ref, closeFunction) {
  removeClickHandler();

  currentOutsideClickHandler = function (event) {
    if (!ref.contains(event.target)) {
      closeFunction();
      removeClickHandler();
    }
  };

  // // Delays adding the click listener to avoid catching the opening click event
  requestAnimationFrame(() => {
    document.addEventListener("click", currentOutsideClickHandler);
  });
}

/**
 * Removes the current outside click listener (if there is one)
 *
 */
function removeClickHandler() {
  if (currentOutsideClickHandler) {
    document.removeEventListener("click", currentOutsideClickHandler);
    currentOutsideClickHandler = null;
  }
}
