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
          <div class="task-card" id="card${task.taskId}" onclick="openTaskOverlay('${task.taskId}')" draggable="true" ondragstart="startDragging('${task.taskId}')" ondragend="endDragging()">
            <div class="category-icon-container">
              <span class="task-category ${task.category === "Technical Task" ? "technical" : "userstory"}-category">${task.category}</span>
              <button class="icon-btn" onclick="openMoveToMenu(event, '${task.taskId}', '${task.status}')">
                <svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.75" y="25.25" width="24.5" height="22.5" rx="5.25" transform="rotate(-90 0.75 25.25)" stroke="#2A3647" stroke-width="1.5" />
                <mask id="mask0_294678_9869" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="2" y="3" width="20" height="20">
                <rect x="2" y="23" width="20" height="20" transform="rotate(-90 2 23)" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_294678_9869)">
                <path
                d="M15.3333 18.1457L16.8958 16.5832C17.0486 16.4304 17.2396 16.354 17.4688 16.354C17.6979 16.354 17.8958 16.4304 18.0625 16.5832C18.2292 16.7498 18.3125 16.9478 18.3125 17.1769C18.3125 17.4061 18.2292 17.604 18.0625 17.7707L15.0833 20.7498C15 20.8332 14.9097 20.8922 14.8125 20.9269C14.7153 20.9616 14.6111 20.979 14.5 20.979C14.3889 20.979 14.2847 20.9616 14.1875 20.9269C14.0903 20.8922 14 20.8332 13.9167 20.7498L10.9167 17.7498C10.75 17.5832 10.6701 17.3887 10.6771 17.1665C10.684 16.9443 10.7708 16.7498 10.9375 16.5832C11.1042 16.4304 11.2986 16.3505 11.5208 16.3436C11.7431 16.3366 11.9375 16.4165 12.1042 16.5832L13.6667 18.1457V12.9998C13.6667 12.7637 13.7465 12.5658 13.9062 12.4061C14.066 12.2464 14.2639 12.1665 14.5 12.1665C14.7361 12.1665 14.934 12.2464 15.0938 12.4061C15.2535 12.5658 15.3333 12.7637 15.3333 12.9998V18.1457ZM10.3333 7.854V12.9998C10.3333 13.2359 10.2535 13.4339 10.0938 13.5936C9.93403 13.7533 9.73611 13.8332 9.5 13.8332C9.26389 13.8332 9.06597 13.7533 8.90625 13.5936C8.74653 13.4339 8.66667 13.2359 8.66667 12.9998V7.854L7.10417 9.4165C6.95139 9.56928 6.76042 9.64567 6.53125 9.64567C6.30208 9.64567 6.10417 9.56928 5.9375 9.4165C5.77083 9.24984 5.6875 9.05192 5.6875 8.82275C5.6875 8.59359 5.77083 8.39567 5.9375 8.229L8.91667 5.24984C9 5.1665 9.09028 5.10748 9.1875 5.07275C9.28472 5.03803 9.38889 5.02067 9.5 5.02067C9.61111 5.02067 9.71528 5.03803 9.8125 5.07275C9.90972 5.10748 10 5.1665 10.0833 5.24984L13.0833 8.24984C13.25 8.4165 13.3299 8.61095 13.3229 8.83317C13.316 9.05539 13.2292 9.24984 13.0625 9.4165C12.8958 9.56928 12.7014 9.64914 12.4792 9.65609C12.2569 9.66303 12.0625 9.58317 11.8958 9.4165L10.3333 7.854Z"
                fill="#2A3647"/>
                </g>
                </svg>
                <!-- Move-To-Menu -->
                <div role="menu" class="menu move-to-menu hide" id="move-to-menu${task.taskId}">
                  <span>Move to</span>
                  <ul>
                    <li onclick="moveToByClick('${task.taskId}', 'to-do')">
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="20px"           fill="currentColor">
                        <path d="M647-520H160v80h487L423-216l57 56 320-320-320-320-57 56 224 224Z" />
                      </svg>
                      To do
                    </li>
                    <li onclick="moveToByClick('${task.taskId}', 'in-progress')">
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="20px"           fill="currentColor">
                        <path d="M647-520H160v80h487L423-216l57 56 320-320-320-320-57 56 224 224Z" />
                      </svg>
                      In progress
                    </li>
                    <li onclick="moveToByClick('${task.taskId}', 'awaiting-feedback')">
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="20px"           fill="currentColor">
                        <path d="M647-520H160v80h487L423-216l57 56 320-320-320-320-57 56 224 224Z" />
                      </svg>
                      Awaiting feedback
                    </li>
                    <li onclick="moveToByClick('${task.taskId}', 'done')">
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="20px"           fill="currentColor">
                        <path d="M647-520H160v80h487L423-216l57 56 320-320-320-320-57 56 224 224Z" />
                      </svg>
                      Done
                    </li>
                  </ul>
                </div>
              </button>
            </div>
            
            <div>
              <h3 class="task-card-title">${task.title}</h3>
              <p class="task-card-description">${task.description ? task.description : ""}</p>
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
                <span class="plus-counter">${task.assignedTo?.length > 5 ? `+${task.assignedTo.length - 5}` : ""}
                </span>
              </div>
              <div class="task-card-priority">
                <img src="../assets/icons/${task.priority}_priority_icon.svg" alt="prioriicon" />
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
  return `<div class="no-task">No tasks ${containerId.split("-").join(" ")}</div>`;
}

/**
 * Returns the HTML template for a task overlay including all task details
 *
 * @param {Object} task - The task object containing the task details
 * @param {string} assignedToDetailHTML - The HTML for the assigned users display
 * @param {string} subtasksHTML - The HTML for the subtasks display
 * @returns - The HTML for rendering the task card overelay
 */
function taskOverlayTemplate(task, assignedToDetailHTML, subtasksHTML, formattedDueDate) {
  return `
    <div class="category-icon-container">
      <span class="task-category ${task.category === "Technical Task" ? "technical" : "userstory"}-category">${task.category}</span>
      <button class="close-btn" onclick="closeOverlay(taskOverlayRef)">
          <img src="../assets/icons/close_icon.svg" alt="close icon"/>
      </button>
    </div>

    <div class="task-overlay-content-wrapper">
      <div class="space-between">
        <div class="task-overlay-info-wrapper">
          <p class="task-overlay-title">${task.title}</p>
          <p class="task-overlay-description">${task.description ? task.description : ""}</p>

          <div class="task-overlay-data-wrapper">
          <span class="task-overlay-label">Due date:</span>
          <span>${formattedDueDate}</span>
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
      <button class="action-btn" onclick="renderEditTaskTemplate('${task.taskId}', event)">
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
        </div>
      </div>
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

/**
 * Returns the HTML template for the task edit overlay
 *
 * This template includes editable fields such as title, description, due date,
 * priority, assigned contacts, and subtasks. It also includes logic to prefill
 * form inputs based on the given task object and prevents selection of past dates.
 *
 * @param {Object} task - The task object containing task data
 * @param {string} formattedDueDate - The due date formatted as YYYY-MM-DD for the input field
 * @param {string} today - Today's date formatted as YYYY-MM-DD to set as the minimum allowed date
 *
 * @returns {string} - A string containing the full HTML template for the edit task overlay
 */
function taskOverlayEditTaskTemplate(task, formattedDueDate, today) {
  return `
          <div class="flex-end">
            <button class="close-btn" onclick="closeOverlay(taskOverlayRef)">
                <img src="../assets/icons/close_icon.svg" alt="close icon"/>
            </button>
          </div>

          <div class="task-overlay-content-wrapper">
     
            <div class="wrapper" id="edit-task-wrapper">
              <!-- Title -->
              <div class="spanGlue">
                <label for="edit-title-input" class="edit-task-label">Title</label>
                <input type="text" name="title" id="edit-title-input" class="typeBars" placeholder="Enter a title" required value="${task.title}" onfocus="this.select()" onblur="handleBlur(this)"/>
                <span id="showUpRequired" style="display: none; position: absolute;">This field is required</span>
              </div>

              <!-- Description -->
              <div class="spanGlue mt-20">
                <label for="edit-desc-textarea" class="edit-task-label">Description</label>
                <textarea name="description" id="edit-desc-textarea" class="typeBars" placeholder="Enter a description" onfocus="this.select()" style="height: 120px; padding: 14px 15px">${
                  task.description ? task.description : ""
                }</textarea>
              </div>

              <!-- Due Date -->
              <div class="spanGlue mt-20">
                <label for="date-input" class="edit-task-label">Due date</label>
                <input type="date" id="date-input" name="date" class="typeBars filled" value="${formattedDueDate}" oninput="checkValue()" required onblur="handleBlur(this)" min="${today}" />
                <span id="showUpRequired" style="display: none; position: absolute;">This field is required</span>
              </div>

              <!-- Priority -->
              <div class="spanGlue mt-20">
                <span class="edit-task-label">Priority</span>
                <div class="priority-wrapper">
                  <label class="priority-option" for="urgent" tabindex="0">
                    <input type="radio" name="priority" id="urgent" value="high" ${task.priority === "high" ? "checked" : ""}/>
                    <span class="priority-btn">
                    Urgent
                    <img src="../assets/icons/high_priority_icon.svg" alt="high priority" />
                    </span>
                  </label>

                  <label class="priority-option" for="medium" tabindex="0">
                    <input type="radio" name="priority" id="medium" value="medium" ${task.priority === "medium" ? "checked" : ""} />
                    <span class="priority-btn">
                    Medium
                    <img src="../assets/icons/medium_priority_icon.svg" alt="medium priority" />
                    </span>
                  </label>

                  <label class="priority-option" for="low" tabindex="0">
                    <input type="radio" name="priority" id="low" value="low" ${task.priority === "low" ? "checked" : ""}/>
                    <span class="priority-btn">
                    Low
                    <img src="../assets/icons/low_priority_icon.svg" alt="low priority" />
                    </span>
                    </label>
                </div>
              </div>

              <!-- Assigned to -->
              <div class="spanGlue mt-20">
                <label class="edit-task-label">Assigned to</label>
                <div class="dropdown-container">
                  <input type="button" value="Select contacts to assign" class="dropdown-selected typeBars" id="contactDropdown" onclick="toggleContactDropdown(this)" />
                  <button id="toggleButtonDropdown" onclick="toggleContactDropdown(this)">
                    <img src="../assets/icons/arrow_drop_downaa.png" alt="down">
                  </button>
                  <div class="dropdown-options" id="contact-list"></div>
                </div>
                <div class="resetTarget" id="selectedContacts"></div>
              </div>

              <!-- Subtasks -->
              <div class="spanGlue mt-20">
                <label for="newEditSubtask" class="edit-task-label">Subtasks</label>
                <div class="subtask-container">
                  <input type="text" class="typeBars typePriorityBars" id="newEditSubtask" placeholder="Add new subtask" />
                  <div class="subtaskNavigator">
                    <img id="addSubtask" src="../assets/icons/addIconSubtask.svg" alt="cross" onclick="showConfirmDelete(event)" />
                    <div id="confirmDeleteNewSubtask">
                      <img src="../assets/icons/closeAddSubtask.svg" alt="X" id="close" onclick="resetElements()" />
                      <hr />
                      <img src="../assets/icons/checkNewSubtask.svg" alt="Check" id="confirm" onclick="addSubtaskOnEdit()" />
                    </div>
                  </div>
                </div>
                <ul id="subtaskList"></ul>
              </div>

            </div>
         </div>

         <div class="flex-end">
            <button class="btn" id="edit-submit-btn" onclick="updateTask('${task.taskId}')">Ok <img src="../assets/icons/check_icon.svg" alt="check icon"/></button>
         </div>     
  `;
}
