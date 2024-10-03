import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Snackbar,
    MenuItem,
    Select,
    IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import api from '../../Common/Api';
import { Edit as EditIcon, Visibility as ViewIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TaskList = ({ Auth }) => {
    const [tasks, setTasks] = useState([]);
    const [open, setOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
    const [viewTask, setViewTask] = useState(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
    const [selectedStatus, setSelectedStatus] = useState(-1); 
    const [isEdit, setIsEdit] = useState(false);
    const [editTaskId, setEditTaskId] = useState(null);
    const navigate = useNavigate()

    const fetchTasks = async () => {
        try {
            const response = await api.getTask();
            console.log('Fetched Tasks:', response);
            setTasks(response.data.data || []);
        } catch (error) {
            console.error('Error fetching tasks', error);
            setSnackbarMessage(error.message);
            setSnackbarOpen(true);
        }
    };

    const handleOpen = () => {
        setIsEdit(false); 
        setOpen(true);
    };

    const handleEditOpen = (task) => {
        setIsEdit(true);
        setEditTaskId(task._id);
    
        const formattedDueDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
    
        setNewTask({
            title: task.title || '', 
            description: task.description || '', 
            dueDate: formattedDueDate
        });
        setOpen(true); 
    };
    

    const handleViewOpen = (task) => {
        setViewTask(task);
        setViewOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNewTask({ title: '', description: '', dueDate: '' });
        setEditTaskId(null);
    };

    const handleViewClose = () => {
        setViewOpen(false);
        setViewTask(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (isEdit) {
                const response = await api.updateTask(editTaskId, { ...newTask, userId: Auth._id });
                console.log('Task Updated Response:', response);
                setSnackbarMessage('Task updated successfully!');
            } else {
                const response = await api.addTask({ ...newTask, userId: Auth._id }); 
                console.log('Task Added Response:', response);
                setSnackbarMessage('Task added successfully!');
            }

            setSnackbarOpen(true);
            fetchTasks();
            handleClose();
        } catch (error) {
            console.error('Error saving task', error);
            setSnackbarMessage(error.response.data.message);
            setSnackbarOpen(true);
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await api.deleteTask(taskId);
            setSnackbarMessage('Task deleted successfully!');
            setSnackbarOpen(true);
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task', error);
            setSnackbarMessage(error.message);
            setSnackbarOpen(true);
        }
    };

    useEffect(() => {
        fetchTasks();
        if(!Auth && !Auth?._id){
            navigate("/")
        }
        // eslint-disable-next-line
    }, [selectedStatus]);

    const columns = [
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'description', headerName: 'Description', flex: 1 },
        {
            field: 'dueDate',
            headerName: 'Due Date',
            flex: 1,
            renderCell: (params) => {
                const date = new Date(params.row.dueDate);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                });
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <div>
                    <IconButton color="success" onClick={() => handleEditOpen(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleViewOpen(params.row)}>
                        <ViewIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(params.row._id)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            ),
        },
    ];

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Your Tasks</Typography>
            <div className="d-flex justify-content-between mb-3">
                <div className="d-flex align-items-center gap-3">
                    <Select
                        onChange={(e) => setSelectedStatus(Number(e.target.value))}
                        value={selectedStatus}
                        style={{ minWidth: '150px' }}
                        size="small"
                    >
                        <MenuItem value={-1}>All</MenuItem>
                        <MenuItem value={0}>Pending</MenuItem>
                        <MenuItem value={1}>Completed</MenuItem>
                        <MenuItem value={2}>Overdue</MenuItem>
                    </Select>
                    <Button variant="outlined" onClick={handleOpen}>
                        Add Task
                    </Button>
                </div>
            </div>

            <div style={{ height: 400, width: '100%' }}>
                {tasks.length > 0 ? (
                    <DataGrid
                        rows={tasks}
                        columns={columns}
                        autoHeight
                        pagination
                        paginationModel={paginationModel}
                        onPaginationModelChange={(model) => setPaginationModel(model)}
                        getRowId={(row) => row._id}
                    />
                ) : (
                    <Typography>No tasks available.</Typography>
                )}
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEdit ? 'Edit Task' : 'Add New Task'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        type="text"
                        fullWidth
                        name="title"
                        value={newTask.title}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        name="description"
                        value={newTask.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                    />
                    <TextField
                        margin="dense"
                        label="Due Date"
                        type="date"
                        fullWidth
                        name="dueDate"
                        value={newTask.dueDate}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {isEdit ? 'Update Task' : 'Add Task'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={viewOpen} onClose={handleViewClose}>
                <DialogTitle>View Task</DialogTitle>
                <DialogContent>
                    {viewTask && (
                        <>
                            <Typography variant="subtitle1"><strong>Title:</strong> {viewTask.title}</Typography>
                            <Typography variant="subtitle1"><strong>Description:</strong> {viewTask.description}</Typography>
                            <Typography variant="subtitle1">
                                <strong>Due Date:</strong> {new Date(viewTask.dueDate).toLocaleDateString('en-US')}
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleViewClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Container>
    );
};

export default TaskList;
