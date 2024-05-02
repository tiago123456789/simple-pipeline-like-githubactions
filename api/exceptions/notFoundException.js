
class NotFoundException extends Error {

    constructor(message, code = 404) {
        super(message)
        this.code = code
        this.name = "NotFoundException"
    }

}

module.exports = NotFoundException