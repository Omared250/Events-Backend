const express = require('express');
const { connectToDatabase, executeQuery } = require('./database/config');
require('dotenv').config();

// create express server
const app = express();

// DataBase
connectToDatabase();

// Read and Parse fo the body
app.use(express.json());

// Routes
app.use('/api/tasks', require('./routes/tasks'));

// listen petitions
app.listen(process.env.PORT, () => {
    console.log(`Server running at port ${process.env.PORT}`);
})