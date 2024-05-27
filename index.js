const express = require('express');
const { connectToDatabase, executeQuery } = require('./database/config');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// create express server
const app = express();

// DataBase
connectToDatabase();

// Read and Parse fo the body
app.use(express.json());

// Create a new task
app.post('/task', async (req, res) => {
    const { title, description, dateTime, priority, id, isCompleted, completedDate } = req.body;
    const query = `
    INSERT INTO tasks (id, title, description, dateTime, priority, isCompleted, completedDate)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
    const params = [id, title, description, dateTime, priority, isCompleted, completedDate];

    try {
        const result = await executeQuery(query, params);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// listen petitions
app.listen(process.env.PORT, () => {
    console.log(`Server running at port ${process.env.PORT}`);
})