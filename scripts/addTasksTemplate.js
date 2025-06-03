function renderAddTask() {
  return `
            <div class="contentWrapper">
            <h1>Add Task</h1>
            <div class="inputOrg">
              <form class="taskInfomations" id="myForm">
                <div class="spanGlue">
                  <span>Task<label>*</label></span>
                  <input
                    type="text"
                    class="typeBars resetTarget"
                    placeholder="Enter a title"
                    onblur="handleBlur(this)"
                    required
                  />
                  <span id="showUpRequired" style="display: none; position: absolute;">This field is required</span>
                </div>
                <div class="spanGlue">
                  <span>Description</span>
                  <textarea
                    name="description"
                    class="typeBars resetTarget"
                    placeholder="Enter a Discription"
                    style="height: 120px; padding: 14px 15px"
                  ></textarea>
                </div>
                <div class="spanGlue">
                  <span>Due date<label>*</label></span>
                  <input
                    type="date"
                    id="date-input"
                    class="typeBars resetTarget"
                    placeholder="dd/mm/yy"
                    oninput="checkValue()"
                    onblur="handleBlur(this)"
                    required
                  />
                  <span id="showUpRequired" style="display: none; position: absolute;">This field is required</span>
                </div>
              </form>
              <hr class="hrHider"/>
              <section class="taskCategorysation">
                <div class="spanGlue">
                  <span>Priority</span>
                  <div class="priorityArange" style="display: flex">
                    <button
                      class="priorityBtns"
                      data-color="#FF3D00"
                    >
                      Urgent
                      <img
                        src="../assets/icons/Prio alta.png"
                        style="width: 20px; height: 14.51px; margin-left: 10px"
                      />
                    </button>

                    <button
                      class="priorityBtns selected"
                      data-color="#FFA800"
                    >
                      Medium
                      <img
                        src="../assets/icons/Prio media.png"
                        style="width: 20px; height: 7.45px; margin-left: 10px"
                      />
                    </button>

                    <button
                      class="priorityBtns"
                      data-color="#7AE229"
                    >
                      Low
                      <img
                        src="../assets/icons/Prio baja.png"
                        style="width: 20px; height: 14.51px; margin-left: 10px"
                      />
                    </button>
                  </div>
                </div>
                <!-- Contact Dropdown -->
                <div class="spanGlue">
                    <span>Assigned to</span>
                    <div class="dropdown-container">
                        <input type="button" value="Select contacts to assign" class="dropdown-selected typeBars" id="contactDropdown" onclick="toggleContactDropdown(this)" />
                        <button id="toggleButtonDropdown" onclick="toggleContactDropdown(this)"><img src="../assets/icons/arrow_drop_downaa.png" alt="down"></button>
                        <div class="dropdown-options" id="contact-list">
                        
                        </div>
                    </div>
                    <div class="resetTarget" id="selectedContacts"></div>
                </div>

                <!-- Category Dropdown -->
                <div class="spanGlue">
                    <span>Category<label>*</label></span>
                    <div class="dropdown-container">
                        <input type="button" value="Select task category" class="dropdown-selected typeBars categoryDropdown" onclick="toggleCategoryDropdown(this)" required />
                        <button id="toggleButtonDropdown" onclick="toggleCategoryDropdown(this)"><img src="../assets/icons/arrow_drop_downaa.png" alt="down"></button>
                        <div class="dropdown-options">
                            <div class="option" data-value="Technical Task" onclick="selectCategoryOption(this)">Technical Task</div>
                            <div class="option" data-value="User Story" onclick="selectCategoryOption(this)">User Story</div>
                        </div>
                    </div>
                </div>
                <div class="spanGlue">
                  <span>Subtasks</span>
                  <div class="subtask-container">
                    <input
                      type="text"
                      class="typeBars typePriorityBars"
                      id="newSubtask"
                      placeholder="Add new subtask"
                    />
                    <div class="subtaskNavigator">
                      <img id="addSubtask" src="../assets/icons/Subtasks icons11.png" alt="cross" onclick=""/>
                      <div id="confirmDeleteNewSubtask">
                        <img src="../assets/icons/close.svg" alt="X" id="close" onclick="resetElements()"/>
                        <hr />
                        <img src="../assets/icons/check.png" alt="Check" id="confirm"onclick="addSubtask()"/>
                      </div>
                    </div>
                  </div>
                  <ul class="resetTarget" id="subtaskList">
                      <!-- Subtasks -->
                    </ul>
                </div>
              </section>
            </div>
            <div class="bottomButtons">
              <span><label>*</label>This field is required</span>
              <div class="bottomButtonsSplice">
                <button id="resetButton" class="bottomButton1" onclick="initReset()">
                  Clear<div class="x-icon"></div>
                </button>
                <button
                  class="bottomButton2"
                  id="submitBtn"
                  onclick="showMessage('New task created')"
                >
                  Creakte Task<img
                    src="../assets/icons/check.png"
                    alt="Check"
                  />
                </button>
              </div>
            </div>
          </div>
            `;
}

/**
 * Template for contacts.
 */
function addContactToTemplate(person) {
  if (!person || !person.name || !person.color || !person.initials) {
    return;
  }

  const contactList = document.getElementById("contact-list");
  if (!contactList) return;

  const template = `
    <div class="option" data-value="${person.name}" onclick="selectOption(this)">
      <div style=" display: flex; align-items: center; gap: 15px;">
        <div class="task-card-avatar" data-color="${person.color}" style="background-color: ${person.color}">${person.initials}</div>
        <span style="padding-bottom: 0;">${person.name}</span>
      </div>
      <label style="display: flex; cursor: pointer;">
        <input type="checkbox" class="hidden-checkbox" value="${person.name}" style="cursor: pointer; z-index: 5"/>
        <img src="../assets/icons/checkbox_icon.svg" class="unchecked" style="pointer-events: auto; cursor: pointer;"/>
        <img src="../assets/icons/checkbox_checked_icon.svg" class="checked" style="pointer-events: auto; cursor: pointer;"/>
      </label>
    </div>
  `;

  contactList.insertAdjacentHTML("beforeend", template);
}

// Creates the Subtask-Templete-Structure for a new subtask.
function createSubtaskElement(text) {
  const listItem = document.createElement("li");
  listItem.className = "dot";
  listItem.id = "subtaskListElement";
  listItem.onclick = () => toggleEditMode(listItem);

  listItem.innerHTML = `
        <span id="editableText" class="subtask-text">${text}</span>
        <div id="editDelate">
            <img src="../assets/icons/editPen.svg" alt="Pen" onclick="toggleEditMode(this)">
            <hr>
            <img src="../assets/icons/deleteBin.svg" alt="Bin" onclick="deleteSubtask(this)">
        </div>
        <div id="deleteChange" style="display: none;">
            <img src="../assets/icons/deleteBin.svg" alt="Bin" onclick="deleteSubtask(this)">
            <hr>
            <img src="../assets/icons/checkBlack.svg" alt="Check" onclick="saveAndExitEditMode(this)">
        </div>
    `;

  return listItem;
}
