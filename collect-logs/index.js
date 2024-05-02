const Pusher = require("pusher");
const knex = require("knex")
const configDB = require("./knexfile")
const connectionDB = knex(configDB)

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true
});

exports.main = async (message, context) => {
    let data = Buffer.from(message.data, 'base64').toString();

    console.log(`Message received: ${data}`);

    data = JSON.parse(data);

    await connectionDB("executions").insert({
        uid: data.executionId,
        task_id: data.taskId,
        logs: data.event,
        created_at: data.created_at
    })

    await pusher.trigger("my-channel", `logs:${data.taskId}`, { message: data })

    return Promise.resolve();
};
