const { default: mongoose } = require("mongoose");

class TaskModel {
    constructor() {
        this.schema = new mongoose.Schema({
            userId: { type: mongoose.Types.ObjectId, ref: 'tbl_users' },
            title: { type: String, required: true },
            description: { type: String },
            completed: { type: Boolean, default: false },
            dueDate: { type: Date, required: true },  // Add due date
        }, { timestamps: true })

        this.model = mongoose.model("tbl_tasks", this.schema)
    }
}

module.exports = TaskModel