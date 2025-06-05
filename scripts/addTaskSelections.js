/**
 * Observes changes in dropdown selections.
 */
function observeDropdownChanges() {
  document.querySelectorAll(".dropdown-selected").forEach((dropdown) => {
    const observer = new MutationObserver(() => validateRequiredFields());
    observer.observe(dropdown, { attributes: true, attributeFilter: ["data-value"] });
  });
}

// // Sets up validation on page load
// document.addEventListener("DOMContentLoaded", function() {
//     document.addEventListener("input", validateRequiredFields);
//     observeDropdownChanges();
// });





/**
 * Rotiert das Button-Bild um 180 Grad, wenn das Dropdown geöffnet ist.
 * Setzt die Rotation zurück, wenn es geschlossen wird.
 *
 * @param {HTMLElement} element - Das Element, dessen Bild rotiert werden soll.
 */
function toggleRotation(element) {
  const container = element.closest(".dropdown-container");
  const img = container.querySelector("button img");
  const dropdown = container.querySelector(".dropdown-options");

  if (img && dropdown) {
    if (dropdown.classList.contains("active")) {
      img.classList.add("rotated"); // Bild drehen, wenn Dropdown offen ist
    } else {
      img.classList.remove("rotated"); // Rotation zurücksetzen, wenn geschlossen
    }
  }
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

// document.addEventListener("DOMContentLoaded", () => {
//   updateSelectedContactsDisplay();
// });

/**
 * Selects a category option and updates the input field.
 *
 * @param {HTMLElement} element - The selected category element.
 */
function selectCategoryOption(element) {
  const dropdown = element.closest(".dropdown-container").querySelector("input.categoryDropdown");
  if (!dropdown) return;

  dropdown.value = element.textContent;
  dropdown.dataset.value = element.dataset.value;

  setTimeout(() => {
    closeAllDropdowns();
  });
}

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

/**
 * Toggles the checked state of the checkbox and returns the updated state.
 *
 * @param {HTMLElement} element - The parent element containing the checkbox.
 * @returns {boolean} The updated checked state of the checkbox.
 */
function toggleCheckbox(element) {
  const checkbox = element.querySelector(".hidden-checkbox");
  checkbox.checked = !checkbox.checked;
  return checkbox.checked;
}

/**
 * Updates the background color based on the checked state.
 *
 * @param {HTMLElement} element - The element whose background color is updated.
 * @param {boolean} isChecked - Whether the checkbox is checked.
 */
function updateBackground(element, isChecked) {
  element.style.backgroundColor = isChecked ? "#2a3647" : "";
}

/**
 * Changes the text color based on the checked state.
 *
 * @param {HTMLElement} element - The element containing the text.
 * @param {boolean} isChecked - Whether the checkbox is checked.
 */
function updateTextColor(element, isChecked) {
  const textSpan = element.querySelector("span");
  textSpan.style.color = isChecked ? "#ffffff" : "";
}

/**
 * Updates the checkbox images, ensuring the selected image turns fully white.
 *
 * @param {HTMLElement} element - The element containing the checkbox images.
 * @param {boolean} isChecked - Whether the checkbox is checked.
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
 *
 * @param {HTMLElement} element - The element to apply styles to.
 * @param {boolean} isChecked - Whether the checkbox is checked.
 */
function applySelectionStyles(element, isChecked) {
  updateBackground(element, isChecked);
  updateCheckboxImages(element, isChecked);
  updateTextColor(element, isChecked);
  updateSelectedContacts(element, isChecked);
}

/**
 * Ensures clicking on images correctly toggles selection.
 *
 * @param {HTMLElement} element - The element containing the images.
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

/**
 * Handles selection behavior when an option is clicked.
 *
 * @param {HTMLElement} element - The selected option element.
 */
function selectOption(element) {
  const checkbox = element.querySelector(".hidden-checkbox");

  if (event.target !== checkbox) {
    checkbox.click();
  }

  applySelectionStyles(element, checkbox.checked);
  updateSelectedContacts();
}

/**
 * Updates the selected contacts display based on checked checkboxes.
 */
function updateSelectedContacts() {
  const selectedContactsDiv = document.getElementById("selectedContacts");
  selectedContactsDiv.innerHTML = "";

  const checkedElements = document.querySelectorAll(".hidden-checkbox:checked");

  checkedElements.forEach((checkbox) => {
    const parentElement = checkbox.closest(".option");
    const avatar = parentElement.querySelector(".task-card-avatar");

    if (avatar) {
      const clonedAvatar = avatar.cloneNode(true);
      clonedAvatar.dataset.id = avatar.dataset.id;
      selectedContactsDiv.appendChild(clonedAvatar);
    }
  });

  selectedContactsDiv.style.display = "none";
  selectedContactsDiv.offsetHeight;
  selectedContactsDiv.style.display = "flex";
}

/**
 * Toggles the contact search functionality.
 *
 * @param {HTMLElement} element - The element triggering the search toggle.
 */
function toggleContactSearch(element) {
  const dropdownContainer = getDropdownContainer(element);
  const dropdownOptions = getDropdownOptions(dropdownContainer);

  if (isButtonElement(element)) {
    replaceButtonWithInput(element, dropdownOptions);
  }
}

/**
 * Replaces a button with an input field for searching contacts.
 *
 * @param {HTMLInputElement} button - The button element to replace.
 * @param {HTMLElement} dropdownOptions - The dropdown options container.
 */
function replaceButtonWithInput(button, dropdownOptions) {
  const inputField = createInputField(button);

  // copyStyles(button, inputField);
  replaceElement(button, inputField);

  // addInputEventListeners(inputField, dropdownOptions);

  inputField.focus();
}

/**
 * Replaces an input field with a button when the dropdown is closed.
 *
 * @param {HTMLInputElement} input - The input field to replace.
 * @param {HTMLElement} dropdownOptions - The dropdown options container.
 */
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

// Event listener to replace input with button when clicking outside
// document.addEventListener("click", function (event) {
//   const dropdownOptions = document.getElementById("contact-list");
//   const activeInput = document.querySelector(".dropdown-container input[type='text']");

//   if (activeInput && isDropdownClosed(dropdownOptions)) {
//     replaceInputWithButton(activeInput, dropdownOptions);
//   }
// });
