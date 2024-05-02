require("dotenv").config({ path: "../.env" })

module.exports = {
    client: 'cockroachdb',
    connection: {
        connectionString: process.env.DB_URL,
    },
    pool: {
        min: 2,  // Minimum number of connections
        max: 100, // Maximum number of connections
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: '../db/migrations',
    },
    seeds: {
        directory: '../db/seeds',
    },
};
