// ---------------------NEU---------------------//
async function initAddTask() {
  document.getElementById("contentload").innerHTML = renderAddTask();
  initializePriorityButtons();
  // initializeToggleContactSearch();
  initializeObserveDropdownChanges();
  updateSelectedContactsDisplay();
  initializeCloseAllDropdowns();
  // initializeReplaceInputWithButton();
  initializeSubtasksButtons();
  initializeSubtasksimulateInputClick();
  initializeResetAllOptions();
  // const contacts = await fetchContacts();
  // loadContacts(contacts);
}

// function initializeToggleContactSearch() {
//   document.getElementById("contactDropdown").addEventListener("click", function () {
//     toggleContactSearch(this);
//   });
// }

function initializeObserveDropdownChanges() {
  document.addEventListener("input", validateRequiredFields);
  observeDropdownChanges();
}

function initializeCloseAllDropdowns() {
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".dropdown-container") && !event.target.classList.contains("dropdown-selected")) {
      closeAllDropdowns();
    }
  });
}

// function initializeReplaceInputWithButton() {
//   // Event listener to replace input with button when clicking outside
//   document.addEventListener("click", function (event) {
//     const dropdownOptions = document.getElementById("contact-list");
//     const activeInput = document.querySelector(".dropdown-container input[type='text']");

//     if (activeInput && isDropdownClosed(dropdownOptions)) {
//       replaceInputWithButton(activeInput, dropdownOptions);
//     }
//   });
// }

let addTaskStatus = "to-do";
/**
 * Sets the addTaskStatus variable to the given status and initializes the board
 *
 * @param {string} status - The new task status ("to-do", "in-progress" or "awaiting-feedback")
 */
function setAddTaskStatus(status) {
  addTaskStatus = status;
  initBoardAddTask();
}

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

  // Make functions globally accessible
  window.resetElements = resetElements;
  window.showConfirmDelete = showConfirmDelete;

  // Add event listeners
  input.addEventListener("click", showConfirmDelete);
  document.addEventListener("click", resetOnOutsideClick);
}

function initializeSubtasksimulateInputClick() {
  document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("newSubtask");
    const addSubtask = document.getElementById("addSubtask");

    /**
     * Simulates a click on the input field by setting focus to it.
     */
    function simulateInputClick() {
      input.focus();
      showConfirmDelete();
    }

    // Ensures clicking "addSubtask" behaves like clicking the input field
    addSubtask.addEventListener("click", simulateInputClick);
  });
}

function initializeResetAllOptions() {
  /**
   * Ensures resetAllOptions runs when the page loads.
   */
  window.onload = function () {
    document.getElementById("resetButton").addEventListener("click", resetAllOptions);
  };
}

// ---------------------NEU---------------------//

/**
 * Checks if the input field has a value and updates its class accordingly.
 */
function checkValue() {
  let input = document.getElementById("date-input");
  if (input.value) {
    input.classList.add("filled");
  } else {
    input.classList.remove("filled");
  }
}

// // Priority Buttons
// // Waits for the DOM to be fully loaded before executing the setup function
// document.addEventListener("DOMContentLoaded", () => {
//   initializePriorityButtons();
// });

/**
 * Initializes all priority buttons by storing the original image source
 * and adding an event listener to handle button selection.
 */
function initializePriorityButtons() {
  document.querySelectorAll(".priorityBtns").forEach((btn) => {
    const img = btn.querySelector("img");
    img.dataset.originalSrc = img.src;

    btn.addEventListener("click", () => handleButtonClick(btn));
  });
}

/**
 * Handles the click event when a priority button is selected.
 * Updates button styles and applies the appropriate image color filters.
 *
 * @param {HTMLElement} button - The button that was clicked.
 */
function handleButtonClick(button) {
  document.querySelectorAll(".priorityBtns").forEach((btn) => {
    resetButtonStyles(btn);
  });

  applySelectedStyles(button);

  const selectedImg = button.querySelector("img");
  applyColorFilter(selectedImg, "white");
}

/**
 * Resets the styling and image source for a priority button.
 *
 * @param {HTMLElement} button - The button to reset.
 */
function resetButtonStyles(button) {
  button.classList.remove("selected");
  button.style.backgroundColor = "";
  button.style.color = "";
  button.style.fontWeight = "";

  const img = button.querySelector("img");
  img.src = img.dataset.originalSrc;
  applyColorFilter(img, button.dataset.color || "#ffa800");
}

/**
 * Applies the selected styles to a priority button.
 *
 * @param {HTMLElement} button - The button to style as selected.
 */
function applySelectedStyles(button) {
  button.classList.add("selected");

  const color = button.dataset.color || "#ffa800";
  button.style.backgroundColor = color;
  button.style.color = "white";
  button.style.fontWeight = "bold";
}

/**
 * Applies a color filter to an image using a canvas.
 * If the image is not yet loaded, it waits for the load event before processing.
 *
 * @param {HTMLImageElement} img - The image element to modify.
 * @param {string} color - The target color for the image.
 */
function applyColorFilter(img, color) {
  if (!img.complete) {
    img.onload = () => applyColorFilter(img, color);
    return;
  }

  const { canvas, ctx } = createCanvas(img);
  drawImageOnCanvas(ctx, img);

  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  applyPixelManipulation(imageData.data, color);

  ctx.putImageData(imageData, 0, 0);
  img.src = canvas.toDataURL();
}

/**
 * Creates a canvas element and returns the canvas and its 2D context.
 *
 * @param {HTMLImageElement} img - The image element to determine size.
 * @returns {Object} An object containing the canvas and its 2D context.
 */
function createCanvas(img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.width;
  canvas.height = img.height;

  return { canvas, ctx };
}

/**
 * Draws an image onto the canvas.
 *
 * @param {CanvasRenderingContext2D} ctx - The 2D drawing context of the canvas.
 * @param {HTMLImageElement} img - The image element to be drawn.
 */
function drawImageOnCanvas(ctx, img) {
  ctx.drawImage(img, 0, 0);
}

/**
 * Applies color transformation to each pixel in the image data.
 *
 * @param {Uint8ClampedArray} data - The pixel data array from the image.
 * @param {string} color - The target color for manipulation.
 */
function applyPixelManipulation(data, color) {
  for (let i = 0; i < data.length; i += 4) {
    if (color === "white") {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    } else {
      data[i] = data[i] * 0.5 + parseInt(color.substring(1, 3), 16) * 0.5;
      data[i + 1] = data[i + 1] * 0.5 + parseInt(color.substring(3, 5), 16) * 0.5;
      data[i + 2] = data[i + 2] * 0.5 + parseInt(color.substring(5, 7), 16) * 0.5;
    }
  }
}

/**
 * Retrieves all required input fields.
 *
 * @returns {NodeList} A list of required input fields.
 */
function getRequiredFields() {
  return document.querySelectorAll("input[required]");
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

/**
 * Enables or disables the submit button based on form validation.
 *
 * @param {boolean} isEnabled - Whether the button should be enabled.
 */
function toggleSubmitButton(isEnabled) {
  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) {
    submitBtn.disabled = !isEnabled;
    submitBtn.classList.toggle("enabled", isEnabled);
  }
}

/**
 * Validates required fields and toggles the submit button.
 */
function validateRequiredFields() {
  const requiredFields = getRequiredFields();
  const allFilled = areAllFieldsFilled(requiredFields);
  toggleSubmitButton(allFilled);
}

// ResetBtn
/**
 * Initializes all reset functions upon page load.
 */
function initReset() {
  resetFields();
  resetAllOptions();
  selectMiddleButton();
  deselectCategoryOption();
  resetDateInput();
}

/**
 * Resets all elements marked with the "resetTarget" class.
 * Clears input fields, textareas, resets select elements, and unchecks checkboxes/radio buttons.
 */
function resetFields() {
  document.querySelectorAll(".resetTarget").forEach((element) => {
    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      element.value = "";
    } else if (element.tagName === "SELECT") {
      element.selectedIndex = 0;
    } else if (element.type === "checkbox" || element.type === "radio") {
      element.checked = false;
    } else {
      element.innerHTML = "";
    }
  });
}

/**
 * Resets all checkboxes within elements with the "option" class.
 * Applies updated styles to reflect unchecked status.
 */
function resetAllOptions() {
  document.querySelectorAll(".option").forEach((option) => {
    const checkbox = option.querySelector(".hidden-checkbox");
    if (checkbox) {
      checkbox.checked = false;
      applySelectionStyles(option, checkbox.checked);
    }
  });
}

// /**
//  * Ensures resetAllOptions runs when the page loads.
//  */
// window.onload = function () {
//   document.getElementById("resetButton").addEventListener("click", resetAllOptions);
// };

/**
 * Selects the middle button in the list and resets others.
 * Applies selected styles and updates the button's image.
 */
function selectMiddleButton() {
  const buttons = document.querySelectorAll(".priorityBtns");
  const middleIndex = Math.floor(buttons.length / 2);

  buttons.forEach((btn, index) => {
    resetButtonStyles(btn);
    if (index === middleIndex) {
      applySelectedStyles(btn);
      const selectedImg = btn.querySelector("img");
      applyColorFilter(selectedImg, "white");
    }
  });
}

/**
 * Deselects the selected category option and clears the input field.
 * Ensures the dropdown menu is properly closed.
 */
function deselectCategoryOption() {
  const categoryInput = document.querySelector("input.categoryDropdown");
  if (!categoryInput) return;

  categoryInput.value = "Select task category";
  categoryInput.dataset.value = "";

  setTimeout(() => {
    closeAllDropdowns();
  });
}

/**
 * Resets the date input field to display the placeholder.
 * Keeps placeholder visible until the user interacts with the field.
 */
function resetDateInput() {
  const dateInput = document.getElementById("date-input");
  if (!dateInput) return;

  dateInput.value = "";
  dateInput.type = "text";
  dateInput.setAttribute("placeholder", "dd/mm/yy");

  dateInput.addEventListener(
    "focus",
    function () {
      dateInput.type = "date";
    },
    { once: true }
  );
}
