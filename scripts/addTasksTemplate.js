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
                    class="typeBars"
                    placeholder="Enter a title"
                    required
                  />
                </div>
                <div class="spanGlue">
                  <span>Description</span>
                  <textarea
                    name="description"
                    class="typeBars"
                    placeholder="Enter a Discription"
                    style="height: 120px; padding: 14px 15px"
                  ></textarea>
                </div>
                <div class="spanGlue">
                  <span>Due date<label>*</label></span>
                  <input
                    type="date"
                    id="date-input"
                    class="typeBars"
                    placeholder="dd/mm/yy"
                    oninput="checkValue()"
                    required
                  />
                </div>
              </form>
              <hr />
              <section class="taskCategorysation">
                <div class="spanGlue">
                  <span>Priority</span>
                  <div class="priorityArange" style="display: flex">
                    <button
                      class="priorityBtns"
                      data-color="#FF3D00"
                      onclick="selectButton(this)"
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
                      onclick="selectButton(this)"
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
                      onclick="selectButton(this)"
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
                        <div class="dropdown-options">
                            <div class="option" data-value="Contact 1" onclick="selectContactOption(this)">Contact 1</div>
                            <div class="option" data-value="Contact 2" onclick="selectContactOption(this)">Contact 2</div>
                            <div class="option" data-value="Contact 3" onclick="selectContactOption(this)">Contact 3</div>
                            <div class="option" data-value="Contact 4" onclick="selectContactOption(this)">Contact 4</div>
                        </div>
                    </div>
                    <div id="selectedContacts"></div>
                </div>

                <!-- Category Dropdown -->
                <div class="spanGlue">
                    <span>Category<label>*</label></span>
                    <div class="dropdown-container">
                        <input type="button" value="Select task category" class="dropdown-selected typeBars categoryDropdown" onclick="toggleCategoryDropdown(this)" required />
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
                      placeholder="Add new subtask"
                    />
                    <img
                      src="../assets/icons/Subtasks icons11.png"
                      alt="cross"
                    />
                  </div>
                </div>
              </section>
            </div>
            <div class="bottomButtons">
              <span><label>*</label>This field is required</span>
              <div class="bottomButtonsSplice">
                <button class="bottomButton1" onclick="location.reload()">
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
document.getElementById("contentload").innerHTML = renderAddTask();

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