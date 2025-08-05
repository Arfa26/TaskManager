
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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [taskToDelete, setTaskToDelete] = useState(null);
const statuses = [
  { key: "todo", label: "To Do" },
  { key: "approved", label: "Approved" },
  { key: "review", label: "In Review" },
  { key: "draft", label: "Drafting" },
  { key: "done", label: "Done" },
];


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
// const tasksForStatus = filteredTasks.filter((task) => task.status === key);
const handleEdit = (task) => {
  setEditMode(true);
  setShowForm(true);
  setCurrentTaskId(task.id); 
  setValue("id", task.id); 
  setValue("title", task.title);
  setValue("description", task.description || "");
  setValue("priority", task.priority);
  setValue("dueDate", task.dueDate ? task.dueDate.substring(0, 10) : "");
};


const handleDeleteClick = (id) => {
  setTaskToDelete(id);
  setDeleteDialogOpen(true);
};

const confirmDelete = async () => {
  try {
    await dispatch(deleteTaskAsync(taskToDelete));
  } catch (error) {
    console.error("Delete failed:", error);
  } finally {
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  }
};

const cancelDelete = () => {
  setDeleteDialogOpen(false);
  setTaskToDelete(null);
};


const onSubmit = async (data) => {
  try {
    if (editMode) {
      await dispatch(updateTaskAsync({ 
        id: currentTaskId, 
        taskData: { ...data, id: currentTaskId } 
      }));
      console.log('Updated task:', { ...data, id: currentTaskId });
    } else {
      const newId = Date.now();
      await dispatch(addTaskAsync({ ...data, id: newId}));
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
    <Container maxWidth="xl" sx={{ backgroundColor:'rgba(236, 236, 236, 0.3)'}}>
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

    
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2,pt:4 }}>
          <Box display={'flex'}>
          <img
            src="/ch.png"
            alt="Task Manager Logo"
            style={{ width: 60, height: 60, marginRight: 20 }}
          />
          <Typography variant="h4" fontWeight="bold" gutterBottom color="rgb(24, 24, 24)"
            sx={{ fontFamily: "'Montserrat', sans-serif", fontSize: '2.6rem', letterSpacing: '0.05em' }}
            >
            TASK MANAGER
          </Typography>
          </Box>
          <Box sx={{display: 'flex', gap:3, alignItems: 'center', mb: 2 }}>
            <TextField
              placeholder="Search tasks..."
              variant="outlined"
              size="small"
              sx={{ minWidth: 300 ,'& .MuiOutlinedInput-root': {
                borderRadius: '20px',border: '1px solid rgb(24, 24, 24)',
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
                borderRadius: '20px',border: '1px solid rgb(24, 24, 24)',
              }}}
            >
              <MenuItem value="">All Priorities</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>
            <Button
              variant="contained"
              sx={{p:2,fontSize:16,fontFamily: 'Montserrat, sans-serif',borderRadius:4,fontWeight:'bold',background: "linear-gradient(135deg, #f44336, rgb(24, 24, 24))"}}
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
        {/* <Divider sx={{ mb: 3 }} /> */}

        {/* Task Form Dialog */}
        <Dialog open={showForm} onClose={() => setShowForm(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{fontWeight:'bold', color:'rgb(24, 24, 24)'}}>
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
                <TextField
  label="Status *"
  select
  fullWidth
  size="small"
  defaultValue=""
  {...register("status", { required: "Status is required" })}
  error={!!errors.status}
  helperText={errors.status?.message}
  sx={{
    minWidth: 265,
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
    },
  }}
>
  {[
    { value: "todo", label: "To Do" },
    { value: "approved", label: "Approved" },
    { value: "review", label: "In Review" },
    { value: "draft", label: "Drafting" },
    { value: "done", label: "Done" },
  ].map(({ value, label }) => (
    <MenuItem key={value} value={value}>
      {label}
    </MenuItem>
  ))}
</TextField>

                
              </Grid>
              
            </DialogContent>
            <DialogActions sx={{marginRight: 2, marginBottom: 2}}>
              <Button 
                onClick={() => setShowForm(false)}
                disabled={loading}
                sx={{
                  border: "1px solid rgb(24, 24, 24)",
                  color: "rgb(24, 24, 24)",
                  borderRadius: 2,
                  ":hover": {
                    color: "#fff",
                    border:'none',
                    background: "linear-gradient(135deg, #f44336, rgb(24, 24, 24))",
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
                  background: "linear-gradient(135deg, #f44336, rgb(24, 24, 24))",
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
      

<Box
  display="flex"
  flexWrap="wrap"
  justifyContent="start"
  gap={2}
  mb={6}
>
{statuses.map(({ key, label }) => {
  const tasksForStatus = filteredTasks.filter((task) => task.status === key);

  return (
    <Box
      key={key}
      sx={{
        flex: '1 1 25%',
        maxWidth: '50%',
        minWidth: {
          xs: '100%',
          sm: '48%',
          md: '31%',
          lg: '23%',
          xl: '19%',
        },
        backgroundColor: 'rgba(212, 212, 212, 0.2)',
        borderRadius: 3,
        p: 2,
        minHeight: 350,
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          borderBottom: '1.5px solid rgb(24, 24, 24)',
          paddingBottom: '8px',
          marginBottom: '12px',
        }}
      >
        <Box 
  display="flex" 
  justifyContent="space-between" 
  alignItems="center"
>
  <Typography
    variant="h6"
    sx={{
      color: 'rgb(24, 24, 24)',
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 600,
    }}
  >
    {label}
  </Typography>

  <Box
    sx={{
      background: "linear-gradient(135deg, #f44336, rgb(24, 24, 24))",
      color: '#fff',
      fontWeight: 'bold',
      borderRadius: '50%',
      width: 26,
      height: 26,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.85rem',
    }}
  >
    {tasksForStatus.length}
  </Box>
</Box>

      </Box>

      {/* Tasks or empty message */}
      {tasksForStatus.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 15, color: 'gray', fontStyle: 'italic' }}>
          No tasks
        </Box>
      ) : (
        tasksForStatus.map((task) => (
          <Paper
            key={task.id}
            elevation={2}
            sx={{
              mb: 1.5,
              p: 1.5,
              borderRadius: 2,
              backgroundColor: "#fff",
              borderLeft: `6px solid ${
                task.priority === 'High' ? '#f44336' :
                task.priority === 'Medium' ? '#ff9800' : '#4caf50'
              }`,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {task.title}
            </Typography>
            <Typography variant="body2">{task.description}</Typography>
            <Typography variant="caption" color="text.secondary">
              Due: {task.dueDate?.substring(0, 10)}
            </Typography>

            <Box sx={{ mt: 1, gap:1,display: 'flex', justifyContent:"right" }}>
              <IconButton onClick={() => handleEdit(task)} size="small" sx={{background: "linear-gradient(135deg, #f44336, rgb(24, 24, 24))", color: "#fff"}}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => handleDeleteClick(task.id)} size="small"sx={{background: "linear-gradient(135deg, #f44336, rgb(24, 24, 24))", color: "#fff"}}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
})}

</Box>



      {/* </Paper> */}
       {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this task?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} variant="outlined" sx={{mb:2}}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error" sx={{ background: "linear-gradient(135deg, #f44336, rgb(24, 24, 24))" ,mr: 2 ,mb:2}}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
