const { PubSub } = require("@google-cloud/pubsub");

const pubSubClient = new PubSub({
    keyFilename: process.env.PUB_SUB_FILENAME
})

module.exports = pubSubClient;