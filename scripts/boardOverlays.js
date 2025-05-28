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
  setupOutsideClickHandler(addTaskWrapperRef, closeAddTaskOverlay);
}

/**
 * closes the add task overlay and enables scrolling
 *
 */
function closeAddTaskOverlay() {
  addTaskOverlayRef.classList.remove("show");
  document.body.classList.remove("no-scroll");
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
  const { assignedToDetailHTML, subtasksHTML } = prepareTaskOverlayData(currentTask);
  taskOverlayContentRef.innerHTML = taskOverlayTemplate(currentTask, assignedToDetailHTML, subtasksHTML);
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

    closeTaskOverlay();
    showMessage("Task successfully deleted");
    init();
  } catch (error) {
    console.error("Task deletion failed:", error);
  }
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

  initEditTaskFields(currentTask);
}

function updateTask(taskId) {
  const updatedTask = getUpdatedTaskData(taskId);
  updateEditedTaskinDB(taskId, updatedTask);
}

async function updateEditedTaskinDB(taskId, updatedTask) {
  try {
    await fetch(`${baseURL}/tasks/${taskId}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    closeTaskOverlay();
    init();
    setTimeout(() => {
      showMessage("Task successfully updated");
    }, 1500);
  } catch (error) {
    console.error("Something went wrong:", error);
  }
}

function getUpdatedTaskData(taskId) {
  const currentTask = allTasks.find((task) => task.taskId === taskId);
  const updatedPriority = document.querySelector('input[name="priority"]:checked')?.value || null;
  const updatedTitle = document.getElementById("edit-title-input")?.value || "";
  const updatedDescription = document.getElementById("edit-desc-textarea")?.value || "";
  const updatedDueDate = document.getElementById("date-input")?.value || "";

  return createUpdatedTask(currentTask, updatedPriority, updatedTitle, updatedDescription, updatedDueDate);
}

function createUpdatedTask(currentTask, updatedPriority, updatedTitle, updatedDescription, updatedDueDate) {
  return {
    assignedTo: getSelectedContacts(),
    category: currentTask.category,
    description: updatedDescription,
    dueDate: updatedDueDate,
    priority: updatedPriority,
    status: currentTask.status,
    subtasks: getSubtasks(),
    taskId: currentTask.taskId,
    title: updatedTitle,
  };
}

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

function getSubtasks() {
  const subtaskList = document.getElementById("subtaskList");
  const subtasks = [];

  if (!subtaskList) return subtasks;

  subtaskList.querySelectorAll("li").forEach((subtask) => {
    const textItem = subtask.querySelector(".subtask-text");

    if (textItem) subtasks.push({ done: false, subtask: textItem.textContent.trim() });
  });

  return subtasks;
}
