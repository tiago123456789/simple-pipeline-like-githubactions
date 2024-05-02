module.exports = {
    client: 'cockroachdb',
    connection: {
        connectionString: process.env.DB_URL,
    },
    pool: {
        min: 1,
        max: 1,
    }
};
