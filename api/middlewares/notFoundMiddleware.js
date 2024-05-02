module.exports = (req, res) => {
    res.status(404).json({
        route: req.path,
        message: "Route not found."
    })
}