const { httpErrors, httpSuccess, roles } = require("../constents");
const TaskModel = require("./TaskModel");

class TaskController extends TaskModel {
    constructor() {
        super();
        this.createTask = this.createTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.listTasks = this.listTasks.bind(this);
        this.updateTask = this.updateTask.bind(this);
    }

    async createTask(req, res, next) {
        try {
            const { title, description, dueDate } = req.body;

            const taskCount = await this.model.countDocuments({ userId: req.user._id });
            console.log(taskCount)
            if (req.user.role !== 0 && taskCount >= 10) {
                return res.status(400).json({ message: 'Task limit reached. You can only create up to 10 tasks.' });
            }

            if (!title || !dueDate) {
                throw httpErrors[400];
            }

            // Create a new task
            const newTask = await this.model.create({ title, description, dueDate, userId: req.user._id });
            if(!newTask) throw httpErrors[500]
            return res.status(202).send({ message: httpSuccess, data: newTask });
        } catch (error) {
            next(error);
        }
    }

    async listTasks(req, res, next) {
        try {
            // const { user } = req.body
            const query = req.user.role === 0 ? {} : { userId: req.user._id };
            const tasks = await this.model.find(query);
            if (!tasks) throw httpErrors[500];

            return res.status(200).send({ message: httpSuccess, data: tasks });
        } catch (error) {
            next(error);
        }
    }

    async updateTask(req, res, next) {
        try {
            const { id } = req.params;
            const updateFields = req.body;

            const task = await this.model.findByIdAndUpdate(id, updateFields, { new: true });
            if (!task) throw httpErrors[404];

            return res.status(200).send({ message: httpSuccess, data: task });
        } catch (error) {
            next(error);
        }
    }

    async deleteTask(req, res, next) {
        try {
            const { id } = req.params;
            const result = await this.model.deleteOne({ _id: id });

            if (!result || result.deletedCount === 0) throw httpErrors[500];
            return res.status(200).send({ message: httpSuccess });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TaskController();
