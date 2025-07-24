
import { getTasks, addTask } from './tasksData';

export default function handler(req, res) {
  console.log(`API ${req.method} /api/tasks`);
  
  if (req.method === "GET") {
    try {
      const tasks = getTasks();
      console.log('Returning tasks:', tasks);
      return res.status(200).json(tasks);
    } catch (error) {
      console.error('Error in GET /api/tasks:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === "POST") {
    try {
      console.log('POST request body:', req.body);
      
      const newTask = {
        ...req.body,
        // id: Date.now(),
         id: Date.now().toString(), // Ensure string ID
        createdAt: new Date().toISOString(),
      };

      console.log('Creating new task:', newTask);
      const createdTask = addTask(newTask);
      console.log('Task created successfully:', createdTask);
      
      return res.status(201).json(createdTask);
    } catch (error) {
      console.error('Error in POST /api/tasks:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  console.log(`Method ${req.method} not allowed`);
  return res.status(405).json({ message: "Method not allowed" });
}