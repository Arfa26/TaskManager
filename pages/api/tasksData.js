const STORAGE_KEY = 'tasks';

const defaultTasks = [
  {
    id: 1,
    title: "Complete Project Proposal",
    description: "Write and finalize the project proposal for Q1",
    priority: "High",
    dueDate: "2025-08-15",
    status: "incomplete"
  },
  {
    id: 2,
    title: "Review Code Changes",
    description: "Review pull requests from team members",
    priority: "Medium",
    dueDate: "2025-08-10",
    status: "incomplete"
  },
];

// Global in-memory task cache
//let tasks = [];
let tasks = global.tasksStore || [...defaultTasks];
global.tasksStore = tasks;
// let tasks = loadTasksFromStorage();
function loadTasksFromStorage() {
  if (typeof window === 'undefined') {
    return [...defaultTasks];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTasks));
      return [...defaultTasks];
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [...defaultTasks];
  }
}

function saveTasksToStorage(tasksToSave) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }
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

export function updateTask(id, updatedData) {
  const tasks = loadTasksFromStorage();
  console.log("All Tasks:", tasks);
  console.log("Update Request ID:", id);

  const index = tasks.findIndex(task => String(task.id) === String(id));

  if (index !== -1) {
    tasks[index] = {
      ...tasks[index],
      ...updatedData,
      id: tasks[index].id,
      updatedAt: new Date().toISOString()
    };
    saveTasksToStorage(tasks);
    return tasks[index];
  }

  throw new Error('Task not found');
}


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
