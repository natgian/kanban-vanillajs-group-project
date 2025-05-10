/**
 * Returns the HTML template for a task card including category, title, description, subtasks progress, assigned users and priority
 *
 * @param {Object} task - The task object containing the task details
 * @param {number} subtasksTotal - Total number of subtasks
 * @param {number} subtasksDone - Total number of tasks marked as 'done'
 * @param {number} progressPercent - Percentage for the progress bar
 * @param {string} assignedToHTML - The HTML for the avatar elements for assigned users
 * @returns - the full HTML for rendering the task card
 */
function cardTemplate(task, subtasksTotal, subtasksDone, progressPercent, assignedToHTML) {
  return `
          <div class="task-card" onclick="openTaskDetails('${task.taskId}')">
            <span class="task-category ${task.category === "Technical Task" ? "technical" : "userstory"}-category">${task.category}</span>
                  <div>
                    <h3 class="task-card-title">${task.title}</h3>
                    <p class="task-card-description">${task.description}</p>
                  </div>
                  <div class="subtasks-container" id="subtasks-container-${task.taskId}">
                  ${
                    subtasksTotal > 0
                      ? `
                        <div class="progress-bar">
                          <div class="progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                        <p>${subtasksDone}/${subtasksTotal} Subtask${subtasksTotal > 1 ? "s" : ""}</p>
                        `
                      : ""
                  }
                  </div>
                  <div class="assignedto-priority-container">
                    <div class="task-card-assignedto-container">
                      ${assignedToHTML}
                    </div>
                    <div class="task-card-priority">
                      <img src="../assets/icons/${task.priority}_priority_icon.svg" alt="priority icon" />
                    </div>
                  </div>
          </div>
    `;
}

/**
 * Returns the placeholder HTML for board columns with no current tasks
 *
 * @param {string} containerId - The ID for the container element
 * @returns - HTML template for empty columns with no tasks
 */
function noTasksTemplate(containerId) {
  return `<div class="no-task">No tasks ${containerId}</div>`;
}

/**
 * Returns the HTML template for a task overlay including all task details
 *
 * @param {Object} task - The task object containing the task details
 * @param {string} assignedToDetailHTML - The HTML for the assigned users display
 * @param {string} subtasksHTML - The HTML for the subtasks display
 * @returns - The HTML for rendering the task card overelay
 */
function taskOverlayTemplate(task, assignedToDetailHTML, subtasksHTML) {
  return `
          <div class="category-closeIcon-container">
            <span class="task-category ${task.category === "Technical Task" ? "technical" : "userstory"}-category">${task.category}</span>
            <button class="close-btn">
                <img src="../assets/icons/close_icon.svg" alt="close icon" onclick="closeTaskDetails()" />
            </button>
          </div>

          <div class="task-overlay-content-wrapper">
          <p class="task-overlay-title">${task.title}</p>
          <p class="task-overlay-description">${task.description}</p>

          <div class="task-overlay-data-wrapper">
            <span class="task-overlay-label">Due date:</span>
            <span>${task.dueDate}</span>
          </div>

          <div class="task-overlay-data-wrapper">
            <span class="task-overlay-label">Priority:</span>
                <span class="task-overlay-data-wrapper">${task.priority} <img src="../assets/icons/${task.priority}_priority_icon.svg" alt="priority icon" /></span>
          </div>

          <!-- Assigned to -->
          <div>
            <span class="task-overlay-label">Assigned to:</span>
              <ul class="mt-8">${assignedToDetailHTML}</ul>
          </div>

          <!-- Subtasks -->
          <div>
            <span class="task-overlay-label">Subtasks</span>
            <ul class="task-overlay-subtasks-container mt-8">${subtasksHTML}</ul>                 
          </div>

          <!-- Action Buttons -->
              <div class="action-btn-wrapper">

                <!-- Delete Button -->
                <button class="action-btn" onclick="deleteTask('${task.taskId}')">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_314602_7552" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                      <rect width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_314602_7552)">
                      <path
                        d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z"
                        fill="currentColor"
                      />
                    </g>
                  </svg>
                  Delete
                </button>

                <div class="action-btn-separator"></div>

                <!-- Edit Button -->
                <button class="action-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_314602_7558" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                      <rect width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_314602_7558)">
                      <path
                        d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z"
                        fill="currentColor"
                      />
                    </g>
                  </svg>
                  Edit
                </button>
              </div
            </div>  
  `;
}

/**
 * Returns the HTML template for a subtask item with a checkbox and label
 *
 * @param {Object} subtask - The subtask object containing the subtask and completion status
 * @param {number} index - The index of the subtask, used to create a unique ID for the checkbox
 * @returns - The HTML for rendering the subtask list item
 */
function subtasksTemplate(subtask, index, task) {
  if (!subtask) return "";
  return `
          <li class="task-overlay-subtask-wrapper">
            <input type="checkbox" name="checkbox" id="subtask-${index}" class="custom-checkbox" ${subtask.done ? "checked" : ""}/>
            <label for="subtask-${index}" class="checkbox-label" onclick="updateSubtaskCompletion('${index}', '${task.taskId}')">

              <!-- Unchecked SVG -->
              <svg class="svg-unchecked" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4.96582" width="16" height="16" rx="3" stroke="currentColor" stroke-width="2" />
              </svg>

              <!-- Checked SVG -->
              <svg class="svg-checked" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
              d="M20 11.9658V17.9658C20 19.6227 18.6569 20.9658 17 20.9658H7C5.34315 20.9658 4 19.6227 4 17.9658V7.96582C4 6.30897 5.34315 4.96582 7 4.96582H15"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              />
              <path d="M8 12.9658L12 16.9658L20 5.46582" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <span>${subtask.subtask}</span>
            </label>
          </li>  
  `;
}

/**
 * Returns the HTML template for a list item for the 'assigned to' user
 *
 * @param {Object} person - The person object containing the persons data assigned to the task
 * @returns - The HTML for rendering the assigned person with the avatar and name
 */
function assignedToDetailTemplate(person) {
  return `
          <li class="task-overlay-avatar-wrapper">
            <div class="task-card-avatar" style="background-color: ${person.color}">${person.initials}</div>
            ${person.name}
          </li>`;
}
