/**
 * Initializes the task addition process by rendering the UI and setting up event listeners.
 * It also fetches contact data and loads it for selection.
 *
 * @async
 * @function initAddTask
 */
async function initAddTask() {
  document.getElementById("contentload").innerHTML = renderAddTask();
  initializePriorityButtons();
  initializeObserveDropdownChanges();
  updateSelectedContactsDisplay();
  initializeCloseAllDropdowns();
  initializeSubtasksButtons();
  initializeSubtasksimulateInputClick();
  initializeResetAllOptions();
  const contacts = await fetchContacts();
  loadContacts(contacts);
}

/**
 * Gets the task data from the UI, saves the task, resets the form, shows a success message and redirects
 * to the board
 *
 */
async function addTask() {
  const task = getTaskData();
  try {
    await saveTask(task);
  } catch (error) {
    console.error("Something went wrong:", error);
  }

  initReset();
  showMessage("Task successfully created");
  setTimeout(() => {
    window.location.href = "./board.html";
  }, 500);
}

/**
 * Initializes observation of dropdown changes by adding an event listener
 * that triggers validation of required fields.
 *
 * @function initializeObserveDropdownChanges
 */
function initializeObserveDropdownChanges() {
  document.addEventListener("input", validateRequiredFields);
  observeDropdownChanges();
}

/**
 * Sets up an event listener to close all dropdowns when a click occurs outside
 * of a dropdown container, ensuring only relevant elements remain active.
 *
 * @function initializeCloseAllDropdowns
 */
function initializeCloseAllDropdowns() {
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".dropdown-container") && !event.target.classList.contains("dropdown-selected")) {
      closeAllDropdowns();
    }
  });
}

/**
 * Initializes the reset functionality by setting up an event listener
 * on the reset button that clears all selected options.
 *
 * @function initializeResetAllOptions
 */
function initializeResetAllOptions() {
  window.onload = function () {
    document.getElementById("resetButton").addEventListener("click", resetAllOptions); // Adds event listener to reset button
  };
}

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

/**
 * Selects the middle button in the list and resets others.
 * Applies selected styles to the middle button.
 */
function selectMiddleButton() {
  const buttons = document.querySelectorAll(".priorityBtns");
  const middleIndex = Math.floor(buttons.length / 2);

  buttons.forEach((btn, index) => {
    resetButtonStyles(btn);
    if (index === middleIndex) {
      applySelectedStyles(btn);
      const selectedImg = btn.querySelector("img");
      applyWhiteFilter(selectedImg);
    }
  });
}

/**
 * Applies a white filter to the given image.
 * Ensures the filter is applied after the image is loaded.
 *
 * @param {HTMLImageElement} img - The image element to modify.
 */
function applyWhiteFilter(img) {
  img.onload = () => {
    applyColorFilter(img, "white");
  };

  if (img.complete) {
    applyColorFilter(img, "white");
  }
}

// Executes the function when the page loads
window.addEventListener("load", () => {
  selectMiddleButton();
});

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
  dateInput.type = "date";
  dateInput.setAttribute("placeholder", "dd/mm/yy");

  dateInput.addEventListener(
    "focus",
    function () {
      dateInput.type = "date";
    },
    { once: true }
  );
}
