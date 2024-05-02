const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const TaskService = require("../services/taskService")
const taskService = new TaskService()

module.exports = (app) => {

    app.post("/tasks", upload.single("pipeline"), async (req, res, next) => {
        try {
            taskService.save({
                file: req.file
            })
            res.status(201).json({});
        } catch (err) {
            return next(err);
        }
    });

    app.get("/tasks", async (req, res) => {
        const tasks = await taskService.getAll()
        return res.json(tasks)
    })

    app.get("/tasks/:taskId/run", async (req, res, next) => {
        try {
            const params = req.params
            await taskService.run(params)
            return res.status(202).json({})
        } catch (error) {
            return next(error);
        }
    })

    app.get("/tasks/:taskId/executions/:executionId", async (req, res, next) => {
        try {
            const params = req.params
            const executionLogs = await taskService.getTaskExecutionLogs(params)
            return res.json(executionLogs)
        } catch (err) {
            return next(err);
        }
    })

    app.post("/tasks/:taskId/params", async (req, res, next) => {
        try {
            const params = req.params
            await taskService.addParamsToTask({
                ...params,
                data: req.body
            });
            res.status(201).json({})
        } catch (err) {
            return next(err);
        }
    })

}