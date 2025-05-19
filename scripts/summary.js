const databasURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app/";

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
