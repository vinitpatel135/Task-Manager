const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/Db');
const userController = require('./Users/UserController');
const TaskController = require('./Tasks/TaskController');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.post('/register', userController.createUser);
app.post('/login', userController.loginUser);
app.delete('/user/:id', userController.AuthGard, userController.deleteUser);
app.get('/users', userController.AuthGard, userController.listUser);

// Routes for Tasks
app.post('/task', userController.AuthGard, TaskController.createTask);
app.get('/tasks', userController.AuthGard, TaskController.listTasks);
app.put('/task/:id', userController.AuthGard, TaskController.updateTask);
app.delete('/task/:id', userController.AuthGard, TaskController.deleteTask);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).send({ error: message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
