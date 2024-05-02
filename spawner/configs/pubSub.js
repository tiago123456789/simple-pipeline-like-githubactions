
const { JobsClient } = require('@google-cloud/run').v2;

const cloudRunJob = new JobsClient({
    keyFilename: process.env.PUB_SUB_FILENAME
});

module.exports = cloudRunJob;