async function initEditTask(task) {
  initializeToggleContactSearch();

  initializeObserveDropdownChanges();
  initializeCloseAllDropdowns();
  initializeReplaceInputWithButton();
  // initializeSubtasksButtons();
  initializeSubtasksimulateInputClick();
  initializeResetAllOptions();

  updateSelectedContactsDisplay();
  // setContactDropdownEventListeners();
  initEditSubtasks();
  renderSubtasks(task.subtasks);

  const contacts = await fetchContacts();
  const assignedTo = task.assignedTo || [];
  loadEditContacts(contacts, assignedTo);
}

// CONTACT CODE -- geändert -- //
// function setContactDropdownEventListeners() {
//   const dropdown = document.getElementById("contactDropdown");
//   const dropdownContainer = document.querySelector(".dropdown-container");
//   const dropdownList = document.getElementById("contact-list");

//   if (!dropdown || !dropdownContainer || !dropdownList) return;

//   dropdown.addEventListener("click", function (event) {
//     event.stopPropagation();
//     toggleContactSearch(this); // "this" here is the dropdown element (contactDropdown)
//   });

//   taskOverlayContentRef.addEventListener("click", (event) => {
//     if (!event.target.closest(".dropdown-container") && !event.target.classList.contains("dropdown-selected")) {
//       closeAllContactDropdowns();
//     }
//   });
// }

// function toggleContactSearch(element) {
//   const dropdownContainer = getDropdownContainer(element);
//   const dropdownOptions = getDropdownOptions(dropdownContainer);

//   if (isButtonElement(element)) {
//     const input = replaceButtonWithInput(element, dropdownOptions);

//     input.addEventListener("click", function (event) {
//       event.stopPropagation();
//       toggleContactSearch(this);
//     });
//   } else if (element.tagName === "INPUT") {
//     openDropdown(dropdownOptions);
//   }
// }

// GEÄNDERT! //
/**
 * Main function - Handles selection behavior when an option is clicked.
 */
function selectEditOption(element, event = null) {
  const checkbox = element.querySelector(".hidden-checkbox");

  if (!event || event.target !== checkbox) {
    checkbox.click();
  }

  applySelectionStyles(element, checkbox.checked);
}

// GEÄNDERT // BEI addTaskSelections übernehmen?
function updateSelectedContacts() {
  const selectedContactsDiv = document.getElementById("selectedContacts");
  selectedContactsDiv.innerHTML = "";

  const checkedElements = document.querySelectorAll(".hidden-checkbox:checked");
  const maxVisibleAvatars = 5;

  checkedElements.forEach((checkbox, index) => {
    const parentElement = checkbox.closest(".option");
    const avatar = parentElement.querySelector(".task-card-avatar");

    if (avatar && index < maxVisibleAvatars) {
      const clonedAvatar = avatar.cloneNode(true);
      clonedAvatar.dataset.id = avatar.dataset.id;
      selectedContactsDiv.appendChild(clonedAvatar);
    }
  });

  const extraCount = checkedElements.length - maxVisibleAvatars;
  if (extraCount > 0) {
    const plusCounter = document.createElement("div");
    plusCounter.classList.add("plus-counter");
    plusCounter.textContent = `+${extraCount}`;
    selectedContactsDiv.appendChild(plusCounter);
  }

  selectedContactsDiv.style.display = "none";
  selectedContactsDiv.offsetHeight;
  selectedContactsDiv.style.display = "flex";
}

// GEÄNDERT!! //
function initEditSubtasks() {
  const input = document.getElementById("newEditSubtask"); // GEÄNDERT!! //
  const addSubtask = document.getElementById("addSubtask");
  const confirmDelete = document.getElementById("confirmDeleteNewSubtask");
  const subtaskContainer = document.querySelector(".subtask-container");

  // Function to show confirmDelete and hide addSubtask
  function showConfirmDelete(event) {
    addSubtask.style.display = "none";
    confirmDelete.style.display = "flex";
    event.stopPropagation();
  }

  // Function to reset everything when clicking outside
  function resetOnOutsideClick(event) {
    if (!subtaskContainer.contains(event.target)) {
      resetElements();
    }
  }

  // Function to reset elements to their original state
  function resetElements() {
    addSubtask.style.display = "block";
    confirmDelete.style.display = "none";
    input.value = "";
  }

  // Make function globally accessible
  window.resetElements = resetElements;
  window.showConfirmDelete = showConfirmDelete;

  // Add event listeners
  input.addEventListener("click", showConfirmDelete);
  document.addEventListener("click", resetOnOutsideClick);
}

// GEÄNDERT!! //
/**
 * Adds a new subtask item to the list
 *
 */
function addEditSubtask() {
  const input = document.getElementById("newEditSubtask"); // GEÄNDERT!! //
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
