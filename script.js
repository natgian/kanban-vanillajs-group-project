// Add Task-Test:
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