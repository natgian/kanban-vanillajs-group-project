const taskOverlayRef = document.getElementById("task-overlay");
const taskOverlayContentRef = document.getElementById("task-overlay-content");
const addTaskOverlayRef = document.getElementById("add-task-overlay");
const addTaskOverlayContentRef = document.getElementById("add-task-overlay-content");
const addTaskWrapperRef = document.getElementById("add-task-wrapper");

let currentOutsideClickHandler = null;

/**
 * Opens the task details overlay and prevents background scrolling
 *
 * @param {string} id - ID of the task that should be opened
 */
function openTaskOverlay(taskId) {
  taskOverlayRef.classList.add("show");
  document.body.classList.add("no-scroll");

  setupOutsideClickHandler(taskOverlayContentRef, closeTaskOverlay);
  renderTaskDetails(taskId);
}

/**
 * Closes the task overlay and enables scrolling
 *
 */
function closeTaskOverlay() {
  taskOverlayRef.classList.remove("show");
  document.body.classList.remove("no-scroll");
}

/**
 * Opens the add task overlay, disables background scrolling and sets up the outside click listener
 *
 */
function openAddTaskOverlay() {
  addTaskOverlayRef.classList.add("show");
  document.body.classList.add("no-scroll");

  // setupOutsideClickHandler(addTaskWrapperRef, closeAddTaskOverlay);
}

function closeOverlay() {
  document.addEventListener("click", function (event) {
    if (event.target.id === "add-task-overlay") {
      closeAddTaskOverlay();
    }
  });
}

/**
 * Checks the screen width, if the screen with is equal or under 905px it redirects to the addTask.html
 * page. If not, it opens the Add Task Overlay.
 *
 */
function openAddTask() {
  const screenWidth = window.innerWidth;

  if (screenWidth <= 905) {
    window.location.href = "./addTask.html";
  } else {
    openAddTaskOverlay();
  }
}

/**
 * closes the add task overlay and enables scrolling
 *
 */
function closeAddTaskOverlay() {
  addTaskOverlayRef.classList.remove("show");
  document.body.classList.remove("no-scroll");
  initReset();
}

/**
 * Renders the add task template in the overlay
 *
 */
function renderAddTaskContent() {
  addTaskOverlayContentRef.innerHTML = renderAddTask();
}

/**
 * Renders the details of the task in the overlay
 *
 * @param {string} taskId - ID of the current task
 */
function renderTaskDetails(taskId) {
  const currentTask = allTasks.find((task) => task.taskId === taskId);
  const { assignedToDetailHTML, subtasksHTML, formattedDueDate } = prepareTaskOverlayData(currentTask);
  taskOverlayContentRef.innerHTML = taskOverlayTemplate(currentTask, assignedToDetailHTML, subtasksHTML, formattedDueDate);
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
  const formattedDueDate = task.dueDate.split("-").reverse().join("/");
  const assignedToDetailHTML = assignedTo.map((person) => assignedToDetailTemplate(person)).join("");
  const subtasksHTML = subtasks.map((subtask, index) => subtasksTemplate(subtask, index, task)).join("");

  return { assignedToDetailHTML, subtasksHTML, formattedDueDate };
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

    initBoard();
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

    closeTaskOverlay();
    showMessage("Task successfully deleted");
    initBoard();
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

  taskOverlayContentRef.innerHTML = taskOverlayEditTaskTemplate(currentTask, formattedDueDate);
  taskOverlayContentRef.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  initEditTask(currentTask);
}

/**
 * Get the changed data from the current task and updates the database
 *
 * @param {string} taskId - ID of the current task
 */
function updateTask(taskId) {
  const updatedTask = getUpdatedTaskData(taskId);
  updateEditedTaskinDB(taskId, updatedTask);
}

/**
 * Updates the task changes in the database then re-initializes the board
 *
 * @param {string} taskId - ID of the current task
 * @param {Object} updatedTask - The updated task data to be saved in the database
 */
async function updateEditedTaskinDB(taskId, updatedTask) {
  try {
    await fetch(`${baseURL}/tasks/${taskId}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    closeTaskOverlay();
    initBoard();
    setTimeout(() => {
      showMessage("Task successfully updated");
    }, 500);
  } catch (error) {
    console.error("Something went wrong:", error);
  }
}

/**
 * Gets the updated task values and returns a new task object
 *
 * @param {*} taskId - ID of the current task
 * @returns {Object} - The updated task object with the new values
 */
function getUpdatedTaskData(taskId) {
  const currentTask = allTasks.find((task) => task.taskId === taskId);
  const updatedPriority = document.querySelector('input[name="priority"]:checked')?.value || null;
  const updatedTitle = document.getElementById("edit-title-input")?.value || "";
  const updatedDescription = document.getElementById("edit-desc-textarea")?.value || "";
  const updatedDueDate = document.getElementById("date-input")?.value || "";

  return createUpdatedTask(currentTask, updatedPriority, updatedTitle, updatedDescription, updatedDueDate);
}

/**
 * Creates a new task object with the updated values
 *
 * @param {Object} currentTask - The original task object
 * @param {string} updatedPriority - The updated priority value
 * @param {string} updatedTitle - The updated title value
 * @param {string} updatedDescription - The updated description value
 * @param {string} updatedDueDate - The updated description value
 * @returns {Object} - The new task object with the updated values
 */
function createUpdatedTask(currentTask, updatedPriority, updatedTitle, updatedDescription, updatedDueDate) {
  return {
    assignedTo: getSelectedContacts(),
    category: currentTask.category,
    description: updatedDescription,
    dueDate: updatedDueDate,
    priority: updatedPriority,
    status: currentTask.status,
    subtasks: getSubtasks(currentTask.subtasks),
    taskId: currentTask.taskId,
    title: updatedTitle,
  };
}

/**
 * Gets the values (name, color, initials) from all selected contacts
 *
 * @returns {Array<Object>} - An array of objects containing the data of each selected contacts
 */
function getSelectedContacts() {
  const selectedContacts = [];

  document.querySelectorAll(".hidden-checkbox:checked").forEach((checkbox) => {
    const option = checkbox.closest(".option");
    const avatar = option.querySelector(".task-card-avatar");
    selectedContacts.push({
      name: checkbox.value,
      color: avatar.dataset.color,
      initials: avatar.textContent.trim(),
    });
  });

  return selectedContacts;
}

/**
 * Gets the subtasks values and creates an array of objects containing the subtasks. Each subtask is
 * initialized with 'done: false'.
 *
 * @returns {Array<Object>} - An array of subtask objects
 */
function getSubtasks(currentSubtasks) {
  const subtaskList = document.getElementById("subtaskList");
  const subtasks = [];

  if (!subtaskList) return currentSubtasks || [];

  subtaskList.querySelectorAll("li").forEach((subtask) => {
    const textItem = subtask.querySelector(".subtask-text");
    if (!textItem) return;

    const subtaskText = textItem.textContent.trim();
    const existing = currentSubtasks.find((s) => s.subtask === subtaskText);

    subtasks.push({ done: existing ? existing.done : false, subtask: subtaskText });
  });

  return subtasks;
}

/**
 * Renders the list of subtasks into the "subtaskList" element
 *
 * @param {Array<Object>} subtasks - An array of subtask objects
 * @returns if there ist no "subtaskList" or "subtasks" is not an array
 */
function renderSubtasks(subtasks) {
  const subtaskList = document.getElementById("subtaskList");
  if (!subtaskList || !Array.isArray(subtasks)) return;

  subtaskList.innerHTML = "";

  subtasks.forEach((subtask) => {
    if (subtask.subtask) {
      const subtaskElement = createSubtaskElement(subtask.subtask);
      subtaskList.appendChild(subtaskElement);
    }
  });
}

/**
 * Checks which contacts are assigned and updates the UI accordingly by selecting the options
 *
 * @param {Array<Object>} assignedTo - Array of assigned contact objects
 */
function checkAssignedToContacts(assignedTo) {
  const options = document.querySelectorAll(".option");

  options.forEach((option) => {
    const name = option.dataset.value;
    const isAssigned = assignedTo.some((person) => person.name === name);

    if (isAssigned) {
      const checkbox = option.querySelector(".hidden-checkbox");
      if (!checkbox.checked) {
        selectEditOption(option);
      }
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
