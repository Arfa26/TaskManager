
import {
  Container, Typography, TextField, Button, List, ListItem,
  ListItemText, IconButton, Stack, Dialog, DialogTitle,
  DialogContent, DialogActions, Paper, Box, Divider, Grid, MenuItem,
  CircularProgress, Alert, Snackbar
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { 
  fetchTasks, 
  addTaskAsync, 
  deleteTaskAsync, 
  updateTaskAsync,
  clearError 
} from "../store/taskSlice";

export default function Home({ initialTasks }) {
  const dispatch = useDispatch();
  const { list: tasks, loading, error } = useSelector((state) => state.tasks);

  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showError, setShowError] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Load tasks on component mount
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Handle error display
  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  // Filter tasks based on search and priority
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = priorityFilter === "" || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  // const onSubmit = async (data) => {
  //   if (editMode) {
  //     await dispatch(updateTaskAsync({ 
  //       id: currentTaskId, 
  //       taskData: { ...data, id: currentTaskId } 
  //     }));
  //   } else {
  //     await dispatch(addTaskAsync({ ...data, status: "incomplete" }));
  //   }
    
  //   reset();
  //   setShowForm(false);
  //   setEditMode(false);
  //   setCurrentTaskId(null);
  // };

  // const handleDelete = async (id) => {
  //   if (window.confirm('Are you sure you want to delete this task?')) {
  //     await dispatch(deleteTaskAsync(id));
  //   }
  // };

  // const handleEdit = (task) => {
  //   setEditMode(true);
  //   setShowForm(true);
  //   setCurrentTaskId(task.id);
  //   setValue("title", task.title);
  //   setValue("description", task.description || "");
  //   setValue("priority", task.priority);
  //   setValue("dueDate", task.dueDate ? task.dueDate.substring(0, 10) : "");
  // };
const handleEdit = (task) => {
  setEditMode(true);
  setShowForm(true);
  setCurrentTaskId(task.id); 
  setValue("id", task.id); // Set ID for update
  setValue("title", task.title);
  setValue("description", task.description || "");
  setValue("priority", task.priority);
  setValue("dueDate", task.dueDate ? task.dueDate.substring(0, 10) : "");
};

const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this task?')) {
    try {
      await dispatch(deleteTaskAsync(id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }
};

// const onSubmit = async (data) => {
//   try {
//     if (editMode) {
//       await dispatch(updateTaskAsync({ 
//         id: currentTaskId, 
//         taskData: data 
//       }));
//       console.log('Submitting update for task ID:', currentTaskId, 'with data:', data);
//     } else {
//       await dispatch(addTaskAsync({ ...data,id: Date.now(), status: "incomplete" }));
//     }
    
//     reset();
//     setShowForm(false);
//     setEditMode(false);
//     setCurrentTaskId(null);
//   } catch (error) {
//     console.error('Submit failed:', error);
//   }
// };
const onSubmit = async (data) => {
  try {
    if (editMode) {
      await dispatch(updateTaskAsync({ 
        id: currentTaskId, 
        taskData: { ...data, id: currentTaskId }  // Ensure ID is passed
      }));
      console.log('Updated task:', { ...data, id: currentTaskId });
    } else {
      const newId = Date.now();
      await dispatch(addTaskAsync({ ...data, id: newId, status: "incomplete" }));
      console.log('Added new task:', { ...data, id: newId, status: "incomplete" });
    }

    reset();
    setShowForm(false);
    setEditMode(false);
    setCurrentTaskId(null);
  } catch (error) {
    console.error('Submit failed:', error);
  }
};

  const handleCloseError = () => {
    setShowError(false);
    dispatch(clearError());
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      {/* Error Snackbar */}
      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Paper
        elevation={5}
        sx={{
          p: 4,
          borderRadius: 3,
          mb: 4,
        }}
      >
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom color="rgb(186, 139, 2)"
            sx={{fontFamily: "'Manrope', sans-serif"}}>
            TASK MANAGER
          </Typography>
          <Box sx={{display: 'flex', gap:3, alignItems: 'center', mb: 2 }}>
            <TextField
              placeholder="Search tasks..."
              variant="outlined"
              size="small"
              sx={{ minWidth: 200 ,'& .MuiOutlinedInput-root': {
                borderRadius: '20px',
              }}}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <TextField
              select
              label="Priority Filter"
              size="small"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              sx={{ minWidth: 150, '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
              }}}
            >
              <MenuItem value="">All Priorities</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>
            <Button
              variant="contained"
              sx={{background: "linear-gradient(135deg, rgb(186, 139, 2), rgb(24, 24, 24))"}}
              onClick={() => {
                setShowForm(true);
                setEditMode(false);
                reset();
              }}
              disabled={loading}
            >
              Add New Task
            </Button>
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {/* Task Form Dialog */}
        <Dialog open={showForm} onClose={() => setShowForm(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{fontWeight:'bold', color:'rgb(186, 139, 2)'}}>
            {editMode ? "Update Task" : "Add New Task"}
          </DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Task Name *"
                    fullWidth
                    size="small"
                    {...register("title", { required: "Task name is required" })}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    sx={{ minWidth: 265 ,'& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    }}}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Priority *"
                    select
                    fullWidth
                    size="small"
                    defaultValue=""
                    {...register("priority", { required: "Priority is required" })}
                    error={!!errors.priority}
                    helperText={errors.priority?.message}
                    sx={{ minWidth: 265, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Due Date *"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    {...register("dueDate", { 
                      required: "Due date is required",
                      validate: (value) => {
                        const selectedDate = new Date(value);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return selectedDate >= today || "Due date cannot be in the past";
                      }
                    })}
                    error={!!errors.dueDate}
                    helperText={errors.dueDate?.message}
                    sx={{ minWidth: 265 ,'& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    }}}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Description *"
                    fullWidth
                    size="small"
                    {...register("description", { required: "Description is required" })}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    sx={{ minWidth: 265 ,'& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    }}}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{marginRight: 2, marginBottom: 2}}>
              <Button 
                onClick={() => setShowForm(false)}
                disabled={loading}
                sx={{
                  border: "1px solid rgb(186, 139, 2)",
                  color: "rgb(186, 139, 2)",
                  borderRadius: 2,
                  ":hover": {
                    color: "#fff",
                    background: "linear-gradient(135deg, rgb(186, 139, 2), rgb(24, 24, 24))",
                  },
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading}
                sx={{
                  background: "linear-gradient(135deg, rgb(186, 139, 2), rgb(24, 24, 24))",
                  color: "#fff",
                  fontWeight: 500,
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "#388e3c" },
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : (editMode ? "Update" : "Submit")}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Loading Indicator */}
        {loading && !showForm && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {/* Task List */}
        <List sx={{ mt: 2 }}>
          {filteredTasks.length === 0 && !loading ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">
                {searchQuery || priorityFilter ? 'No tasks match your filters' : 'No tasks yet. Add your first task!'}
              </Typography>
            </Paper>
          ) : (
            filteredTasks.map((task) => (
              <Paper
                key={task.id}
                elevation={3}
                sx={{
                  mb: 2,
                  p: 2.5,
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  transition: "0.3s",
                  borderLeft: `6px solid ${
                    task.priority === 'High' ? '#f44336' :
                    task.priority === 'Medium' ? '#ff9800' : '#4caf50'
                  }`,
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.01)",
                  },
                }}
              >
                <ListItem
                  disableGutters
                  secondaryAction={
                    <>
                      <Button
                        onClick={() => handleEdit(task)}
                        variant="contained"
                        disabled={loading}
                        sx={{
                          minWidth: '60px',
                          px: 1.5,
                          py: 1,
                          borderRadius: 1,
                          background: "linear-gradient(135deg, rgb(186, 139, 2), rgb(24, 24, 24))",
                          '&:hover': {
                            backgroundColor: '#bbdefb',
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </Button>

                      <Button
                        onClick={() => handleDelete(task.id)}
                        variant="contained"
                        color="error"
                        disabled={loading}
                        sx={{
                          background: "linear-gradient(135deg, #f44336, rgb(24, 24, 24))",
                          minWidth: '60px',
                          px: 1.5,
                          py: 1,
                          borderRadius: 1,
                          ml: 1,
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </>
                  }
                >
                  <Box>
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {task.description || "No description"}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="secondary.main">
                      Priority: {task.priority} | Due: {task.dueDate?.substring(0, 10)}
                    </Typography>
                  </Box>
                </ListItem>
              </Paper>
            ))
          )}
        </List>
      </Paper>
    </Container>
  );
}

// Server-side rendering
export async function getServerSideProps(context) {
  try {
    const protocol = context.req.headers['x-forwarded-proto'] || 'http';
    const host = context.req.headers.host;
    const apiUrl = `${protocol}://${host}/api/tasks`;
    
    const res = await fetch(apiUrl);
    const data = await res.json();

    return {
      props: {
        initialTasks: data,
      },
    };
  } catch (error) {
    console.error('SSR Error:', error);
    return {
      props: {
        initialTasks: [],
      },
    };
  }
}
