const connectionDB = require("../configs/database")
const TABLE = 'tasks';

class TaskRepository {

    save(data) {
        return connectionDB(TABLE).insert(data)
    }

    getAll() {
        return connectionDB(TABLE).select(["id", "name", "created_at", "updated_at"])
    }

    async getById(id) {
        let task = await connectionDB(TABLE).where("id", id).limit(1)
        return task[0] || null
    }

    async getParamsOfTask(taskId) {
        return connectionDB("params").where("task_id", taskId)
    }

    addParamsToTask(registers) {
        return connectionDB("params").insert(registers)
    }

    getTaskExecutionLogs(executionId) {
        return connectionDB("executions")
            .where("uid", executionId)
            .orderBy("created_at", "asc")
    }
}

module.exports = TaskRepository