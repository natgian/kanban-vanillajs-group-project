let requiredEditInputs = [];

/**
 * Initializes the edit task overlay, sets up event listeners, validation, dropdowns, subtasks and
 * loads the contact data
 *
 * @param {Object} task - The current task object
 */
async function initEditTask(task) {
  initializeObserveDropdownChanges();
  updateSelectedContactsDisplay();
  initializeCloseAllDropdowns();
  initializeSubtasksimulateInputClick();
  initializeResetAllOptions();
  updateEditSubmitButtonState();
  requiredEditInputs = getRequiredEditInputs();
  initInputValidationListener(requiredEditInputs);
  initEditSubtasks();
  renderSubtasks(task.subtasks);
  const contacts = await fetchContacts();
  const assignedTo = task.assignedTo || [];
  loadEditContacts(contacts, assignedTo);
}

/**
 * Gets the required input elements for editing a task
 *
 * @returns - An array of input elements that are required
 */
function getRequiredEditInputs() {
  const title = document.getElementById("edit-title-input");
  const date = document.getElementById("date-input");
  return [title, date];
}

/**
 * Checks if all required edit inputs are valid
 *
 * @returns - "True" if all required inputs are valid, otherwise "false"
 */
function areEditInputsValid() {
  return requiredEditInputs.every((input) => input.checkValidity());
}

/**
 * Updates the edit submit button's disabled state based on validity check
 *
 */
function updateEditSubmitButtonState() {
  const editSubmitButton = document.getElementById("edit-submit-btn");
  editSubmitButton.disabled = !areEditInputsValid();
}

/**
 * Initializes the input listeners to validate and update the submit button
 *
 * @param {Array} requiredEditInputs - An array containing the required input elements
 */
function initInputValidationListener(requiredEditInputs) {
  requiredEditInputs.forEach((input) => {
    input.addEventListener("input", updateEditSubmitButtonState);
  });
}

/**
 * Handles selection behavior when an option is clicked
 *
 * @param {HTMLElement} element - The option element
 * @param {Event} event - The event triggering the selection
 */
function selectEditOption(element, event = null) {
  const checkbox = element.querySelector(".hidden-checkbox");

  if (!event || event.target !== checkbox) {
    checkbox.click();
  }

  applySelectionStyles(element, checkbox.checked);
}

/**
 * Gets the DOM references related to editing subtasks
 *
 * @returns - an object containing references to input, add button, delete confirmation, and the
 * container element.
 *
 */
function getSubtaskRefs() {
  const input = document.getElementById("newEditSubtask"); // GEÄNDERT!! //
  const addSubtask = document.getElementById("addSubtask");
  const confirmDelete = document.getElementById("confirmDeleteNewSubtask");
  const subtaskContainer = document.querySelector(".subtask-container");

  return { input, addSubtask, confirmDelete, subtaskContainer };
}

/**
 * Returns an event handler that hides the add button, shows the delete confirmation, and focuses the
 * input
 *
 * @param {{ addSubtask: HTMLElement, confirmDelete: HTMLElement, input: HTMLInputElement }} - Elements
 * involved in toggling the UI state for editing subtasks
 * @returns - Event handler to be used on input click
 */
function showConfirmDeleteOnEdit({ addSubtask, confirmDelete, input }) {
  return function (event) {
    addSubtask.style.display = "none";
    confirmDelete.style.display = "flex";

    if (input) {
      input.focus();
    }

    event.stopPropagation();
  };
}

/**
 * Returns a function that resets the subtask input and related UI elements to their initial state
 *
 * @param {{ addSubtask: HTMLElement, confirmDelete: HTMLElement, input: HTMLInputElement }} - Elements
 * involved in resetting the UI state
 * @returns - Function that resets the UI
 */
function resetElementsOnEdit({ addSubtask, confirmDelete, input }) {
  return function () {
    addSubtask.style.display = "block";
    confirmDelete.style.display = "none";
    input.value = "";
  };
}

/**
 * Returns an event handler that resets the subtask UI if a click occurs outside the container
 *
 * @param {HTMLElement} subtaskContainer - The container element to detect outside clicks
 * @param {() => void} closeFunction - The function to call when clicking outside the container
 * @returns - Event handler for outside clicks
 */
function resetOnOutsideClickOnEdit(subtaskContainer, closeFunction) {
  return function (event) {
    if (!subtaskContainer.contains(event.target)) {
      closeFunction();
    }
  };
}

/**
 * Initializes the editing functionality for subtasks by adding event listeners and making helper
 * functions globally accessible
 *
 */
function initEditSubtasks() {
  const { input, addSubtask, confirmDelete, subtaskContainer } = getSubtaskRefs();
  const showConfirmDelete = showConfirmDeleteOnEdit({ addSubtask, confirmDelete, input });
  const resetElements = resetElementsOnEdit({ addSubtask, confirmDelete, input });
  // Make function globally accessible
  window.resetElements = resetElements;
  window.showConfirmDelete = showConfirmDelete;
  // Add event listeners
  input.addEventListener("click", showConfirmDelete);
  document.addEventListener("click", resetOnOutsideClickOnEdit(subtaskContainer, resetElements));
}

/**
 * Adds a new subtask item to the list (on the edit task overlay)
 *
 */
function addSubtaskOnEdit() {
  const input = document.getElementById("newEditSubtask");
  const subtaskList = document.getElementById("subtaskList");
  if (!input || !subtaskList || !input.value.trim()) return;

  const listItem = createSubtaskElement(input.value.trim());
  subtaskList.appendChild(listItem);

  resetInput(input);
  toggleButtons(true);
}

/**
 * Inserts contacts into the template and checks if there are already assigned contacts
 *
 * @param {Array<Object>} contacts - Array of objects containing all contacts
 * @param {Array<Object>} assignedTo - Aarray of contact objects assigned to the task
 */
async function loadEditContacts(contacts, assignedTo) {
  if (!contacts.length) return;

  const contactList = document.getElementById("contact-list");
  contactList.innerHTML = "";

  contacts.forEach((person) => addContactToTemplate(person));

  setTimeout(() => {
    checkAssignedToContacts(assignedTo);
  }, 0);
}

/**
 * Renders the edit task template inside the task overlay.
 * Fetches the task data based on its ID, then replaces the overlay content with the corresponding edit form.
 *
 * @param {string} taskId - ID of the current task
 */
function renderEditTaskTemplate(taskId) {
  const currentTask = allTasks.find((task) => task.taskId === taskId);
  const formattedDueDate = currentTask.dueDate.split("/").reverse().join("-");
  const today = new Date().toISOString().split("T")[0];

  taskOverlayContentRef.innerHTML = taskOverlayEditTaskTemplate(currentTask, formattedDueDate, today);

  initEditTask(currentTask);
}

/**
 * Get the changed data from the current task and updates the database
 *
 * @param {string} taskId - ID of the current task
 */
function updateTask(taskId) {
  const updatedTask = getUpdatedTaskData(taskId);
  updateEditedTask(taskId, updatedTask);
}

/**
 * Updates the task changes in the database then re-initializes the board
 *
 * @param {string} taskId - ID of the current task
 * @param {Object} updatedTask - The updated task data to be saved in the database
 */
async function updateEditedTask(taskId, updatedTask) {
  try {
    await fetch(`${baseURL}/tasks/${taskId}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    closeOverlay(taskOverlayRef);
    initBoard();
    setTimeout(() => {
      showMessage("Task successfully updated", "../assets/icons/check_icon.svg", "Success");
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
    assignedTo: getSelectedContactsData(),
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
