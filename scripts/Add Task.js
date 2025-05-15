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
    closeAllDropdowns();

    if (options) {
        const isVisible = options.style.display === "block";
        options.style.display = isVisible ? "none" : "block";

        if (!isVisible) {
            input.type = "text";
            input.value = "";
            input.dataset.value = "";
            input.oninput = () => filterOptions(input.value);
        }
    }
}

/**
 * Toggles the visibility of the category dropdown.
 */
function toggleCategoryDropdown(input) {
    const options = input.closest(".dropdown-container").querySelector(".dropdown-options");
    closeAllDropdowns();

    if (options) {
        options.style.display = options.style.display === "block" ? "none" : "block";
    }
}

/**
 * Selects an option from the contact dropdown and updates the input value.
 */
function selectContactOption(element) {
    const input = document.getElementById("contactDropdown");
    if (!input) return;

    input.value = element.textContent;
    input.dataset.value = element.dataset.value;
    closeAllDropdowns();

    document.getElementById("selectedContacts").innerHTML = element.dataset.value;
}

/**
 * Selects an option from the category dropdown and updates the input value.
 */
function selectCategoryOption(element) {
    const dropdown = element.closest(".dropdown-container").querySelector("input.categoryDropdown");

    if (dropdown) {
        dropdown.value = element.textContent;
        dropdown.dataset.value = element.dataset.value;
    }

    closeAllDropdowns();
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
 * Closes all dropdowns and resets the input display.
 */
function closeAllDropdowns() {
    document.querySelectorAll(".dropdown-options").forEach(options => {
        options.style.display = "none";
    });

    document.querySelectorAll("input.dropdown-selected").forEach(input => {
        input.value = input.classList.contains("categoryDropdown") ? "Select task category" : "Select contacts to assign";
    });
}

/**
 * Closes dropdowns when clicking outside.
 */
document.addEventListener("click", event => {
    if (!event.target.closest(".dropdown-container") && !event.target.classList.contains("dropdown-selected")) {
        closeAllDropdowns();
    }
});