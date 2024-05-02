require("dotenv").config()

const express = require("express")
const app = express()

const notFoundMiddleware = require("./middlewares/notFoundMiddleware")
const handlerExceptionMiddleware = require("./middlewares/handlerExceptionMiddleware")
const routesApp = require("./routes")

app.use(express.json());

routesApp(app)

app.use(handlerExceptionMiddleware)

app.use(notFoundMiddleware)

app.listen(3000, () => console.log(`Server is running at http://localhost:3000`))