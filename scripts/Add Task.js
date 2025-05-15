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

/**
 * fills data in tamplate
 */
function addContactToTemplate(person) {
  const contactName = person.name;
  const template = `
    <div class="option" data-value="${contactName}" onclick="selectOption(this)">
      <div class="task-card-avatar" style="background-color: ${person.color}">${person.initials}</div>
      <span>${contactName}</span>
      <label>
        <input type="checkbox" class="hidden-checkbox"/>
        <img src="../assets/icons/checkbox_icon.svg" class="unchecked"/>
        <img src="../assets/icons/checkbox_checked_icon.svg" class="checked"/>
      </label>
    </div>
  `;
  document.getElementById("contact-list").innerHTML += template;
}


// Custom-Select (Assigned to) "IN PROGRESS"

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

/**
 * Toggles the visibility of the contact dropdown.
 * Clears the input field and prepares filtering when typing.
 */
function toggleContactDropdown(input) {
    if (input.id !== "contactDropdown") return;
    const options = input.nextElementSibling;
    closeAllDropdowns();
    toggleVisibility(options);
    input.type = "text";
    input.value = "";
    input.dataset.value = "";
    input.oninput = () => filterOptions(input.value);
}

/**
 * Selects an option from the dropdown and updates the input field.
 */
function selectOption(element) {
    const input = document.getElementById("contactDropdown");
    if (!input) return;
    
    input.value = element.dataset.value;
    input.dataset.value = element.dataset.value;
    closeAllDropdowns();
    
    const selectedDiv = document.getElementById("selectedContacts");
    selectedDiv.innerHTML = `${element.dataset.value}`;
}

/**
 * Resets the contact dropdown to its default text display.
 */
function resetTextDropdown() {
    const input = document.getElementById("contactDropdown");
    if (input) {
        input.type = "button";
        input.value = "Select contacts to assign";
    }
}

/**
 * Filters dropdown options based on user input.
 */
function filterOptions(query) {
    document.querySelectorAll("#contactDropdown + .dropdown-options .option").forEach(option => {
        option.style.display = option.dataset.value.toLowerCase().includes(query.toLowerCase()) ? "block" : "none";
    });
}

/**
 * Closes all dropdowns and resets the contact dropdown text.
 */
function closeAllDropdowns() {
    document.querySelectorAll(".dropdown-options").forEach(options => {
        options.style.display = "none";
    });
    
    // Reset inputs after closing
    document.querySelectorAll(".dropdown-selected").forEach(input => {
        if (input.classList.contains("categoryDropdown")) {
            input.value = "Select task category";
        } else {
            input.value = "Select contacts to assign";
        }
    });
}

/**
 * Toggles the visibility of an element (dropdown options).
 */
function toggleVisibility(element) {
    if (element) {
        element.style.display = element.style.display === "block" ? "none" : "block";
    }
}

/**
 * Closes the dropdown when clicking outside of it.
 */
document.addEventListener("click", event => {
    const dropdown = document.getElementById("contactDropdown");
    const options = dropdown.nextElementSibling;
    
    if (!dropdown.contains(event.target) && !options.contains(event.target)) {
        closeAllDropdowns();
    }
});

/**
 * Adds click event listeners to dropdown options for selection.
 */
document.querySelectorAll(".option").forEach(option => {
    option.addEventListener("click", function() {
        selectOption(this);
    });
});

// secound costum-select
/**
 * Toggles the visibility of the dropdown options when clicking the input button.
 */
function toggleCategoryDropdown(input) {
    const options = input.closest(".dropdown-container").querySelector(".dropdown-options");

    closeAllDropdowns();
    
    // Toggle only if found
    if (options) {
        options.style.display = options.style.display === "block" ? "none" : "block";
    }
}

/**
 * Selects an option from the dropdown and updates the input value.
 */
function selectCategoryOption(element) {
    const dropdown = element.closest(".dropdown-container").querySelector(".dropdown-selected");
    
    dropdown.value = element.textContent;
    dropdown.dataset.value = element.dataset.value;
    
    closeAllDropdowns();
}

/**
 * Closes all dropdowns and hides their options.
 */
function closeAllDropdowns() {
    document.querySelectorAll(".dropdown-options").forEach(options => {
        options.style.display = "none";
    });
}

/**
 * Closes the dropdown when clicking outside of it or on the input button again.
 */
document.addEventListener("click", event => {
    if (!event.target.closest(".dropdown-container")) {
        closeAllDropdowns();
    }
});