
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Redux: Fetching tasks...');
      const response = await fetch('/api/tasks');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Redux: Fetched tasks:', data);
      return data;
    } catch (error) {
      console.error('Redux: Fetch tasks error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Add task
export const addTaskAsync = createAsyncThunk(
  'tasks/addTask',
  async (taskData, { rejectWithValue }) => {
    try {
      console.log('Redux: Adding task:', taskData);
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Redux: Add task failed:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Redux: Task added:', data);
      return data;
    } catch (error) {
      console.error('Redux: Add task error:', error);
      return rejectWithValue(error.message);
    }
  }
);


export const updateTaskAsync = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      console.log('Redux: Updating task', id, 'with data:', taskData);
      
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
        // console.log('Redux: Update request body:', JSON.stringify(taskData))
      });
      
      console.log('Redux: Update response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Redux: Update task failed:', response.status, errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Redux: Task updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Redux: Update task error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Delete task - COMPLETELY FIXED
export const deleteTaskAsync = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      console.log('Redux: Deleting task with ID:', id);
      
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      
      console.log('Redux: Delete response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Redux: Delete task failed:', response.status, errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Redux: Task deleted successfully:', data);
      return id; // Return the ID of the deleted task
    } catch (error) {
      console.error('Redux: Delete task error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        console.log('Redux: State updated with tasks:', action.payload);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add task
      .addCase(addTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
        console.log('Redux: Task added to state:', action.payload);
      })
      .addCase(addTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update task
      .addCase(updateTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
     .addCase(updateTaskAsync.fulfilled, (state, action) => {
  state.loading = false;
  console.log('Redux: Update fulfilled with payload:', action.payload);
  
  const index = state.list.findIndex(task => 
    task.id.toString() === action.payload.id.toString()
  );
  
  if (index !== -1) {
    state.list[index] = action.payload;
    console.log('Redux: Task updated in state:', action.payload);
    console.log('Redux: All tasks in state:', state.list);
  } else {
    console.error('Redux: Task not found in state for update, payload:', action.payload);
  }
})
      .addCase(updateTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete task
      .addCase(deleteTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        const taskId = action.payload;
        const initialLength = state.list.length;
        state.list = state.list.filter(task => 
          task.id.toString() !== taskId.toString()
        );
        console.log(`Redux: Tasks filtered from ${initialLength} to ${state.list.length}`);
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = taskSlice.actions;
export default taskSlice.reducer;