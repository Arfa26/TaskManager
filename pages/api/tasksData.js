const STORAGE_KEY = 'tasks';

const defaultTasks = [
  {
    id: 1,
    title: "Complete Project Proposal",
    description: "Write and finalize the project proposal for Q1",
    priority: "High",
    dueDate: "2025-08-15",
    status: "drafting"
  },
  {
    id: 2,
    title: "Review Code Changes",
    description: "Review pull requests from team members",
    priority: "Medium",
    dueDate: "2025-08-10",
    status: "drafting"
  },
];

let tasks = global.tasksStore || [...defaultTasks];
global.tasksStore = tasks;

function loadTasksFromStorage() {
  return global.tasksStore || [...defaultTasks];
}

function saveTasksToStorage(tasksToSave) {
  global.tasksStore = tasksToSave;
}

export function getTasks() {
  tasks = loadTasksFromStorage();
  return [...tasks];
}

export function getTaskById(id) {
  tasks = loadTasksFromStorage();
  return tasks.find(task => String(task.id) === String(id));
}

export function setTasks(newTasks) {
  tasks = [...newTasks];
  saveTasksToStorage(tasks);
}

export function addTask(task) {
  const newTask = {
    ...task,
    id: task.id ?? Date.now(),
    createdAt: new Date().toISOString(),
    status: task.status || 'incomplete',
  };

  const tasks = loadTasksFromStorage();
  tasks.push(newTask);
  saveTasksToStorage(tasks);
  return newTask;
}

// --- Update existing task ---
export function updateTask(id, updatedData) {
  const tasks = loadTasksFromStorage();

  const index = tasks.findIndex(task => String(task.id) === String(id));
  if (index === -1) {
    console.error(" Task not found for ID:", id);
    throw new Error("Task not found");
  }

  const updatedTask = {
    ...tasks[index],
    ...updatedData,
    id: tasks[index].id, // Keep original ID
    updatedAt: new Date().toISOString(),
  };

  tasks[index] = updatedTask;
  saveTasksToStorage(tasks);
  return updatedTask;
}

// --- Delete task by ID ---
export function deleteTask(id) {
  const tasks = loadTasksFromStorage();
  const index = tasks.findIndex(task => String(task.id) === String(id));

  if (index !== -1) {
    tasks.splice(index, 1);
    saveTasksToStorage(tasks);
    return true;
  }

  throw new Error('Task not found');
}
