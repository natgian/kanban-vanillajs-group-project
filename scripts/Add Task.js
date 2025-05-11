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

// Selectbars
function toggleDropdown(element) {
    const options = element.nextElementSibling;
    closeAllDropdowns(options);
    toggleVisibility(options);
}
  function selectOption(element) {
    const dropdown = element.closest(".dropdown-container").querySelector(".dropdown-selected");
    setSelectedValue(dropdown, element.textContent, element.dataset.value);
    toggleVisibility(element.parentElement, false);
}
function toggleVisibility(element, forceToggle = true) {
    if (element) {
      element.style.display = forceToggle 
        ? (element.style.display === "block" ? "none" : "block") 
        : "none";
    }
}
function closeAllDropdowns(exceptElement) {
    document.querySelectorAll(".dropdown-options").forEach(opt => {
      if (opt !== exceptElement) opt.style.display = "none";
    });
}
function setSelectedValue(dropdown, text, value) {
    if (dropdown) {
        dropdown.value = text;
        dropdown.dataset.value = value;
    }
}
document.addEventListener("click", function (event) {
    if (!event.target.closest(".dropdown-container")) {
      closeAllDropdowns();
    }
  });