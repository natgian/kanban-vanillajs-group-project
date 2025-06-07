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
 * Checks if the input field is empty and shows a message.
 */
function emptyFeedback() {
    const subtaskInput = document.getElementById("newSubtask");
    if (!subtaskInput || subtaskInput.value.trim() === "") {
        showMessage("Please enter a name");
    }
}



// // Sets up validation on page load
// document.addEventListener("DOMContentLoaded", function() {
//     document.addEventListener("input", validateRequiredFields);
//     observeDropdownChanges();
// });





// /**
//  * Rotiert das Button-Bild um 180 Grad, wenn das Dropdown geöffnet ist.
//  * Setzt die Rotation zurück, wenn es geschlossen wird.
//  *
//  * @param {HTMLElement} element - Das Element, dessen Bild rotiert werden soll.
//  */
// function toggleRotation(element) {
//   const container = element.closest(".dropdown-container");
//   const img = container.querySelector("button img");
//   const dropdown = container.querySelector(".dropdown-options");

//   if (img && dropdown) {
//     if (dropdown.classList.contains("active")) {
//       img.classList.add("rotated"); // Bild drehen, wenn Dropdown offen ist
//     } else {
//       img.classList.remove("rotated"); // Rotation zurücksetzen, wenn geschlossen
//     }
//   }
// }



// document.addEventListener("DOMContentLoaded", () => {
//   updateSelectedContactsDisplay();
// });


// // Event listener for initializing contact search functionality
// document.addEventListener("DOMContentLoaded", function() {
//     document.getElementById("contactDropdown").addEventListener("click", function() {
//         toggleContactSearch(this);
//     });
// });


  // const categoryInput = document.querySelector("input.categoryDropdown");
  // if (categoryInput && !categoryInput.dataset.value) {
  //   categoryInput.value = "Select task category";
  // }


// /**
//  * Closes dropdowns when clicking outside.
//  */
// document.addEventListener("click", (event) => {
//   if (!event.target.closest(".dropdown-container") && !event.target.classList.contains("dropdown-selected")) {
//     closeAllContactDropdowns();
//     closeAllCategoryDropdowns();
//   }
// });

// /**
//  * Toggles the contact search functionality.
//  *
//  * @param {HTMLElement} element - The element triggering the search toggle.
//  */
// function toggleContactSearch(element) {
//   const dropdownContainer = getDropdownContainer(element);
//   const dropdownOptions = getDropdownOptions(dropdownContainer);

//   if (isButtonElement(element)) {
//     replaceButtonWithInput(element, dropdownOptions);
//   }
// }

// /**
//  * Replaces a button with an input field for searching contacts.
//  *
//  * @param {HTMLInputElement} button - The button element to replace.
//  * @param {HTMLElement} dropdownOptions - The dropdown options container.
//  */
// function replaceButtonWithInput(button, dropdownOptions) {
//   const inputField = createInputField(button);

//   // copyStyles(button, inputField);
//   replaceElement(button, inputField);

//   // addInputEventListeners(inputField, dropdownOptions);

//   inputField.focus();
// }

// /**
//  * Replaces an input field with a button when the dropdown is closed.
//  *
//  * @param {HTMLInputElement} input - The input field to replace.
//  * @param {HTMLElement} dropdownOptions - The dropdown options container.
//  */
// function replaceInputWithButton(input, dropdownOptions) {
//   if (!isDropdownClosed(dropdownOptions)) {
//     return;
//   }
//   resetFilter(dropdownOptions);

//   input.blur();

//   const button = createButton(input);
//   copyStyles(input, button);

//   replaceElement(input, button);

//   button.blur();
// }

// Event listener to replace input with button when clicking outside
// document.addEventListener("click", function (event) {
//   const dropdownOptions = document.getElementById("contact-list");
//   const activeInput = document.querySelector(".dropdown-container input[type='text']");

//   if (activeInput && isDropdownClosed(dropdownOptions)) {
//     replaceInputWithButton(activeInput, dropdownOptions);
//   }
// });
