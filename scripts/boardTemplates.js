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
                  <div class="subtasks-container">
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <p>${subtasksDone}/${subtasksTotal} Subtask${subtasksTotal > 1 ? "s" : ""}</p>
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
