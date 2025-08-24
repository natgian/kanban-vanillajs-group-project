const databasURL = "https://kanban-vanillajs-group-project-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Loads the summary template into the main content area,
 * fetches tasks from Firebase, updates the summary display,
 * and sets the logged-in user's name.
 *
 * @returns {Promise<void>} A Promise that resolves once the template,
 * task data, and user name have been fully loaded and rendered.
 */
async function loadSummary() {
  const contentContainer = document.getElementById("templateContent");
  contentContainer.innerHTML = summaryTemplate();
  const tasks = await loadTasksFromFirebase();
  updateSummary(tasks);
  const userName = localStorage.getItem("currentUser") || "Guest";
  document.getElementById("userName").textContent = userName;
}

/**
 * Loads the tasks from Firebase and returns them as an array.
 * If the data cannot be fetched or is invalid, an empty array is returned.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of task objects.
 *   Each task object contains the task data retrieved from Firebase.
 */
async function loadTasksFromFirebase() {
  try {
    const response = await fetch(`${databasURL}tasks.json`);
    if (!response.ok) throw new Error("Fehler beim Laden der Daten");
    const data = await response.json();
    const tasks = data ? Object.values(data) : [];
    return tasks;
  } catch (error) {
    console.error("Fehler beim Laden der Tasks aus Firebase:", error);
    return [];
  }
}

/**
 * Updates the task summary on the page based on the provided tasks.
 * It updates various elements like the number of tasks in different statuses (e.g., to-do, done, in-progress)
 * and the total number of tasks. Also updates the upcoming date.
 *
 * @param {Array<Object>} tasks - An array of task objects. Each task should contain data that
 *   includes status (e.g., 'to-do', 'done', etc.), priority, and other relevant information.
 */
function updateSummary(tasks) {
  document.getElementById("toDoNumber").textContent = countByStatus(tasks, "to-do");
  document.getElementById("doneNumber").textContent = countByStatus(tasks, "done");
  document.getElementById("urgentNumber").textContent = countByPriority(tasks, "high");
  document.getElementById("date").textContent = getNextUpcomingDate(tasks);
  document.getElementById("amountTasksNumber").textContent = tasks.length;
  document.getElementById("progressNumber").textContent = countByStatus(tasks, "in-progress");
  document.getElementById("awaitFeedbackNumber").textContent = countByStatus(tasks, "awaiting-feedback");
}

/**
 * Counts the number of tasks that match a specific status.
 *
 * @param {Array<Object>} tasks - An array of task objects. Each task should contain a `status` property.
 * @param {string} status - The status to filter tasks by (e.g., 'to-do', 'done', 'in-progress').
 * @returns {number} The number of tasks that have the specified status.
 */
function countByStatus(tasks, status) {
  return tasks.filter((task) => task.status === status).length;
}

/**
 * Counts the number of tasks that match a specific priority.
 *
 * @param {Array<Object>} tasks - An array of task objects. Each task should contain a `priority` property.
 * @param {string} priority - The priority to filter tasks by (e.g., 'high', 'medium', 'low').
 * @returns {number} The number of tasks that have the specified priority.
 */
function countByPriority(tasks, priority) {
  return tasks.filter((task) => task.priority === priority).length;
}

/**
 * Gets the next upcoming due date from a list of tasks.
 *
 * @param {Array<Object>} tasks - An array of task objects, where each task contains a `dueDate` property.
 * @returns {string} The next upcoming due date formatted as 'Month Day, Year' (e.g., 'May 12, 2025'), or 'No upcoming date' if there are no upcoming dates.
 */
function getNextUpcomingDate(tasks) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingDates = tasks
    .map((task) => new Date(task.dueDate))
    .filter((date) => !isNaN(date) && date >= today)
    .sort((a, b) => a - b);
  const next = upcomingDates[0];
  return next ? next.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "No upcoming date";
}

function linkToBoard() {
  window.location.href = "../pages/board.html";
}

/**
 * Toggles visibility of user or guest greeting sections
 * based on the current user's name stored in localStorage.
 */
function toggleGreetingSections() {
  const currentUser = localStorage.getItem("currentUser");
  const isGuest = !currentUser || currentUser === "Guest";

  const userSection = document.querySelector(".greetingUser");
  const guestSection = document.querySelector(".greetingGuest");

  if (isGuest) {
    if (userSection) userSection.style.display = "none";
    if (guestSection) guestSection.style.display = "block";
  } else {
    if (userSection) userSection.style.display = "block";
    if (guestSection) guestSection.style.display = "none";
  }
}

/**
 * Returns a greeting based on the current time of day.
 *
 * @returns {string} One of "morning", "afternoon", "evening", or "night"
 */
function getDaytimeGreeting() {
  const currentHour = new Date().getHours();
  let greeting;

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "afternoon";
  } else if (currentHour >= 17 && currentHour < 22) {
    greeting = "evening";
  } else {
    greeting = "night";
  }

  return greeting;
}

const daytime = getDaytimeGreeting();

// Insert the greeting into the HTML for both user and guest
document.querySelector("#salutationUser #dayTime").textContent = daytime;
document.querySelector("#salutationGuest #dayTime").textContent = daytime;

/**
 * Retrieves the current user's name from local storage.
 * If the user is "Guest", returns "Guest".
 * If a real user is stored, returns the trimmed full name.
 *
 * @returns {string} The username or guest label
 */
function getCurrentUserName() {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return "";

  if (currentUser === "Guest") {
    return "Guest";
  }

  return currentUser.trim();
}

const userName = getCurrentUserName();

// Insert the username into the greeting section
document.querySelector(".greetingUser h2").textContent = userName;

toggleGreetingSections();

/**
 * Applies the greeting modal logic on first load and delegates
 * hiding behavior. Only acts if the modal exists.
 *
 * @param {number} delay - Time in ms before hiding the modal
 */
function handleGreetingModal(delay = 4000) {
  const modal = document.querySelector("#greetingModal");
  if (!modal) return;

  const hasSeen = localStorage.getItem("hasSeenGreetingModal");
  if (!hasSeen) {
    modal.classList.remove("fade-out", "hiddenInstantly");
    scheduleFadeOut(modal, delay);
  } else {
    modal.classList.add("hiddenInstantly");
  }
}

/**
 * Adds fade-out effect, then hides modal and marks it as shown.
 *
 * @param {HTMLElement} modal - The greeting modal element
 * @param {number} delay - Delay before hiding in milliseconds
 */
function scheduleFadeOut(modal, delay) {
  setTimeout(() => {
    modal.classList.add("fade-out");
    setTimeout(() => {
      modal.classList.remove("fade-out");
      modal.classList.add("hiddenInstantly");
      localStorage.setItem("hasSeenGreetingModal", "true");
    }, 500);
  }, delay);
}

/**
 * Transfers the current user's name from the greeting modal
 * to the corresponding h2 element in the right section of the template.
 *
 * This function looks for the username inside the '#greetingModal' element,
 * and updates the content of the '.rightSection' accordingly, if both elements are found.
 */
function transferUserName() {
  const modalUserNameElement = document.querySelector("#greetingModal .greetingUser h2");
  const modalUserName = modalUserNameElement ? modalUserNameElement.textContent : "";

  const rightSectionUserNameElement = document.querySelector(".rightSection .greetingUser h2");
  if (rightSectionUserNameElement && modalUserName) {
    rightSectionUserNameElement.textContent = modalUserName;
  }
}
