const express = require("express")
const CloudRunJonService = require("./services/cloudRunJobService")
const cloudRunJonService = new CloudRunJonService()
const app = express();

app.use(express.json())

app.post("/spawn-jobs", async (req, res) => {
    try {
        const { message } = req.body;
        await cloudRunJonService.spawn(message)
        res.status(202).json({ message: `Started to process ${message.messageId}` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error?.message })
    }

})

app.listen("6000", () => console.log(`Server is running at http://localhost:6000`))