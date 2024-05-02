const { getParamsData } = require('./utils/paramUtil');
const PipelineService = require('./services/pipelineService');

const pipelineService = new PipelineService()

async function start() {
    try {
        const data = getParamsData()
        await pipelineService.run(data)
    } catch (error) {
        console.log(error)
    }
}

start()

