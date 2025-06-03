async function initEditTaskFields(task) {
  updateSelectedContactsDisplay();
  setContactDropdownEventListeners();
  initEditSubtasks();
  renderSubtasks(task.subtasks);

  const contacts = await fetchContacts();
  const assignedTo = task.assignedTo || [];
  loadEditContacts(contacts, assignedTo);
}

// CONTACT CODE -- geändert -- //
function setContactDropdownEventListeners() {
  const dropdown = document.getElementById("contactDropdown");
  const dropdownContainer = document.querySelector(".dropdown-container");
  const dropdownList = document.getElementById("contact-list");

  if (!dropdown || !dropdownContainer || !dropdownList) return;

  dropdown.addEventListener("click", function (event) {
    event.stopPropagation();
    toggleContactSearch(this); // "this" here is the dropdown element (contactDropdown)
  });

  taskOverlayContentRef.addEventListener("click", (event) => {
    if (!event.target.closest(".dropdown-container") && !event.target.classList.contains("dropdown-selected")) {
      closeAllContactDropdowns();
    }
  });
}

function toggleContactSearch(element) {
  const dropdownContainer = getDropdownContainer(element);
  const dropdownOptions = getDropdownOptions(dropdownContainer);

  if (isButtonElement(element)) {
    const input = replaceButtonWithInput(element, dropdownOptions);

    input.addEventListener("click", function (event) {
      event.stopPropagation();
      toggleContactSearch(this);
    });
  } else if (element.tagName === "INPUT") {
    openDropdown(dropdownOptions);
  }
}

/**
 * Checks whether the given element is an <input type="button">
 *
 * @param {HTMLElement} element - The DOM element to check
 * @returns - True if the element is an input of type button, otherwise false
 */
function isButtonElement(element) {
  return element.tagName === "INPUT" && element.type === "button";
}

/**
 * Finds the closest parent container with the class "dropdown-container"
 *
 * @param {HTMLElement} element - The starting DOM element
 * @returns - The closest dropdown container
 */
function getDropdownContainer(element) {
  return element.closest(".dropdown-container");
}

/**
 * Gets the element that contains the dropdown options within the container
 *
 * @param {HTMLElement} dropdownContainer - The container element for the dropdown
 * @returns - The dropdown options element
 */
function getDropdownOptions(dropdownContainer) {
  return dropdownContainer.querySelector(".dropdown-options");
}

/**
 * Replaces a button element with an input field, shows the dropdown options and sets up event listeners
 * for the inputs.
 *
 * @param {HTMLElement} button - The button element to replace
 * @param {HTMLAnchorElement} dropdownOptions - The element containing the dropdown options to display
 */
function replaceButtonWithInput(button, dropdownOptions) {
  const inputField = createInputField(button);

  copyStyles(button, inputField);
  replaceElement(button, inputField);

  openDropdown(dropdownOptions);
  addInputEventListeners(inputField, dropdownOptions);

  inputField.focus();

  return inputField;
}

function closeAllContactDropdowns() {
  document.querySelectorAll("#contactDropdown + .dropdown-options").forEach((options) => {
    options.style.display = "none";
  });
}

function observeDropdownChanges() {
  document.querySelectorAll(".dropdown-selected").forEach((dropdown) => {
    const observer = new MutationObserver(() => validateRequiredFields());
    observer.observe(dropdown, { attributes: true, attributeFilter: ["data-value"] });
  });
}

/**
 * Toggles the visibility of the contact dropdown.
 */
function toggleContactDropdown(input) {
  const options = input.closest(".dropdown-container").querySelector(".dropdown-options");

  replaceInputWithButton();

  if (options) {
    options.style.display = options.style.display === "block" ? "none" : "block";
  }
}

/**
 * Updates the display style of #selectedContacts based on its content.
 */
function updateSelectedContactsDisplay() {
  const selectedDiv = document.getElementById("selectedContacts");

  if (selectedDiv.textContent.trim() !== "") {
    selectedDiv.style.display = "flex";
  } else {
    selectedDiv.style.display = "none";
  }
}

/**
 * Selects an option from the contact dropdown and updates the selectedContacts div.
 */
function selectContactOption(element) {
  const selectedDiv = document.getElementById("selectedContacts");
  if (!selectedDiv) return;

  selectedDiv.textContent = element.textContent;

  updateSelectedContactsDisplay();

  setTimeout(() => {
    closeAllContactDropdowns();
  }, 100);
}

/**
 * Toggles the checked state of the checkbox and returns the updated state.
 */
function toggleCheckbox(element) {
  const checkbox = element.querySelector(".hidden-checkbox");
  checkbox.checked = !checkbox.checked;
  return checkbox.checked;
}

/**
 * Updates the background color based on the checked state.
 */
function updateBackground(element, isChecked) {
  element.style.backgroundColor = isChecked ? "#2a3647" : "";
}

/**
 * Changes the text color based on the checked state.
 */
function updateTextColor(element, isChecked) {
  const textSpan = element.querySelector("span");
  textSpan.style.color = isChecked ? "#ffffff" : "";
}

/**
 * Updates the checkbox images, ensuring the selected image turns fully white.
 */
function updateCheckboxImages(element, isChecked) {
  const uncheckedImg = element.querySelector(".unchecked");
  const checkedImg = element.querySelector(".checked");

  uncheckedImg.style.display = isChecked ? "none" : "inline";
  checkedImg.style.display = isChecked ? "inline" : "none";

  checkedImg.style.filter = isChecked ? "brightness(0) invert(100%)" : "none";
}

/**
 * Applies all style changes based on selection.
 */
function applySelectionStyles(element, isChecked) {
  updateBackground(element, isChecked);
  updateCheckboxImages(element, isChecked);
  updateTextColor(element, isChecked);
  updateSelectedContacts(element, isChecked);
}

/**
 * Ensures clicking on images correctly toggles selection.
 */
function setupImageClickEvents(element) {
  const checkbox = element.querySelector(".hidden-checkbox");
  const images = element.querySelectorAll("img");

  images.forEach((img) => {
    img.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      checkbox.checked = !checkbox.checked;
      applySelectionStyles(element, checkbox.checked);
    });
  });
}

// GEÄNDERT! //
/**
 * Main function - Handles selection behavior when an option is clicked.
 */
function selectOption(element, event = null) {
  const checkbox = element.querySelector(".hidden-checkbox");

  if (!event || event.target !== checkbox) {
    checkbox.click();
  }

  applySelectionStyles(element, checkbox.checked);
}

// GEÄNDERT //
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

// Searchbar

function replaceInputWithButton(input, dropdownOptions) {
  if (!isDropdownClosed(dropdownOptions)) {
    return;
  }
  resetFilter(dropdownOptions);

  input.blur();

  const button = createButton(input);
  copyStyles(input, button);

  replaceElement(input, button);

  button.blur();
}

function createInputField(button) {
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.placeholder = "Search contacts...";
  inputField.className = button.className;
  inputField.id = button.id;
  return inputField;
}

function createButton(input) {
  const button = document.createElement("input");
  button.type = "button";
  button.value = "Select contacts to assign";
  button.className = input.className;
  button.id = input.id;
  button.onclick = () => toggleContactSearch(button);
  return button;
}

function replaceElement(oldElement, newElement) {
  const container = oldElement.closest(".dropdown-container");

  if (!container) {
    console.error("Fehler: dropdown-container nicht gefunden!");
    return;
  }

  container.replaceChild(newElement, oldElement);
}

function openDropdown(dropdownOptions) {
  dropdownOptions.style.display = "block";
}

function isDropdownClosed(dropdownOptions) {
  return dropdownOptions && window.getComputedStyle(dropdownOptions).display === "none";
}

function addInputEventListeners(inputField, dropdownOptions) {
  inputField.addEventListener("input", () => filterOptions(inputField.value, dropdownOptions));
  inputField.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      replaceInputWithButton(inputField, dropdownOptions);
    }
  });
}

// Filter Contacts

function filterOptions(query, dropdownOptions) {
  dropdownOptions.querySelectorAll(".option").forEach((option) => {
    option.style.display = option.textContent.toLowerCase().includes(query.toLowerCase()) ? "flex" : "none";
  });
}

function resetFilter(dropdownOptions) {
  dropdownOptions.querySelectorAll(".option").forEach((option) => {
    option.style.display = "flex";
  });
}

function copyStyles(source, target) {
  const computedStyle = window.getComputedStyle(source);
  target.style.backgroundColor = computedStyle.backgroundColor;
  target.style.color = computedStyle.color;
  target.style.fontWeight = computedStyle.fontWeight;
  target.style.border = computedStyle.border;
}

// required typeBars

function handleBlur(input) {
  const message = input.nextElementSibling;
  if (!message) return;

  if (isEmpty(input)) {
    showValidationError(input, message);
  } else {
    hideValidationError(input, message);
  }
}

function isEmpty(input) {
  return input.value.trim() === "";
}

function showValidationError(input, message) {
  input.style.border = "1px solid #ff8190";
  message.style.display = "block";
}

function hideValidationError(input, message) {
  input.style.border = "";
  message.style.display = "none";
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

// Add Subtasks
function deleteSubtask(element) {
  const listItem = element.closest("li"); // Findet das zugehörige <li>-Element
  if (listItem) {
    listItem.remove(); // Entfernt das <li> aus der Liste
  }
}

// Edit-Mode
// Toggles the edit mode for a list item
function toggleEditMode(element) {
  const listItem = element.closest("li");
  if (!listItem) return;

  const { textElement, editDelate, deleteChange } = getElements(listItem);
  if (!textElement || !editDelate || !deleteChange) return;

  listItem.dataset.originalText = textElement.innerText;
  applyEditStyles(listItem, textElement, editDelate, deleteChange);
  document.addEventListener("click", resetEditMode);
}

// Retrieves required elements within a list item
function getElements(listItem) {
  return {
    textElement: listItem.querySelector("#editableText"),
    editDelate: listItem.querySelector("#editDelate"),
    deleteChange: listItem.querySelector("#deleteChange"),
  };
}

// Applies editing styles and properties
function applyEditStyles(listItem, textElement, editDelate, deleteChange) {
  listItem.classList.add("editing");
  listItem.style.backgroundColor = "white";
  editDelate.style.display = "none";
  deleteChange.style.display = "flex";

  textElement.contentEditable = true;
  textElement.focus();
}

// Resets edit mode if clicking outside the editing area
function resetEditMode(event) {
  const listItem = document.querySelector(".editing");
  if (listItem && !listItem.contains(event.target)) {
    cancelEditMode(listItem, listItem.dataset.originalText);
    document.removeEventListener("click", resetEditMode);
  }
}

// Cancels editing and restores the original text
function cancelEditMode(listItem, originalText) {
  const { textElement, editDelate, deleteChange } = getElements(listItem);
  if (!textElement || !editDelate || !deleteChange) return;

  textElement.innerText = originalText;
  textElement.contentEditable = false;
  removeEditStyles(listItem, editDelate, deleteChange);
}

// Removes editing styles and restores display settings
function removeEditStyles(listItem, editDelate, deleteChange) {
  listItem.classList.remove("editing");
  listItem.style.backgroundColor = "";
  editDelate.style.display = "flex";
  deleteChange.style.display = "none";
}

// Saves new input and exits edit mode
function saveAndExitEditMode(element) {
  const listItem = element.closest("li");
  const { textElement, editDelate, deleteChange } = getElements(listItem);
  if (!textElement) return;

  textElement.blur();

  setTimeout(() => {
    removeEditStyles(listItem, editDelate, deleteChange);
    document.removeEventListener("click", resetEditMode);
    document.activeElement.blur();
  }, 10);
}

// Add new Subtask
// Adds a new subtask item to the list
function addSubtask() {
  const input = document.getElementById("newEditSubtask"); // GEÄNDERT!! //
  const subtaskList = document.getElementById("subtaskList");
  if (!input || !subtaskList || !input.value.trim()) return;

  const listItem = createSubtaskElement(input.value.trim());
  subtaskList.appendChild(listItem);

  resetInput(input);
  toggleButtons(true);
}

// Clears the input field and removes focus
function resetInput(input) {
  input.value = "";
  input.blur();
}

// Controls the visibility of action buttons
function toggleButtons(showAddSubtask) {
  const addSubtaskBtn = document.getElementById("addSubtask");
  const confirmDeleteBtn = document.getElementById("confirmDeleteNewSubtask");

  if (addSubtaskBtn) addSubtaskBtn.style.display = showAddSubtask ? "block" : "none";
  if (confirmDeleteBtn) confirmDeleteBtn.style.display = showAddSubtask ? "none" : "block";
}

// VALIDATION CODE //

// Due date Text-Color-Change
function checkValue() {
  let input = document.getElementById("date-input");
  if (input.value) {
    input.classList.add("filled");
  } else {
    input.classList.remove("filled");
  }
}
// submitbutton enabled
function getRequiredFields() {
  return document.querySelectorAll("input[required]");
}

function areAllFieldsFilled(fields) {
  return Array.from(fields).every((field) => {
    if (field.classList.contains("dropdown-selected")) {
      return field.dataset.value && field.dataset.value.trim() !== "";
    }
    return field.value.trim() !== "";
  });
}

function validateRequiredFields() {
  const requiredFields = getRequiredFields();
  const allFilled = areAllFieldsFilled(requiredFields);
}

// FIREBASE CODE //
/**
 * Fetchs Contacts from Firebase and converts them to an Array.
 */
async function fetchContacts() {
  try {
    const response = await fetch(`${baseURL}/contacts.json`);
    const data = await response.json();

    if (!data) return [];

    return Object.entries(data).map(([key, contact]) => ({
      name: contact.name || "Unbekannt",
      initials: contact.monogram || "??",
      color: contact.monogramColor || "#CCCCCC",
    }));
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
    return [];
  }
}

// GEÄNDERT //
/**
 * Inserts contacts into the template.
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
