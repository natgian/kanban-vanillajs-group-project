// RenderAddTask
// function renderAddTask() {
//     return  `
//             // Add Task-Content
//             `;
// }
// document.getElementById("#").innerHTML = renderAddTask();

function checkValue() {
    let input = document.getElementById("date-input");
    if (input.value) {
        input.classList.add("filled");
    } else {
        input.classList.remove("filled");
    }
}

function toggleDropdown(id) {
    document.querySelectorAll('.dropdown-list').forEach(dropdown => {
        if (dropdown.id === id) {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        } else {
            dropdown.style.display = 'none';
        }
    });
}
function selectOption(spanId, value) {
    document.getElementById(spanId).textContent = value;
    document.querySelectorAll('.dropdown-list').forEach(dropdown => {
        dropdown.style.display = 'none';
    });
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
    button.style.backgroundColor = "#ffa800"; 
    button.style.color = "white";
    button.style.fontWeight = "bold";
}

// submitbutton enabled
function checkFields() {
    const form = document.getElementById("myForm");
    const submitBtn = document.getElementById("submitBtn");

    // Überprüft, ob alle input- und textarea-Felder ausgefüllt sind
    const allFilled = [...form.elements]
        .filter(el => el.tagName === "INPUT" || el.tagName === "TEXTAREA")
        .every(field => field.value.trim() !== "");

    submitBtn.disabled = !allFilled;
    submitBtn.classList.toggle("enabled", allFilled);
}

// Überprüfung bei jeder Eingabe
document.addEventListener("DOMContentLoaded", function() {
    checkFields(); 
});

document.getElementById("myForm").addEventListener("input", checkFields);


document.getElementById("submitBtn").addEventListener("click", function(event) {
    let selectedCategory = document.querySelector(".typeBars.typePriorityBars span").textContent;
    if (selectedCategory === "select task category") {
      alert("Bitte wähle eine Kategorie aus.");
      event.preventDefault();
    }
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
      dropdown.textContent = text;
      dropdown.dataset.value = value;
    }
}
document.addEventListener("click", function (event) {
    if (!event.target.closest(".dropdown-container")) {
      closeAllDropdowns();
    }
  });