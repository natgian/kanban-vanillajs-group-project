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

  renderTaskDetails(taskId);
}

/**
 * Closes the task overlay and enables scrolling
 *
 */
function closeTaskOverlay() {
  document.addEventListener("click", function (event) {
    if (event.target.id === "task-overlay") {
      taskOverlayRef.classList.remove("show");
      document.body.classList.remove("no-scroll");
    }
  });
}

/**
 * Closes the overlay by removing the "show" and "no-scroll" classes from the elements
 *
 * @param {HTMLElement} overlayRef - The overelay element to be closed
 */
function closeOverlay(overlayRef) {
  overlayRef.classList.remove("show");
  document.body.classList.remove("no-scroll");
}

/**
 * Opens the add task overlay and disables background scrolling
 *
 */
function openAddTaskOverlay() {
  addTaskOverlayRef.classList.add("show");
  document.body.classList.add("no-scroll");
}

/**
 * closes the add task overlay, enables scrolling, resets fields and addTaskStatus
 *
 */
function closeAddTaskOverlay() {
  document.addEventListener("click", function (event) {
    if (event.target.id === "add-task-overlay") {
      addTaskOverlayRef.classList.remove("show");
      document.body.classList.remove("no-scroll");
      initReset();
    }
  });
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

    closeOverlay(taskOverlayRef);
    showMessage("Task successfully deleted", "../assets/icons/check_icon.svg", "Success");
    initBoard();
  } catch (error) {
    console.error("Task deletion failed:", error);
  }
}

/**
 * Gets the subtasks values and creates an array of objects containing the subtasks. Each subtask is
 * initialized with 'done: false'.
 *
 * @returns {Array<Object>} - An array of subtask objects
 */
function getSubtasks(currentSubtasks = []) {
  const subtaskList = document.getElementById("subtaskList");
  const subtasks = [];

  if (!subtaskList || subtaskList.querySelectorAll("li").length === 0) {
    return currentSubtasks;
  }

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
