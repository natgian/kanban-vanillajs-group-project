/**
 * Retrieves the dropdown container of a given element.
 *
 * @param {HTMLElement} element - The element inside the dropdown container.
 * @returns {HTMLElement} The closest dropdown container.
 */
function getDropdownContainer(element) {
  return element.closest(".dropdown-container");
}

/**
 * Retrieves the dropdown options container.
 *
 * @param {HTMLElement} dropdownContainer - The dropdown container element.
 * @returns {HTMLElement} The dropdown options container.
 */
function getDropdownOptions(dropdownContainer) {
  if (!dropdownContainer) {
    console.error("Fehler: dropdownContainer ist null oder nicht definiert.");
    return null;
  }
  return dropdownContainer.querySelector(".dropdown-options");
}

/**
 * Checks if an element is a button.
 *
 * @param {HTMLElement} element - The element to check.
 * @returns {boolean} True if the element is a button, false otherwise.
 */
function isButtonElement(element) {
  return element.tagName === "INPUT" && element.type === "button";
}

/**
 * Replaces an old element with a new one inside the dropdown container.
 *
 * @param {HTMLElement} oldElement - The element to be replaced.
 * @param {HTMLElement} newElement - The new element.
 */
function replaceElement(oldElement, newElement) {
  const container = oldElement.closest(".dropdown-container");

  if (!container) {
    console.error("Error: dropdown-container not found!");
    return;
  }

  container.replaceChild(newElement, oldElement);
}

/**
 * Observes changes in dropdown selections.
 */
function observeDropdownChanges() {
  document.querySelectorAll(".dropdown-selected").forEach((dropdown) => {
    const observer = new MutationObserver(() => validateRequiredFields());
    observer.observe(dropdown, { attributes: true, attributeFilter: ["data-value"] });
  });
}

/**
 * Updates the display state of selected contacts.
 */
function updateSelectedContactsDisplay() {
  const selectedDiv = document.getElementById("selectedContacts");

  selectedDiv.style.display = selectedDiv.textContent.trim() !== "" ? "flex" : "none";
}

/**
 * Selects a contact option and updates the display.
 *
 * @param {HTMLElement} element - The selected contact element.
 */
function selectContactOption(element) {
  const selectedDiv = document.getElementById("selectedContacts");
  if (!selectedDiv) return;

  selectedDiv.textContent = element.textContent;
  updateSelectedContactsDisplay();

  setTimeout(() => {
    closeAllDropdowns();
  }, 100);
}

/**
 * Handles blur event for input fields, showing validation errors if empty.
 *
 * @param {HTMLInputElement} input - The input field to validate.
 */
function handleBlur(input) {
  const message = input.nextElementSibling;
  if (!message) return;

  if (isEmpty(input)) {
    showValidationError(input, message);
  } else {
    hideValidationError(input, message);
  }
}

/**
 * Checks if an input field is empty.
 *
 * @param {HTMLInputElement} input - The input field to check.
 * @returns {boolean} True if empty, false otherwise.
 */
function isEmpty(input) {
  return input.value.trim() === "";
}

/**
 * Displays a validation error message.
 *
 * @param {HTMLInputElement} input - The input field with an error.
 * @param {HTMLElement} message - The error message element.
 */
function showValidationError(input, message) {
  input.style.border = "1px solid #ff8190";
  message.style.display = "block";
}

/**
 * Hides the validation error message.
 *
 * @param {HTMLInputElement} input - The input field to clear errors from.
 * @param {HTMLElement} message - The error message element.
 */
function hideValidationError(input, message) {
  input.style.border = "";
  message.style.display = "none";
}

/**
 * Sets the "addTaskStatus" to the given status depending on screen size.
 * On small screens (≤ 1080px), it navigates to "addTask.html" with a query parameter.
 * On larger screens, it opens the Add Task overlay and stores the status temporarily in a global variable.
 *
 * @param {string} newStatus - The new task status ("to-do", "in-progress" or "awaiting-feedback")
 */
function setAddTaskStatus(newStatus) {
  const screenWidth = window.innerWidth;

  if (screenWidth <= 1080) {
    // Small screens: navigate with status in URL
    window.location.href = `./addTask.html?status=${newStatus}`;
  } else {
    // Large screens: store status in global variable and open overlay
    window.addTaskStatus = newStatus;
    initBoardAddTask();
  }
}

/**
 * Gets the task status for the Add Task form.
 * If a status is found in the URL (from a small screen redirect), it is used and the URL is cleaned.
 * If a global variable (from a large screen overlay) is found, it is used and then cleared.
 * If no status is available it defaults to "to-do".
 *
 *  @returns {string} - The task status ("to-do", "in-progress", "awaiting-feedback")
 */
function getAddTaskStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  const fromURL = urlParams.get("status");

  if (fromURL) {
    window.history.replaceState({}, document.title, "./addTask.html"); // cleans URL
    return fromURL;
  }

  if (window.addTaskStatus) {
    const status = window.addTaskStatus;
    window.addTaskStatus = null; // clears global variable
    return status;
  }

  return "to-do";
}

/**
 * Gets the values (name, color, initials) from all selected contacts
 *
 * @returns {Array<Object>} - An array of objects containing the data of each selected contacts
 */
function getSelectedContactsData() {
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
 * Creates and appends up to 5 avatar elements for the selected contacts
 *
 * @param {NodeList} checkedElements - A list of checked checkboxes representing selected contacts
 */
function createAvatars(checkedElements, maxVisibleAvatars, selectedContactsDiv) {
  checkedElements.forEach((checkbox, index) => {
    const parentElement = checkbox.closest(".option");
    const avatar = parentElement.querySelector(".task-card-avatar");

    if (avatar && index < maxVisibleAvatars) {
      const clonedAvatar = avatar.cloneNode(true);
      clonedAvatar.dataset.id = avatar.dataset.id;
      selectedContactsDiv.appendChild(clonedAvatar);
    }
  });
}

/**
 * Appends a counter if more than 5 contacts are selected
 *
 * @param {number} extraCount - The number of contacts above the visible avatar limit.
 */
function createPlusCounter(extraCount, selectedContactsDiv) {
  if (extraCount > 0) {
    const plusCounter = document.createElement("div");
    plusCounter.classList.add("plus-counter");
    plusCounter.textContent = `+${extraCount}`;
    selectedContactsDiv.appendChild(plusCounter);
  }
}

/**
 * Checks if all required fields are filled.
 *
 * @param {NodeList} fields - The list of required fields.
 * @returns {boolean} True if all fields are filled, false otherwise.
 */
function areAllFieldsFilled(fields) {
  return Array.from(fields).every((field) => {
    if (field.classList.contains("dropdown-selected")) {
      return field.dataset.value && field.dataset.value.trim() !== "";
    }
    return field.value.trim() !== "";
  });
}

function noBehindDate(){
  const heute = new Date().toISOString().split("T")[0];
  document.getElementById("date-input").setAttribute("min", heute);
}