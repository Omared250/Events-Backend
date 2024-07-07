const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection configuration
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.HOST_IP,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

// Function to connect to the database
const connectToDatabase = async () => {
    try {
        await pool.connect();
        console.log('Connected to the PostgreSQL database');
    } catch (err) {
        console.error('Database connection error', err.stack);
    }
};

// Function to execute a SQL query
const executeQuery = async (query, params) => {
    try {
        const client = await pool.connect();
        // Hardcoded delay using pg_sleep, for example, 5 seconds
        await client.query(`SELECT pg_sleep(${delay})`);
        let result;
        if (params) {
            result = await client.query(query, params); // Pass the parameters here if they exist
        } else {
            result = await client.query(query); // Execute query without parameters
        }
        client.release();
        return result;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

module.exports = { connectToDatabase, executeQuery };