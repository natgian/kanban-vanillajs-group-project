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

// Priority Buttons
// Waits for the DOM to be fully loaded before executing the setup function
document.addEventListener("DOMContentLoaded", () => {
    initializePriorityButtons();
});

/**
 * Initializes all priority buttons by storing the original image source
 * and adding an event listener to handle button selection.
 */
function initializePriorityButtons() {
    document.querySelectorAll(".priorityBtns").forEach(btn => {
        const img = btn.querySelector("img");
        img.dataset.originalSrc = img.src; // Stores the original image source

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
    document.querySelectorAll(".priorityBtns").forEach(btn => {
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
    return Array.from(fields).every(field => {
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

/**
 * Observes changes in dropdown selections.
 */
function observeDropdownChanges() {
    document.querySelectorAll(".dropdown-selected").forEach(dropdown => {
        const observer = new MutationObserver(() => validateRequiredFields());
        observer.observe(dropdown, { attributes: true, attributeFilter: ["data-value"] });
    });
}

// Sets up validation on page load
document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("input", validateRequiredFields);
    observeDropdownChanges(); 
});

/**
 * Toggles the visibility of the contact dropdown.
 * 
 * @param {HTMLInputElement} input - The dropdown input element.
 */
function toggleContactDropdown(input) {
    const options = input.closest(".dropdown-container").querySelector(".dropdown-options");

    closeAllCategoryDropdowns();
    replaceInputWithButton();

    if (options) {
        options.style.display = options.style.display === "block" ? "none" : "block";
    }
}

/**
 * Toggles the visibility of the category dropdown.
 * 
 * @param {HTMLInputElement} input - The dropdown input element.
 */
function toggleCategoryDropdown(input) {
    const options = input.closest(".dropdown-container").querySelector(".dropdown-options");

    closeAllContactDropdowns();

    if (options) {
        options.style.display = options.style.display === "block" ? "none" : "block";
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
        closeAllContactDropdowns();
    }, 100);
}

document.addEventListener("DOMContentLoaded", () => {
    updateSelectedContactsDisplay();
});

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
        closeAllCategoryDropdowns();
    });
}

/**
 * Closes all contact dropdowns.
 */
function closeAllContactDropdowns() {
    document.querySelectorAll("#contactDropdown + .dropdown-options").forEach(options => {
        options.style.display = "none";
    });
}

/**
 * Closes all category dropdowns.
 */
function closeAllCategoryDropdowns() {
    document.querySelectorAll(".categoryDropdown + .dropdown-options").forEach(options => {
        options.style.display = "none";
    });

    const categoryInput = document.querySelector("input.categoryDropdown");
    if (categoryInput && !categoryInput.dataset.value) {
        categoryInput.value = "Select task category";
    }
}

/**
 * Closes dropdowns when clicking outside.
 */
document.addEventListener("click", event => {
    if (!event.target.closest(".dropdown-container") && !event.target.classList.contains("dropdown-selected")) {
        closeAllContactDropdowns();
        closeAllCategoryDropdowns();
    }
});









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

    images.forEach(img => {
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

    checkedElements.forEach(checkbox => {
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

    copyStyles(button, inputField);
    replaceElement(button, inputField);

    openDropdown(dropdownOptions);
    addInputEventListeners(inputField, dropdownOptions);

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
document.addEventListener("click", function(event) {
    const dropdownOptions = document.getElementById("contact-list");
    const activeInput = document.querySelector(".dropdown-container input[type='text']");

    if (activeInput && isDropdownClosed(dropdownOptions)) {
        replaceInputWithButton(activeInput, dropdownOptions);
    }
});

/* Helper Functions */

/**
 * Retrieves the dropdown container of a given element.
 * 
 * @param {HTMLElement} element - The element inside the dropdown container.
 * @returns {HTMLElement} The closest dropdown container.
 */
function getDropdownContainer(element) {
    return element.closest('.dropdown-container');
}

/**
 * Retrieves the dropdown options container.
 * 
 * @param {HTMLElement} dropdownContainer - The dropdown container element.
 * @returns {HTMLElement} The dropdown options container.
 */
function getDropdownOptions(dropdownContainer) {
    return dropdownContainer.querySelector('.dropdown-options');
}

/**
 * Checks if an element is a button.
 * 
 * @param {HTMLElement} element - The element to check.
 * @returns {boolean} True if the element is a button, false otherwise.
 */
function isButtonElement(element) {
    return element.tagName === 'INPUT' && element.type === 'button';
}

/**
 * Creates an input field for searching contacts.
 * 
 * @param {HTMLInputElement} button - The button element to replace.
 * @returns {HTMLInputElement} The newly created input field.
 */
function createInputField(button) {
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Search contacts...';
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
    const button = document.createElement('input');
    button.type = 'button';
    button.value = 'Select contacts to assign';
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
    const container = oldElement.closest('.dropdown-container');
    
    if (!container) {
        console.error("Error: dropdown-container not found!");
        return;
    }

    container.replaceChild(newElement, oldElement);
}

/**
 * Opens the dropdown options.
 * 
 * @param {HTMLElement} dropdownOptions - The dropdown options container.
 */
function openDropdown(dropdownOptions) {
    dropdownOptions.style.display = 'block';
}

/**
 * Checks if the dropdown is closed.
 * 
 * @param {HTMLElement} dropdownOptions - The dropdown options container.
 * @returns {boolean} True if the dropdown is closed, false otherwise.
 */
function isDropdownClosed(dropdownOptions) {
    return dropdownOptions && window.getComputedStyle(dropdownOptions).display === 'none';
}

/**
 * Adds event listeners to the input field for filtering and closing on Escape key.
 * 
 * @param {HTMLInputElement} inputField - The input field element.
 * @param {HTMLElement} dropdownOptions - The dropdown options container.
 */
function addInputEventListeners(inputField, dropdownOptions) {
    inputField.addEventListener('input', () => filterOptions(inputField.value, dropdownOptions));
    inputField.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            replaceInputWithButton(inputField, dropdownOptions);
        }
    });
}






/**
 * Filters dropdown options based on the search query.
 * 
 * @param {string} query - The search query entered by the user.
 * @param {HTMLElement} dropdownOptions - The dropdown options container.
 */
function filterOptions(query, dropdownOptions) {
    dropdownOptions.querySelectorAll('.option').forEach(option => {
        option.style.display = option.textContent.toLowerCase().includes(query.toLowerCase()) ? 'flex' : 'none';
    });
}

/**
 * Resets the filter, displaying all dropdown options.
 * 
 * @param {HTMLElement} dropdownOptions - The dropdown options container.
 */
function resetFilter(dropdownOptions) {
    dropdownOptions.querySelectorAll('.option').forEach(option => {
        option.style.display = 'flex';
    });
}

/**
 * Copies styles from one element to another.
 * 
 * @param {HTMLElement} source - The element to copy styles from.
 * @param {HTMLElement} target - The element to apply copied styles to.
 */
function copyStyles(source, target) {
    const computedStyle = window.getComputedStyle(source);
    target.style.backgroundColor = computedStyle.backgroundColor;
    target.style.color = computedStyle.color;
    target.style.fontWeight = computedStyle.fontWeight;
    target.style.border = computedStyle.border;
}

// Event listener for initializing contact search functionality
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("contactDropdown").addEventListener("click", function() {
        toggleContactSearch(this);
    });
});

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

// Add Subtasks
document.addEventListener("DOMContentLoaded", function () {
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
});

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

/**
 * Deletes a subtask from the list.
 * 
 * @param {HTMLElement} element - The delete button inside the subtask item.
 */
function deleteSubtask(element) {
    const listItem = element.closest('li'); // Finds the corresponding <li> element
    if (listItem) {
        listItem.remove(); // Removes the <li> from the list
    }
}










/**
 * Toggles the edit mode for a list item.
 * 
 * @param {HTMLElement} element - The element triggering edit mode.
 */
function toggleEditMode(element) {
    const listItem = element.closest('li'); 
    if (!listItem) return;

    const { textElement, editDelate, deleteChange } = getElements(listItem);
    if (!textElement || !editDelate || !deleteChange) return;

    listItem.dataset.originalText = textElement.innerText;
    applyEditStyles(listItem, textElement, editDelate, deleteChange);
    document.addEventListener('click', resetEditMode);
}

/**
 * Retrieves required elements within a list item.
 * 
 * @param {HTMLElement} listItem - The list item containing elements.
 * @returns {Object} An object containing the required elements.
 */
function getElements(listItem) {
    return {
        textElement: listItem.querySelector('#editableText'),
        editDelate: listItem.querySelector('#editDelate'),
        deleteChange: listItem.querySelector('#deleteChange')
    };
}

/**
 * Applies editing styles and properties.
 * 
 * @param {HTMLElement} listItem - The list item being edited.
 * @param {HTMLElement} textElement - The editable text element.
 * @param {HTMLElement} editDelate - The edit button element.
 * @param {HTMLElement} deleteChange - The delete button element.
 */
function applyEditStyles(listItem, textElement, editDelate, deleteChange) {
    listItem.classList.add('editing');
    listItem.style.backgroundColor = 'white';
    editDelate.style.display = 'none';
    deleteChange.style.display = 'flex';

    textElement.contentEditable = true;
    textElement.focus();
}

/**
 * Resets edit mode if clicking outside the editing area.
 * 
 * @param {Event} event - The event triggering the reset.
 */
function resetEditMode(event) {
    const listItem = document.querySelector('.editing');
    if (listItem && !listItem.contains(event.target)) {
        cancelEditMode(listItem, listItem.dataset.originalText);
        document.removeEventListener('click', resetEditMode);
    }
}

/**
 * Cancels editing and restores the original text.
 * 
 * @param {HTMLElement} listItem - The list item being edited.
 * @param {string} originalText - The original text before editing.
 */
function cancelEditMode(listItem, originalText) {
    const { textElement, editDelate, deleteChange } = getElements(listItem);
    if (!textElement || !editDelate || !deleteChange) return;

    textElement.innerText = originalText;
    textElement.contentEditable = false;
    removeEditStyles(listItem, editDelate, deleteChange);
}

/**
 * Removes editing styles and restores display settings.
 * 
 * @param {HTMLElement} listItem - The list item being edited.
 * @param {HTMLElement} editDelate - The edit button element.
 * @param {HTMLElement} deleteChange - The delete button element.
 */
function removeEditStyles(listItem, editDelate, deleteChange) {
    listItem.classList.remove('editing');
    listItem.style.backgroundColor = ''; 
    editDelate.style.display = 'flex';
    deleteChange.style.display = 'none';
}

/**
 * Saves new input and exits edit mode.
 * 
 * @param {HTMLElement} element - The element triggering save.
 */
function saveAndExitEditMode(element) {
    const listItem = element.closest('li');
    const { textElement, editDelate, deleteChange } = getElements(listItem);
    if (!textElement) return;

    console.log('Saving input:', textElement.innerText);
    textElement.blur();
    
    setTimeout(() => {
        removeEditStyles(listItem, editDelate, deleteChange);
        document.removeEventListener('click', resetEditMode);
        document.activeElement.blur(); 
    }, 10);
}

/**
 * Adds a new subtask item to the list.
 */
function addSubtask() {
    const input = document.getElementById('newSubtask');
    const subtaskList = document.getElementById('subtaskList');
    if (!input || !subtaskList || !input.value.trim()) return;

    const listItem = createSubtaskElement(input.value.trim());
    subtaskList.appendChild(listItem);
    
    resetInput(input);
    toggleButtons(true);
}

/**
 * Clears the input field and removes focus.
 * 
 * @param {HTMLInputElement} input - The input field to reset.
 */
function resetInput(input) {
    input.value = '';
    input.blur();
}

/**
 * Controls the visibility of action buttons.
 * 
 * @param {boolean} showAddSubtask - Whether to show the add subtask button.
 */
function toggleButtons(showAddSubtask) {
    const addSubtaskBtn = document.getElementById('addSubtask');
    const confirmDeleteBtn = document.getElementById('confirmDeleteNewSubtask');
    
    if (addSubtaskBtn) addSubtaskBtn.style.display = showAddSubtask ? 'block' : 'none';
    if (confirmDeleteBtn) confirmDeleteBtn.style.display = showAddSubtask ? 'none' : 'block';
}