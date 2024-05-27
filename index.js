const express = require('express');
const { connectToDatabase, executeQuery } = require('./database/config');
require('dotenv').config();

// create express server
const app = express();

// DataBase
connectToDatabase();

// Endpoint to create a table
app.get('/create-table', async (req, res) => {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS example_table (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100)
            )
        `;
        await executeQuery(createTableQuery);
        res.send('Table created successfully.');
    } catch (error) {
        res.status(500).send('Error creating table: ' + error.message);
    }
});

// Endpoint to delete a table
app.get('/delete-table', async (req, res) => {
    try {
        const deleteTableQuery = 'DROP TABLE IF EXISTS example_table';
        await executeQuery(deleteTableQuery);
        res.send('Table deleted successfully.');
    } catch (error) {
        res.status(500).send('Error deleting table: ' + error.message);
    }
});

// listen petitions
app.listen( process.env.PORT, () => {
    console.log(`Server running at port ${ process.env.PORT }`);
})