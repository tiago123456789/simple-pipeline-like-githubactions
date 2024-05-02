
const { execSync } = require("child_process")
const cloudRunJobClient = require("../configs/pubSub")

class CloudRunJobService {

    constructor(
        cloudRunJob = cloudRunJobClient
    ) {
        this.cloudRunJob = cloudRunJob;
    }

    async spawn(message) {
        const jobName = `job-${message.messageId}-${new Date().getTime()}`
        console.log(`Starting ${jobName} process`)
        execSync(`cd ./terraform && rm -rf ./terraform.tfstate ./terraform.tfstate.backup && terraform apply -auto-approve -var='pub_sub_topic_log=${process.env.PUB_SUB_TOPIC_LOG}' -var='job_name=${jobName}' -var='params_data=${message.data}'`)
        await this.startJob(jobName)
        console.log(`Finished ${jobName} process`)
    }


    startJob(jobName) {
        const request = {
            name: `projects/${process.env.PROJECT_ID}/locations/${process.env.REGION}/jobs/${jobName}`
        };
        return this.cloudRunJob.runJob(request);
    }

}

module.exports = CloudRunJobService;