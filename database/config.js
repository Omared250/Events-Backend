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

// Function to execute a SQL query with parameters
const executeQuery = async (query, params) => {
    try {
        const client = await pool.connect();
        const result = await client.query(query, params); // Pass the parameters here
        client.release();
        return result;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

module.exports = { connectToDatabase, executeQuery };