const { Pool } = require("pg");

const pool = new Pool({
    user: "adumitru",
    host: "localhost",
    database: "ERP",
    password: "Alin.Dumitru1987!",
    port: 5432, // portul default PostgreSQL
});

module.exports = pool;
