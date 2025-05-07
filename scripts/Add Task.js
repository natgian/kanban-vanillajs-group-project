// RenderAddTask
function renderAddTask() {
    return  `
            // Add Task-Content
            `;
}
document.getElementById("#").innerHTML = renderAddTask();

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