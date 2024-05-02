const knex = require("knex");
const configDB = require("./knexfile")

module.exports = knex(configDB)