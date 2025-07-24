
import { getTaskById, updateTask, deleteTask } from '../tasksData';

export default function handler(req, res) {
 const {
    query: { id }
  } = req;
  console.log(`API ${req.method} /api/tasks/${id}`);

  if (req.method === "GET") {
    try {
      const task = getTaskById(id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.status(200).json(task);
    } catch (error) {
      console.error('Error in GET /api/tasks/[id]:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

if (req.method === "PUT") {
  try {
    console.log('PUT request body:', req.body);
    console.log('PUT request ID:', id);

  const taskDataWithId = {
  ...req.body,
  id: id,
  status: req.body.status || 'incomplete'
};
    console.log('Task data with ID:', taskDataWithId);

    const updatedTask = updateTask(id, taskDataWithId);
    console.log('Task updated successfully:', updatedTask);

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error in PUT /api/tasks/[id]:', error);
    if (error.message === 'Task not found') {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}


  if (req.method === "DELETE") {
    try {
      deleteTask(id);
      console.log('Task deleted successfully');
      
      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error in DELETE /api/tasks/[id]:', error);
      if (error.message === 'Task not found') {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  console.log(`Method ${req.method} not allowed`);
  return res.status(405).json({ message: "Method not allowed" });
}