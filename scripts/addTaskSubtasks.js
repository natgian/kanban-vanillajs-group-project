/**
 * Deletes a subtask from the list.
 *
 * @param {HTMLElement} element - The delete button inside the subtask item.
 */
function deleteSubtask(element) {
  const listItem = element.closest("li"); // Finds the corresponding <li> element
  if (listItem) {
    listItem.remove(); // Removes the <li> from the list
  }
}

/**
 * Toggles the edit mode for a list item.
 *
 * @param {HTMLElement} element - The element triggering edit mode.
 */
function toggleEditMode(element) {
  const listItem = element.closest("li");
  if (!listItem) return;

  const { textElement, editDelate, deleteChange } = getElements(listItem);
  if (!textElement || !editDelate || !deleteChange) return;

  listItem.dataset.originalText = textElement.innerText;
  applyEditStyles(listItem, textElement, editDelate, deleteChange);
  document.addEventListener("click", resetEditMode);
}

/**
 * Retrieves required elements within a list item.
 *
 * @param {HTMLElement} listItem - The list item containing elements.
 * @returns {Object} An object containing the required elements.
 */
function getElements(listItem) {
  return {
    textElement: listItem.querySelector("#editableText"),
    editDelate: listItem.querySelector("#editDelate"),
    deleteChange: listItem.querySelector("#deleteChange"),
  };
}

/**
 * Applies editing styles and properties.
 *
 * @param {HTMLElement} listItem - The list item being edited.
 * @param {HTMLElement} textElement - The editable text element.
 * @param {HTMLElement} editDelate - The edit button element.
 * @param {HTMLElement} deleteChange - The delete button element.
 */
function applyEditStyles(listItem, textElement, editDelate, deleteChange) {
  listItem.classList.add("editing");
  listItem.style.backgroundColor = "white";
  editDelate.style.display = "none";
  deleteChange.style.display = "flex";

  textElement.contentEditable = true;
  textElement.focus();
}

/**
 * Resets edit mode if clicking outside the editing area.
 *
 * @param {Event} event - The event triggering the reset.
 */
function resetEditMode(event) {
  const listItem = document.querySelector(".editing");
  if (listItem && !listItem.contains(event.target)) {
    cancelEditMode(listItem, listItem.dataset.originalText);
    document.removeEventListener("click", resetEditMode);
  }
}

/**
 * Cancels editing and restores the original text.
 *
 * @param {HTMLElement} listItem - The list item being edited.
 * @param {string} originalText - The original text before editing.
 */
function cancelEditMode(listItem, originalText) {
  const { textElement, editDelate, deleteChange } = getElements(listItem);
  if (!textElement || !editDelate || !deleteChange) return;

  textElement.innerText = originalText;
  textElement.contentEditable = false;
  removeEditStyles(listItem, editDelate, deleteChange);
}

/**
 * Removes editing styles and restores display settings.
 *
 * @param {HTMLElement} listItem - The list item being edited.
 * @param {HTMLElement} editDelate - The edit button element.
 * @param {HTMLElement} deleteChange - The delete button element.
 */
function removeEditStyles(listItem, editDelate, deleteChange) {
  listItem.classList.remove("editing");
  listItem.style.backgroundColor = "";
  editDelate.style.display = "none";
  deleteChange.style.display = "none";
}

/**
 * Saves new input and exits edit mode.
 *
 * @param {HTMLElement} element - The element triggering save.
 */
function saveAndExitEditMode(element) {
  const listItem = element.closest("li");
  const { textElement, editDelate, deleteChange } = getElements(listItem);
  if (!textElement) return;

  console.log("Saving input:", textElement.innerText);
  textElement.blur();

  setTimeout(() => {
    removeEditStyles(listItem, editDelate, deleteChange);
    document.removeEventListener("click", resetEditMode);
    document.activeElement.blur();
  }, 10);
}

/**
 * Adds a new subtask item to the list.
 */
function addSubtask() {
  const input = document.getElementById("newSubtask");
  const subtaskList = document.getElementById("subtaskList");
  if (!input || !subtaskList || !input.value.trim()) return;

  const listItem = createSubtaskElement(input.value.trim());
  subtaskList.appendChild(listItem);

  resetInput(input);
  toggleButtons(true);
}

/**
 * Clears the input field and removes focus.
 *
 * @param {HTMLInputElement} input - The input field to reset.
 */
function resetInput(input) {
  input.value = "";
  input.blur();
}

/**
 * Controls the visibility of action buttons.
 *
 * @param {boolean} showAddSubtask - Whether to show the add subtask button.
 */
function toggleButtons(showAddSubtask) {
  const addSubtaskBtn = document.getElementById("addSubtask");
  const confirmDeleteBtn = document.getElementById("confirmDeleteNewSubtask");

  if (addSubtaskBtn) addSubtaskBtn.style.display = showAddSubtask ? "block" : "none";
  if (confirmDeleteBtn) confirmDeleteBtn.style.display = showAddSubtask ? "none" : "block";
}

/**
 * Gets the values from the task fields and returns a new task object
 *
 * @returns {Object} - The created task object
 */
function getTaskData() {
  const title = document.getElementById("taskTitle")?.value || "";
  const description = document.getElementById("taskDescription")?.value || "";
  const dueDate = document.getElementById("date-input")?.value || "";
  const priority = document.querySelector(".priorityBtns.selected")?.dataset.priority || "";
  const assignedTo = getSelectedContactsData();
  const category = document.querySelector(".categoryDropdown.dropdown-selected")?.dataset.value || "";
  const subtasks = getSubtasksData();
  const status = getAddTaskStatus();

  return createTaskObject(title, description, dueDate, priority, assignedTo, category, subtasks, status);
}

/**
 * Creates a new task object with the given parameters
 *
 * @param {string} title - The task title
 * @param {string} description - The task description
 * @param {string} dueDate - Thetask due date
 * @param {string} priority - The task priority ("high", "medium", "low")
 * @param {Array<Object>} assignedTo - Array of assigned contacts objects
 * @param {string} category - The task category
 * @param {Array<Object>} subtasks - Array of subtasks objects
 * @param {string} status - The task status
 * @returns - The created task object
 */
function createTaskObject(title, description, dueDate, priority, assignedTo, category, subtasks, status) {
  return {
    assignedTo: assignedTo,
    category: category,
    description: description,
    dueDate: dueDate,
    priority: priority,
    status: status,
    subtasks: subtasks,
    title: title,
  };
}

/**
 * Gets the subtask data from the DOM and creates an array of subtasks
 *
 * @returns - A subtasks array containing the subtask as objects
 *
 */
function getSubtasksData() {
  const subtaskList = document.getElementById("subtaskList");
  const subtasks = [];

  if (!subtaskList || subtaskList.querySelectorAll("li").length === 0) {
    return [];
  }

  subtaskList.querySelectorAll("li").forEach((subtask) => {
    const textItem = subtask.querySelector(".subtask-text");
    if (!textItem) return;

    const subtaskText = textItem.textContent.trim();

    subtasks.push({ done: false, subtask: subtaskText });
  });

  return subtasks;
}

/**
 * Checks if the input field is empty and shows a message.
 */
function emptyFeedback() {
  const subtaskInput = document.getElementById("newSubtask");
  if (!subtaskInput || subtaskInput.value.trim() === "") {
    showMessage("Please enter a name");
  }
}

/**
 * Initializes the subtask-related buttons and elements.
 * Retrieves necessary DOM elements for adding and deleting subtasks.
 *
 * @function initializeSubtasksButtons
 */
function initializeSubtasksButtons() {
  const input = document.getElementById("newSubtask");
  const addSubtask = document.getElementById("addSubtask");
  const confirmDelete = document.getElementById("confirmDeleteNewSubtask");
  const subtaskContainer = document.querySelector(".subtask-container");

  /**
   * Shows the delete confirmation and hides the add subtask button.
   *
   * @param {Event} event - The event triggering the action.
   */
  function showConfirmDelete(event) {
    addSubtask.style.display = "none";
    confirmDelete.style.display = "flex";

    if (input) {
      input.focus();
    }

    event.stopPropagation();
  }

  /**
   * Resets elements when clicking outside the subtask container.
   *
   * @param {Event} event - The event triggering the reset.
   */
  function resetOnOutsideClick(event) {
    if (!subtaskContainer.contains(event.target)) {
      resetElements();
    }
  }

  /**
   * Resets elements to their original state.
   */
  function resetElements() {
    addSubtask.style.display = "block";
    confirmDelete.style.display = "none";
    input.value = "";
  }

  window.resetElements = resetElements;
  window.showConfirmDelete = showConfirmDelete;

  input.addEventListener("click", showConfirmDelete);
  document.addEventListener("click", resetOnOutsideClick);
}

/**
 * Sets up an event listener to simulate a click on the subtask input field
 * when the "Add Subtask" button is clicked. Also triggers a confirmation for deletion.
 *
 * @function initializeSubtasksimulateInputClick
 */
function initializeSubtasksimulateInputClick() {
  document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("newSubtask"); // Input field for new subtasks
    const addSubtask = document.getElementById("addSubtask"); // Button to add a subtask

    function simulateInputClick() {
      input.focus(); // Focuses the input field when clicked
      showConfirmDelete(); // Displays confirmation for deleting a subtask
    }

    addSubtask.addEventListener("click", simulateInputClick); // Adds event listener to trigger simulation
  });
}