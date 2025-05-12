const databasURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Lädt den Summary-Bereich und aktualisiert ihn mit Daten aus Firebase
 */
async function loadSummary() {
  const contentContainer = document.getElementById('templateContent');
  contentContainer.innerHTML = summaryTemplate();

  const tasks = await loadTasksFromFirebase();
  updateSummary(tasks);
}

/**
 * Lädt alle Tasks aus Firebase
 * Gibt ein Array von Aufgaben zurück
 */
async function loadTasksFromFirebase() {
  try {
    const response = await fetch(`${databasURL}tasks.json`);
    if (!response.ok) throw new Error("Fehler beim Laden der Daten");

    const data = await response.json();

    // Firebase gibt ein Objekt zurück – wir wandeln es in ein Array um
    const tasks = data ? Object.values(data) : [];
    return tasks;
  } catch (error) {
    console.error("Fehler beim Laden der Tasks aus Firebase:", error);
    return [];
  }
}



function updateSummary(tasks) {
  document.getElementById('toDoNumber').textContent = countByStatus(tasks, 'to-do');
  document.getElementById('doneNumber').textContent = countByStatus(tasks, 'done');
  document.getElementById('urgentNumber').textContent = countByPriority(tasks, 'high');
  document.getElementById('date').textContent = getNextUpcomingDate(tasks);
  document.getElementById('amountTasksNumber').textContent = tasks.length;
  document.getElementById('progressNumber').textContent = countByStatus(tasks, 'in-progress');
  document.getElementById('awaitFeedbackNumber').textContent = countByStatus(tasks, 'awaiting-feedback');
}

function countByStatus(tasks, status) {
  return tasks.filter(task => task.status === status).length;
}

function countByPriority(tasks, priority) {
  return tasks.filter(task => task.priority === priority).length;
}

function getNextUpcomingDate(tasks) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingDates = tasks
    .map(task => new Date(task.dueDate))
    .filter(date => !isNaN(date) && date >= today)
    .sort((a, b) => a - b);

  const next = upcomingDates[0];

  return next
    ? next.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'No upcoming date';
}