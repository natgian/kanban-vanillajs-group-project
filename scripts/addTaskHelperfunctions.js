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
 * Creates an input field for searching contacts.
 *
 * @param {HTMLInputElement} button - The button element to replace.
 * @returns {HTMLInputElement} The newly created input field.
 */
function createInputField(button) {
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.placeholder = "Search contacts...";
  inputField.className = button.className;
  inputField.id = button.id;
  return inputField;
}

/**
 * Creates a button to replace an input field.
 *
 * @param {HTMLInputElement} input - The input field to replace.
 * @returns {HTMLInputElement} The newly created button.
 */
function createButton(input) {
  const button = document.createElement("input");
  button.type = "button";
  button.value = "Select contacts to assign";
  button.className = input.className;
  button.id = input.id;
  button.onclick = () => toggleContactSearch(button);
  return button;
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
 * Toggles the category dropdown and updates its state.
 * @param {HTMLElement} input - The clicked input element.
 */
function toggleCategoryDropdown(input) {
    const container = input.closest(".dropdown-container"),
        options = container.querySelector(".dropdown-options"),
        button = container.querySelector("#toggleButtonDropdown");

    if (!options) return;

    let isActive = options.classList.contains("active");

    options.classList.toggle("active", !isActive);

    toggleButtonImageRotation(button, !isActive);
}

/**
 * Toggles dropdown visibility and search field state.
 * @param {HTMLElement} triggerElement - The triggering element.
 */
function toggleContactDropdown(triggerElement) {
    const container = triggerElement.closest(".dropdown-container"),
        dropdownOptions = container.querySelector(".dropdown-options"),
        searchField = container.querySelector(".dropdown-selected"),
        button = container.querySelector("#toggleButtonDropdown");

    if (!dropdownOptions) return;
    const wasVisible = dropdownOptions.classList.contains("active");

    if (triggerElement === searchField && searchField.type === "button") {
        activateSearchField(searchField, dropdownOptions);
        return;
    }

    if (!wasVisible) closeAllDropdowns();
    updateDropdownState(dropdownOptions, wasVisible);
    toggleButtonImageRotation(button, !wasVisible);

    if (!dropdownOptions.classList.contains("active")) resetInputField(searchField);
}

/**
 * Rotates button image based on dropdown visibility.
 * @param {HTMLElement} button - Button element.
 * @param {boolean} isVisible - Dropdown visibility state.
 */
function toggleButtonImageRotation(button, isVisible) {
    if (!button) return;
    const img = button.querySelector("img");
    if (img) img.style.transform = isVisible ? "rotate(180deg)" : "rotate(0deg)";
}

/**
 * Updates dropdown visibility state.
 * @param {HTMLElement} dropdown - Dropdown element.
 * @param {boolean} wasVisible - Previous visibility state.
 */
function updateDropdownState(dropdown, wasVisible) {
    dropdown.classList.toggle("active", !wasVisible);
    dropdown.style.display = wasVisible ? "none" : "block";
}

/**
 * Converts button input into a search field and activates it.
 * @param {HTMLElement} inputField - Search field element.
 * @param {HTMLElement} dropdownOptions - Dropdown options container.
 */
function activateSearchField(inputField, dropdownOptions) {
    const container = inputField.closest(".dropdown-container"),
        button = container.querySelector("#toggleButtonDropdown");

    if (inputField.type === "button") {
        const newInput = document.createElement("input");
        Object.assign(newInput, { type: "text", placeholder: "Search contacts...", className: "dropdown-selected typeBars", id: inputField.id, value: "" });
        newInput.oninput = () => filterDropdownOptions(newInput, dropdownOptions);
        inputField.replaceWith(newInput);
        setTimeout(() => newInput.focus(), 0);
    }

    dropdownOptions.classList.add("active");
    dropdownOptions.style.display = "block";
    toggleButtonImageRotation(button, true);
}

/**
 * Resets search field back to a button.
 * @param {HTMLElement} inputField - Search field element.
 */
function resetInputField(inputField) {
    if (inputField && inputField.type === "text") {
        const newButton = document.createElement("input");
        Object.assign(newButton, { type: "button", value: "Select contacts to assign", className: "dropdown-selected typeBars", id: inputField.id });
        newButton.onclick = () => toggleContactDropdown(newButton);
        inputField.replaceWith(newButton);
    }
}

/**
 * Closes all dropdowns and resets fields if necessary.
 */
function closeAllDropdowns() {
    document.querySelectorAll(".dropdown-container .dropdown-options").forEach((options) => {
        const container = options.closest(".dropdown-container"),
            searchField = container.querySelector(".dropdown-selected");

        if (document.activeElement !== searchField || searchField.type !== "text") {
            options.classList.remove("active");
            options.style.display = "none";
            resetInputField(searchField);
        }
    });

    document.querySelectorAll(".dropdown-container button img").forEach((img) => img.style.transform = "rotate(0deg)");
}

/**
 * Filters dropdown options based on search input.
 * @param {HTMLElement} input - Search field element.
 * @param {HTMLElement} dropdownOptions - Dropdown options container.
 */
function filterDropdownOptions(input, dropdownOptions) {
    const searchValue = input.value.toLowerCase();
    dropdownOptions.querySelectorAll(".option").forEach((option) => {
        option.style.display = option.textContent.toLowerCase().includes(searchValue) ? "block" : "none";
    });
}




// // Event listener for initializing contact search functionality
// document.addEventListener("DOMContentLoaded", function() {
//     document.getElementById("contactDropdown").addEventListener("click", function() {
//         toggleContactSearch(this);
//     });
// });

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
