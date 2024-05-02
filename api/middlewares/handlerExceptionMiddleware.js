module.exports = (err, req, res, next) => {
    switch(err.name) {
        case "NotFoundException":
            return res.status(err.code).json({
                message: err.message
            })
        default:
            console.log(err)
            res.status(500).json({ message: "Internal server error" })
    }
}