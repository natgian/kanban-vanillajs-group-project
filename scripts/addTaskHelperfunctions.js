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







// /**
//  * Opens the dropdown options.
//  *
//  * @param {HTMLElement} dropdownOptions - The dropdown options container.
//  */
// function openDropdown(dropdownOptions) {
//   dropdownOptions.style.display = "block";
// }

// /**
//  * Checks if the dropdown is closed.
//  *
//  * @param {HTMLElement} dropdownOptions - The dropdown options container.
//  * @returns {boolean} True if the dropdown is closed, false otherwise.
//  */
// function isDropdownClosed(dropdownOptions) {
//   return dropdownOptions && window.getComputedStyle(dropdownOptions).display === "none";
// }

// /**
//  * Filters dropdown options based on the search query.
//  *
//  * @param {string} query - The search query entered by the user.
//  * @param {HTMLElement} dropdownOptions - The dropdown options container.
//  */
// function filterOptions(query, dropdownOptions) {
//   query = query.trim().toLowerCase();
//   dropdownOptions.querySelectorAll(".option").forEach((option) => {
//     const text = option.textContent.trim().toLowerCase();
//     option.style.display = text.includes(query) ? "flex" : "none";
//   });
// }

// /**
//  * Resets the filter, displaying all dropdown options.
//  *
//  * @param {HTMLElement} dropdownOptions - The dropdown options container.
//  */
// function resetFilter(dropdownOptions) {
//   dropdownOptions.querySelectorAll(".option").forEach((option) => {
//     option.style.display = "flex";
//   });
// }

// /**
//  * Copies styles from one element to another.
//  *
//  * @param {HTMLElement} source - The element to copy styles from.
//  * @param {HTMLElement} target - The element to apply copied styles to.
//  */
// function copyStyles(source, target) {
//   const computedStyle = window.getComputedStyle(source);
//   target.style.backgroundColor = computedStyle.backgroundColor;
//   target.style.color = computedStyle.color;
//   target.style.fontWeight = computedStyle.fontWeight;
//   target.style.border = computedStyle.border;
// }

// function activateSearchField(inputField, dropdownOptions) {
//   // Falls das Button-Element noch existiert, ersetze es durch ein Input-Feld
//   if (inputField.type === "button") {
//     const newInput = document.createElement("input");
//     newInput.type = "text";
//     newInput.placeholder = "Suche Kontakte...";
//     newInput.classList.add("dropdown-selected", "typeBars");
//     newInput.id = inputField.id;
//     newInput.value = ""; // Leeres Feld für Eingabe setzen

//     inputField.replaceWith(newInput);
//     inputField = newInput;
//   }

//   // Suchfeld aktivieren
//   inputField.setAttribute("placeholder", "Suche Kontakte...");
//   inputField.classList.add("active-search");

//   // Dropdown toggeln
//   if (dropdownOptions.classList.contains("active")) {
//     dropdownOptions.classList.remove("active");
//     dropdownOptions.style.display = "none";
//     resetInputField(inputField);
//   } else {
//     dropdownOptions.classList.add("active");
//     dropdownOptions.style.display = "block";
//   }
// }

// function resetInputField(inputField) {
//   inputField.setAttribute("placeholder", "Select contacts to assign");
//   inputField.classList.remove("active-search");
// }

// function toggleContactDropdown(input) {
//   closeAllDropdowns();

//   const container = input.closest(".dropdown-container");
//   const options = container.querySelector(".dropdown-options");

//   if (options) {
//     if (options.classList.contains("active")) {
//       options.classList.remove("active");
//       options.style.display = "none";
//     } else {
//       options.classList.add("active");
//       options.style.display = "block";
//     }
//   }
// }






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
