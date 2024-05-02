const pubSubClient = require("../configs/pubSub")
const NotFoundException = require("../exceptions/notFoundException");
const TaskRepository = require("../repositories/taskRepository");
const { randomUUID } = require("crypto")
const fs = require("fs");
const yaml = require('yaml');

class TaskService {

    constructor(
        taskRepository = new TaskRepository(),
        pubSub = pubSubClient
    ) {
        this.taskRepository = taskRepository;
        this.pubSub = pubSub;
    }

    getAll() {
        return this.taskRepository.getAll()
    }

    async run(params) {

        let task = await this.taskRepository.getById(params.taskId)
        if (!task) {
            throw new NotFoundException("Task not found");
        }

        let paramsOfTask = await this.taskRepository.getParamsOfTask(params.taskId)
        const paramsObject = {}
        paramsOfTask.forEach(item => {
            paramsObject[item.name] = item.value
        })

        const event = JSON.stringify({
            executionId: randomUUID(),
            task,
            paramsObject
        });

        return this.pubSub
            .topic(process.env.PUB_SUB_TOPIC_START_PIPELINE)
            .publish(Buffer.from(event));
    }

    async save(params) {
        let data = fs.readFileSync(params.file.path, 'utf8');
        const jsonData = yaml.parse(data);

        const task = {
            name: jsonData.name,
            pipeline: JSON.stringify(jsonData)
        }

        return this.taskRepository.save(task);
    }

    async getTaskExecutionLogs(params) {
        let task = await this.taskRepository.getById(params.taskId)
        if (!task) {
            throw new NotFoundException("Task not found");
        }

        return this.taskRepository.getTaskExecutionLogs(params.executionId)
    }

    async addParamsToTask(params) {
        let task = await this.taskRepository.getById(params.taskId);
        if (!task) {
            throw new NotFoundException("Task not found");
        }

        let paramsOfTask = params.data;
        paramsOfTask = paramsOfTask.map(item => {
            item.task_id = task.id
            return item
        })

        return this.taskRepository.addParamsToTask(paramsOfTask);
    }
}

module.exports = TaskService;