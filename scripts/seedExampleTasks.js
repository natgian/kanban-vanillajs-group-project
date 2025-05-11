const baseURL = "https://join-458-default-rtdb.europe-west1.firebasedatabase.app";

const tasks = [
  {
    status: "to-do",
    title: "HTML Base Template Creation",
    description: "Create reusable HTML base templates that will serve as the foundation for other pages in the project.",
    dueDate: "2025-05-05",
    priority: "low",
    assignedTo: [
      { name: "Anna Müller", initials: "AM", color: "#FF0000" },
      { name: "Bernd Schmidt", initials: "BS", color: "#800080" },
      { name: "Claudia Thiel", initials: "CT", color: "#FFFF00" },
    ],
    category: "Technical Task",
    subtasks: [{ done: false, subtask: "Setup Base Styles" }],
  },
  {
    status: "in-progress",
    title: "Implement Login Page",
    description: "Build and style the login page, adding form validation for login credentials.",
    dueDate: "2025-05-10",
    priority: "high",
    assignedTo: [{ name: "David Huber", initials: "DH", color: "#0000FF" }],
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
    description: "Implement a navigation bar that adjusts responsively for mobile, tablet, and desktop views.",
    dueDate: "2025-05-12",
    priority: "medium",
    assignedTo: [{ name: "Elena Krüger", initials: "EK", color: "#A52A2A" }],
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
    dueDate: "2025-04-30",
    priority: "low",
    assignedTo: [{ name: "Felix Neumann", initials: "FN", color: "#008080" }],
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
    dueDate: "2025-05-15",
    priority: "high",
    assignedTo: [
      { name: "Greta Schäfer", initials: "GS", color: "#FF0000" },
      { name: "Hassan Özdemir", initials: "HÖ", color: "#A52A2A" },
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
    dueDate: "2025-05-08",
    priority: "medium",
    assignedTo: [{ name: "Isabel Lange", initials: "IL", color: "#A52A2A" }],
    category: "Technical Task",
    subtasks: [{ done: false, subtask: "Install Packages" }],
  },
  {
    status: "done",
    title: "Create Design System Documentation",
    description: "Create comprehensive documentation for the design system, including components and design patterns.",
    dueDate: "2025-05-03",
    priority: "medium",
    assignedTo: [{ name: "Maximilian Braun", initials: "MB", color: "#0000FF" }],
    category: "Technical Task",
    subtasks: [
      { done: true, subtask: "Buttons" },
      { done: true, subtask: "Colors" },
      { done: true, subtask: "Typography" },
    ],
  },
  {
    status: "awaiting-feedback",
    title: "Prepare Pitch Deck",
    description: "Finalize the presentation deck for stakeholders, including key messages and visuals.",
    dueDate: "2025-05-20",
    priority: "high",
    assignedTo: [
      { name: "Thomas Wagner", initials: "TW", color: "#008000" },
      { name: "Elena Krüger", initials: "EK", color: "#A52A2A" },
    ],
    category: "User Story",
    subtasks: [
      { done: true, subtask: "Design Cover Slide" },
      { done: false, subtask: "Write Key Messages" },
      { done: false, subtask: "Review with Team" },
    ],
  },
  {
    status: "to-do",
    title: "Research Analytics Tools",
    description: "Compare and research available analytics tools for user tracking and data insights.",
    dueDate: "2025-05-25",
    priority: "low",
    assignedTo: [{ name: "Claudia Thiel", initials: "CT", color: "#FFFF00" }],
    category: "Technical Task",
    subtasks: [],
  },
  {
    status: "in-progress",
    title: "Implement Dark Mode",
    description: "Add support for dark mode to the application, including a toggle for users.",
    dueDate: "2025-05-22",
    priority: "high",
    assignedTo: [
      { name: "Anna Müller", initials: "AM", color: "#FF0000" },
      { name: "David Huber", initials: "DH", color: "#0000FF" },
    ],
    category: "User Story",
    subtasks: [
      { done: true, subtask: "Toggle Button UI" },
      { done: false, subtask: "Dark Theme CSS" },
    ],
  },
  {
    status: "to-do",
    title: "Setup Database Schema",
    description: "Design and implement the initial database schema for the application.",
    dueDate: "2025-06-01",
    priority: "high",
    assignedTo: [],
    category: "Technical Task",
    subtasks: [
      { done: false, subtask: "Define Tables" },
      { done: false, subtask: "Set Relationships" },
      { done: false, subtask: "Create Migrations" },
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
      const taskId = postData.name; // adds the ID created by Firebase to the taskId after the task has been added to the database

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
