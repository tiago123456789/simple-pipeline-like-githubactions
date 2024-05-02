const { exec } = require('child_process');
const pubSubClient = require("../configs/pubSub");

class PipelineService {

    constructor(
        pubSub = pubSubClient
    ) {
        this.pubSub = pubSub;
        this.addicionalEventData = {
            count: 0
        }
    }

    async notifyOuput(data) {
        this.addicionalEventData.count += 1
        await this.pubSub.topic(process.env.PUB_SUB_TOPIC_LOG).publish(Buffer.from(JSON.stringify({
            ...data, 
            ...this.addicionalEventData,
            created_at: new Date()
        })))
    }

    applySecretsOnCommand(command, secrets) {
        const secretsToReplace = command.match(/\${params\.([a-zA-z0-9])+}/g)
        if (!secretsToReplace) {
            return command;
        }

        secretsToReplace.forEach(secretToReplace => {
            const secretName = secretToReplace.replace("${params.", "").replace("}", "")
            command = command.replace(secretToReplace, secrets[secretName])
        });
        return command;
    }

    runStep(step, secrets) {
        return new Promise(async (resolve, reject) => {
            await this.notifyOuput({
                event: `>>>>> ${step.name}`,
            })

            const child = exec(
                this.applySecretsOnCommand(step.run, secrets)
            );

            child.stdout.on('data', async (data) => {
                await this.notifyOuput({
                    event: data,
                })
            });

            child.on('exit', async (code, signal) => {
                if (code != 0) {
                    await this.notifyOuput({
                        event: `Process return code ${code} and pipeline was finish.`,
                    })
                }
            });

            child.stderr.on('data', async (data) => {
                if (/error/i.test(data)) {
                    await this.notifyOuput({
                        event: data,
                    })
                    reject(data)
                }
            });

            child.on('error', async (err) => {
                await this.notifyOuput({
                    event: err.message,
                })

                reject(err)
            });


            child.on('close', (code, signal) => {
                resolve()
            });
        })

    }

    async executeSteps(steps, secrets) {
        for (let index = 0; index < steps.length; index += 1) {
            const step = steps[index]
            await this.runStep(step, secrets)
        }
    }

    async start(task, params) {
        let steps = task.pipeline.steps;
        const stepsIfSuccess = steps.filter(step => step.trigger_if_success)
        const stepsIfFailed = steps.filter(step => step.trigger_if_failed)
        steps = steps.filter(step => !step.trigger_if_success && !step.trigger_if_failed)

        try {
            await this.executeSteps(steps, params);
            await this.executeSteps(stepsIfSuccess, params);
        } catch (err) {
            await this.executeSteps(stepsIfFailed, params);
        }
    }

    async run(data) {
        try {
            this.addicionalEventData.executionId = data.executionId;
            this.addicionalEventData.taskId = data.task.id;
            await this.start(data.task, data.paramsObject)
            await this.notifyOuput({
                event: "Finished execution of pipeline",
                isFinished: true
            })
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
}

module.exports = PipelineService;