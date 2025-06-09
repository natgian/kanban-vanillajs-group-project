const baseURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app";

const tasks = [
  {
    status: "done",
    title: "HTML Base Template Creation",
    description: "Create reusable HTML base templates that will serve as the foundation for other pages in the project.",
    dueDate: "2025-07-05",
    priority: "low",
    assignedTo: [{ name: "Anna Schmitt", initials: "AS", color: "#FF7A00" }],
    category: "Technical Task",
    subtasks: [{ done: true, subtask: "Setup Base Styles" }],
  },
  {
    status: "in-progress",
    title: "Implement Login Page",
    description: "Build and style the login page, adding form validation for login credentials.",
    dueDate: "2025-07-10",
    priority: "high",
    assignedTo: [{ name: "David Schwarz", initials: "DS", color: "#9327FF" }],
    category: "User Story",
    subtasks: [
      { done: true, subtask: "Form Markup" },
      { done: false, subtask: "Basic Styling" },
      { done: false, subtask: "Validation Logic" },
    ],
  },
  {
    status: "awaiting-feedback",
    title: "Responsive Navigation Bar",
    description: "Implement a navigation bar that adjusts responsively for mobile, tablet, and desktop views.",
    dueDate: "2025-07-12",
    priority: "medium",
    assignedTo: [
      { name: "Emily Hartmann", initials: "EH", color: "#00BEE8" },
      { name: "Benno Meier", initials: "BM", color: "#FF5EB3" },
    ],
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
    description: "Initialize a Git repository and establish a clear branching strategy for team collaboration.",
    dueDate: "2025-06-30",
    priority: "low",
    assignedTo: [{ name: "Fabian Klein", initials: "FK", color: "#1FD7C1" }],
    category: "Technical Task",
    subtasks: [
      { done: true, subtask: "Create Repo" },
      { done: true, subtask: "Define Branching Strategy" },
    ],
  },
  {
    status: "to-do",
    title: "Design User Registration Flow",
    description: "Design the user flow for registration, including account creation and error handling.",
    dueDate: "2025-06-15",
    priority: "high",
    assignedTo: [
      { name: "Greta Völker", initials: "GV", color: "#FF745E" },
      { name: "Hannes Zimmer", initials: "HZ", color: "#FFA35E" },
    ],
    category: "User Story",
    subtasks: [
      { done: false, subtask: "Wireframe Signup Page" },
      { done: false, subtask: "Create Error States" },
    ],
  },
  {
    status: "in-progress",
    title: "Setup ESLint and Prettier",
    description: "Configure ESLint and Prettier to ensure consistent code formatting across the team.",
    dueDate: "2025-07-08",
    priority: "medium",
    assignedTo: [{ name: "Isabel Kranz", initials: "IK", color: "#FC71FF" }],
    category: "Technical Task",
    subtasks: [{ done: false, subtask: "Install Packages" }],
  },
  {
    status: "awaiting-feedback",
    title: "Create Design System Documentation",
    description: "Create comprehensive documentation for the design system, including components and design patterns.",
    dueDate: "2025-07-03",
    priority: "medium",
    assignedTo: [
      { name: "Anna Schmitt", initials: "AS", color: "#FF7A00" },
      { name: "Benno Meier", initials: "BM", color: "#FF5EB3" },
      { name: "Carla Unger", initials: "CU", color: "#6E52FF" },
      { name: "David Schwarz", initials: "DS", color: "#9327FF" },
      { name: "Emily Hartmann", initials: "EH", color: "#00BEE8" },
      { name: "Fabian Klein", initials: "FK", color: "#1FD7C1" },
      { name: "Greta Völker", initials: "GV", color: "#FF745E" },
    ],
    category: "Technical Task",
    subtasks: [
      { done: true, subtask: "Buttons" },
      { done: true, subtask: "Colors" },
      { done: true, subtask: "Typography" },
    ],
  },
  {
    status: "to-do",
    title: "Research Analytics Tools",
    description: "Compare and research available analytics tools for user tracking and data insights.",
    dueDate: "2025-06-25",
    priority: "low",
    assignedTo: [{ name: "Carla Unger", initials: "CU", color: "#6E52FF" }],
    category: "Technical Task",
    subtasks: [],
  },
  {
    status: "in-progress",
    title: "Implement Dark Mode",
    description: "Add support for dark mode to the application, including a toggle for users.",
    dueDate: "2025-06-22",
    priority: "high",
    assignedTo: [
      { name: "Anna Schmitt", initials: "AS", color: "#FF7A00" },
      { name: "David Schwarz", initials: "DS", color: "#9327FF" },
    ],
    category: "User Story",
    subtasks: [
      { done: true, subtask: "Toggle Button UI" },
      { done: false, subtask: "Dark Theme CSS" },
    ],
  },
];

/**
 * Creates example tasks to add to the Firebase database
 *
 */
async function seedTasks() {
  for (const task of tasks) {
    try {
      const response = await fetch(`${baseURL}/tasks.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      const postData = await response.json();
      const taskId = postData.name; // saves the ID created by Firebase to the taskId variable

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
