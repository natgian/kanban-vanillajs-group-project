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
function selectButton(button) {
    document.querySelectorAll('.priorityBtns').forEach(btn => {
        btn.classList.remove('selected');
        btn.style.backgroundColor = ''; 
        btn.style.color = ''; 
        btn.style.fontWeight = ''; 
    });

    button.classList.add('selected');

    const color = button.dataset.color || "#ffa800";
    button.style.backgroundColor = color;
    button.style.color = "white";
    button.style.fontWeight = "bold";
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

    // Close only category dropdowns, but keep contact dropdown separate
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

    // Close only contact dropdowns, but keep category dropdown separate
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
    setupImageClickEvents(element);
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
