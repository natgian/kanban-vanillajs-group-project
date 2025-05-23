// Due date Text-Color-Change
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

// submitbutton enabled
function getRequiredFields() {
    return document.querySelectorAll("input[required]");
}
function areAllFieldsFilled(fields) {
    return Array.from(fields).every(field => {
        if (field.classList.contains("dropdown-selected")) {
            return field.dataset.value && field.dataset.value.trim() !== "";
        }
        return field.value.trim() !== "";
    });
}
function toggleSubmitButton(isEnabled) {
    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
        submitBtn.disabled = !isEnabled;
        submitBtn.classList.toggle("enabled", isEnabled);
    }
}
function validateRequiredFields() {
    const requiredFields = getRequiredFields();
    const allFilled = areAllFieldsFilled(requiredFields);
    toggleSubmitButton(allFilled);
}
function observeDropdownChanges() {
    document.querySelectorAll(".dropdown-selected").forEach(dropdown => {
        const observer = new MutationObserver(() => validateRequiredFields());
        observer.observe(dropdown, { attributes: true, attributeFilter: ["data-value"] });
    });
}
document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("input", validateRequiredFields);
    observeDropdownChanges(); 
});

// Custom-Select (Assigned to) "IN PROGRESS"

/**
 * Toggles the visibility of the contact dropdown.
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
 */
function toggleCategoryDropdown(input) {
    const options = input.closest(".dropdown-container").querySelector(".dropdown-options");

    closeAllContactDropdowns();

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
 * Runs the check on page load to ensure correct display state.
 */
document.addEventListener("DOMContentLoaded", () => {
    updateSelectedContactsDisplay();
});

/**
 * Selects an option from the category dropdown and updates the input value.
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
 * Closes only contact dropdowns.
 */
function closeAllContactDropdowns() {
    document.querySelectorAll("#contactDropdown + .dropdown-options").forEach(options => {
        options.style.display = "none";
    });
}

/**
 * Closes only category dropdowns.
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
 * Main function - Handles selection behavior when an option is clicked.
 */
function selectOption(element) {
    const checkbox = element.querySelector(".hidden-checkbox");

    if (event.target !== checkbox) {
        checkbox.click(); 
    }

    applySelectionStyles(element, checkbox.checked);
    updateSelectedContacts(); 
}

function updateSelectedContacts() {
    const selectedContactsDiv = document.getElementById("selectedContacts");
    selectedContactsDiv.innerHTML = ""; // Liste zuerst leeren, um Duplikate zu verhindern

    // Alle ausgewählten Elemente finden
    const checkedElements = document.querySelectorAll(".hidden-checkbox:checked");

    checkedElements.forEach(checkbox => {
        const parentElement = checkbox.closest(".option"); // Hier sicherstellen, dass das richtige Elternelement genutzt wird
        const avatar = parentElement.querySelector(".task-card-avatar");

        if (avatar) {
            const clonedAvatar = avatar.cloneNode(true);
            clonedAvatar.dataset.id = avatar.dataset.id;
            selectedContactsDiv.appendChild(clonedAvatar);
        }
    });
}

function updateSelectedContacts() {
    const selectedContactsDiv = document.getElementById("selectedContacts");
    selectedContactsDiv.innerHTML = ""; // Erst leeren, dann neu aufbauen

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

    // Erzwingen, dass der Browser das Layout neu berechnet:
    selectedContactsDiv.style.display = "none"; 
    selectedContactsDiv.offsetHeight; // Erzwingt ein Reflow
    selectedContactsDiv.style.display = "flex"; 
}





// Searchbar

function toggleContactSearch(element) {
    const dropdownContainer = getDropdownContainer(element);
    const dropdownOptions = getDropdownOptions(dropdownContainer);

    if (isButtonElement(element)) {
        replaceButtonWithInput(element, dropdownOptions);
    }
}

function replaceButtonWithInput(button, dropdownOptions) {
    const inputField = createInputField(button);

    copyStyles(button, inputField);
    replaceElement(button, inputField);

    openDropdown(dropdownOptions);
    addInputEventListeners(inputField, dropdownOptions);

    inputField.focus();
}

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

document.addEventListener("click", function(event) {
    const dropdownOptions = document.getElementById("contact-list");
    const activeInput = document.querySelector(".dropdown-container input[type='text']");

    if (activeInput && isDropdownClosed(dropdownOptions)) {
        replaceInputWithButton(activeInput, dropdownOptions);
    }
});

/* little Helpers */

function getDropdownContainer(element) {
    return element.closest('.dropdown-container');
}

function getDropdownOptions(dropdownContainer) {
    return dropdownContainer.querySelector('.dropdown-options');
}

function isButtonElement(element) {
    return element.tagName === 'INPUT' && element.type === 'button';
}

function createInputField(button) {
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Search contacts...';
    inputField.className = button.className;
    inputField.id = button.id;
    return inputField;
}

function createButton(input) {
    const button = document.createElement('input');
    button.type = 'button';
    button.value = 'Select contacts to assign';
    button.className = input.className;
    button.id = input.id;
    button.onclick = () => toggleContactSearch(button);
    return button;
}

function replaceElement(oldElement, newElement) {
    const container = oldElement.closest('.dropdown-container');
    
    if (!container) {
        console.error("Fehler: dropdown-container nicht gefunden!");
        return;
    }

    container.replaceChild(newElement, oldElement);
}

function openDropdown(dropdownOptions) {
    dropdownOptions.style.display = 'block';
}

function isDropdownClosed(dropdownOptions) {
    return dropdownOptions && window.getComputedStyle(dropdownOptions).display === 'none';
}

function addInputEventListeners(inputField, dropdownOptions) {
    inputField.addEventListener('input', () => filterOptions(inputField.value, dropdownOptions));
    inputField.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            replaceInputWithButton(inputField, dropdownOptions);
        }
    });
}

// Filter Contacts

function filterOptions(query, dropdownOptions) {
    dropdownOptions.querySelectorAll('.option').forEach(option => {
        option.style.display = option.textContent.toLowerCase().includes(query.toLowerCase()) ? 'flex' : 'none';
    });
}

function resetFilter(dropdownOptions) {
    dropdownOptions.querySelectorAll('.option').forEach(option => {
        option.style.display = 'flex';
    });
}

function copyStyles(source, target) {
    const computedStyle = window.getComputedStyle(source);
    target.style.backgroundColor = computedStyle.backgroundColor;
    target.style.color = computedStyle.color;
    target.style.fontWeight = computedStyle.fontWeight;
    target.style.border = computedStyle.border;
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("contactDropdown").addEventListener("click", function() {
        toggleContactSearch(this);
    });
});

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

// Add Subtasks
document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("newSubtask");
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
});

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("newSubtask");
    const addSubtask = document.getElementById("addSubtask");

    /**
     * Simulates a click on the input field by setting focus to it.
     */
    function simulateInputClick() {
        input.focus(); 
        showConfirmDelete()
    }

    // Ensures clicking "addSubtask" behaves like clicking the input field
    addSubtask.addEventListener("click", simulateInputClick);
});

function deleteSubtask(element) {
    const listItem = element.closest('li'); // Findet das zugehörige <li>-Element
    if (listItem) {
        listItem.remove(); // Entfernt das <li> aus der Liste
    }
}

function editSubtask(element) {
    const listItem = element.closest('li'); 
    const editDelate = listItem.querySelector('#editDelate');
    const deleteChange = listItem.querySelector('#deleteChange');
    const textElement = listItem.childNodes[0]; // Erster Text-Knoten

    // Punkt verstecken & Hintergrund setzen
    listItem.classList.add('editing');
    listItem.style.backgroundColor = 'white';

    // Macht den Text direkt bearbeitbar
    textElement.contentEditable = true;
    textElement.focus(); // Setzt direkt den Fokus darauf

    // Anzeige umschalten
    editDelate.style.display = 'none';
    deleteChange.style.display = 'flex';

    // Speichern durch Klick auf den "Check"-Button
    const saveButton = listItem.querySelector('img[alt="Check"]');
    saveButton.onclick = () => saveSubtask(listItem);
}

// function saveSubtask(listItem) {
//     const textElement = listItem.childNodes[0]; // Holt den bearbeiteten Text

//     // Entfernt `contentEditable`, damit es wieder normal ist
//     textElement.contentEditable = false;

//     // Hintergrund & Punkt zurücksetzen
//     listItem.style.backgroundColor = '';
//     listItem.classList.remove('editing');

//     // Anzeige zurücksetzen
//     listItem.querySelector('#editDelate').style.display = 'flex';
//     listItem.querySelector('#deleteChange').style.display = 'none';
// }