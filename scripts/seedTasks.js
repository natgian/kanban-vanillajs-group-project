const baseURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app";

const tasks = [
  {
    boardColumn: "todo",
    title: "HTML Base Template Creation",
    description: "Create reusable HTML base templates that can be used in different parts of the project.",
    dueDate: "2025-05-05",
    priority: "low",
    assignedTo: [
      { name: "Alex Müller", initials: "AM", color: "#ff7a00" },
      { name: "Bernd Zimmermann", initials: "BZ", color: "#1fd7c1" },
      { name: "Anna Sommer", initials: "AS", color: "#462f8a" },
    ],
    category: "Technical Task",
    subtasks: [
      { done: true, subtask: "Setup Base Styles" },
      { done: false, subtask: "Create HTML Template" },
    ],
  },
  {
    boardColumn: "in-progress",
    title: "Implement Login Page",
    description: "Build and style the login page with form validation.",
    dueDate: "2025-05-10",
    priority: "high",
    assignedTo: [{ name: "Lea Becker", initials: "LB", color: "#C3FF2B" }],
    category: "User Story",
    subtasks: [
      { done: false, subtask: "Form Markup" },
      { done: false, subtask: "Validation Logic" },
    ],
  },
];

async function seedTasks() {
  for (const task of tasks) {
    try {
      const response = await fetch(`${baseURL}/tasks.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      const postData = await response.json();
      const taskId = postData.name; // weist nach dem Zufügen des Tasks die von Firebase kreierte ID der taskId hinzu

      await fetch(`${baseURL}/tasks/${taskId}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: taskId }),
      });
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  }
}

seedTasks();
