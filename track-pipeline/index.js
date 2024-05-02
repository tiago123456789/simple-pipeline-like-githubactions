require("dotenv").config()
const Pusher = require('pusher-js');

const pusher = new Pusher(process.env.PUSHER_KEY, {
    cluster: process.env.PUSHER_CLUSTER
});

var channel = pusher.subscribe('my-channel');

const taksId = process.argv[2]

let count = 1;
const logsWaiting = []

function printLogsWaiting(isIncrementCountIfEqual) {
    logsWaiting
        .sort(function compareFn(a, b) {
            if (a.count < b.count) {
                return -1;
            } else if (a.count > b.count) {
                return 1;
            }
            return 0;
        })
        .forEach((register, index) => {
            const isPrintNow = count === register.count
            if (isPrintNow) {
                console.log(`Count: ${register.count} | Id: ${register.executionId} | event: ${register.event}`);
                if (isIncrementCountIfEqual) {
                    count += 1
                }
            }

            if (!isIncrementCountIfEqual) {
                count += 1
            }
        })
}

channel.bind(`logs:${taksId}`, function (data) {
    const register = data.message
    const isPrintNow = count === register.count
    if (!isPrintNow) {
        logsWaiting.push(register)
    } else {
        console.log(`Count: ${register.count} | Id: ${register.executionId} | event: ${register.event}`);
        count += 1
        printLogsWaiting(true)
    }

    if (register.isFinished) {
        printLogsWaiting(false)
        console.log(`Count: ${register.count} | Id: ${register.executionId} | event: ${register.event}`);
    }
});

console.log(`Starting track events of taskId ${taksId}`)
