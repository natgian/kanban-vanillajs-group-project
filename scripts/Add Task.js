// Due to Text-Color-Change
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
        selectedDiv.style.display = "flex"; // Show when content exists
    } else {
        selectedDiv.style.display = "none"; // Hide when empty
    }
}

/**
 * Selects an option from the contact dropdown and updates the selectedContacts div.
 */
function selectContactOption(element) {
    const selectedDiv = document.getElementById("selectedContacts");
    if (!selectedDiv) return;

    // Update the displayed content
    selectedDiv.textContent = element.textContent;

    // Ensure the display is updated correctly
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
    }, 100); // Short delay ensures value update before closing
}

/**
 * Filters the contact dropdown options based on user input.
 */
function filterOptions(query) {
    document.querySelectorAll("#contactDropdown + .dropdown-options .option").forEach(option => {
        option.style.display = option.dataset.value.toLowerCase().includes(query.toLowerCase()) ? "block" : "none";
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

