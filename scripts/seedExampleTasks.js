const baseURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app";

const tasks = [
  {
    status: "todo",
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
    subtasks: [{ done: true, subtask: "Setup Base Styles" }],
  },
  {
    status: "in-progress",
    title: "Implement Login Page",
    description: "Build and style the login page with form validation.",
    dueDate: "2025-05-10",
    priority: "high",
    assignedTo: [{ name: "Lea Becker", initials: "LB", color: "#C3FF2B" }],
    category: "User Story",
    subtasks: [
      { done: false, subtask: "Form Markup" },
      { done: true, subtask: "Basic Styling" },
      { done: false, subtask: "Validation Logic" },
    ],
  },
  {
    status: "awaiting-feedback",
    title: "Responsive Navigation Bar",
    description: "Implement and test a responsive navigation bar across all screen sizes.",
    dueDate: "2025-05-12",
    priority: "medium",
    assignedTo: [{ name: "Tom Fischer", initials: "TF", color: "#0085FF" }],
    category: "User Story",
    subtasks: [
      { done: true, subtask: "Mobile Navigation" },
      { done: true, subtask: "Tablet Navigation" },
      { done: true, subtask: "Desktop Navigation" },
      { done: false, subtask: "Bugfixes" },
    ],
  },
  {
    status: "done",
    title: "Set Up Project Repository",
    description: "Initialize the Git repository and set up branching strategy.",
    dueDate: "2025-04-30",
    priority: "low",
    assignedTo: [{ name: "Miriam Wagner", initials: "MW", color: "#FF5C5C" }],
    category: "Technical Task",
    subtasks: [
      { done: true, subtask: "Create Repo" },
      { done: true, subtask: "Define Branching Strategy" },
    ],
  },
  {
    status: "todo",
    title: "Design User Registration Flow",
    description: "Sketch and plan the user registration experience including error handling.",
    dueDate: "2025-05-15",
    priority: "high",
    assignedTo: [
      { name: "Bernd Zimmermann", initials: "BZ", color: "#1fd7c1" },
      { name: "Anna Sommer", initials: "AS", color: "#462f8a" },
    ],
    category: "User Story",
    subtasks: [
      { done: false, subtask: "Wireframe Signup Page" },
      { done: true, subtask: "Create Error States" },
    ],
  },
  {
    status: "in-progress",
    title: "Setup ESLint and Prettier",
    description: "Add and configure ESLint and Prettier for consistent code formatting.",
    dueDate: "2025-05-08",
    priority: "medium",
    assignedTo: [{ name: "Alex Müller", initials: "AM", color: "#ff7a00" }],
    category: "Technical Task",
    subtasks: [{ done: true, subtask: "Install Packages" }],
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
