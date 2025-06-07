let requiredEditInputs = [];

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

// GEÄNDERT // BEI addTaskSelections übernehmen?
// function updateSelectedContacts() {
//   const selectedContactsDiv = document.getElementById("selectedContacts");
//   selectedContactsDiv.innerHTML = "";

//   const checkedElements = document.querySelectorAll(".hidden-checkbox:checked");
//   const maxVisibleAvatars = 5;

//   checkedElements.forEach((checkbox, index) => {
//     const parentElement = checkbox.closest(".option");
//     const avatar = parentElement.querySelector(".task-card-avatar");

//     if (avatar && index < maxVisibleAvatars) {
//       const clonedAvatar = avatar.cloneNode(true);
//       clonedAvatar.dataset.id = avatar.dataset.id;
//       selectedContactsDiv.appendChild(clonedAvatar);
//     }
//   });

//   const extraCount = checkedElements.length - maxVisibleAvatars;
//   if (extraCount > 0) {
//     const plusCounter = document.createElement("div");
//     plusCounter.classList.add("plus-counter");
//     plusCounter.textContent = `+${extraCount}`;
//     selectedContactsDiv.appendChild(plusCounter);
//   }

//   selectedContactsDiv.style.display = "none";
//   selectedContactsDiv.offsetHeight;
//   selectedContactsDiv.style.display = "flex";
// }
