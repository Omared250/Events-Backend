const { executeQuery } = require("../database/config");
const logger = require("../winston-config");

// Introduce a sleep function to create a delay
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const handleError = (err, res, action) => {
    const statusCode = err.response ? err.response.status : 500;
    const message = err.response && err.response.data ? err.response.data.msg : `An unexpected error occurred with ${action}`;
    const stack = err.stack;
    const errorDetails = {
        action,
        statusCode,
        message,
        stack,
        url: err.config ? err.config.url : undefined,
    };

    logger.error(errorDetails);

    res.status(statusCode).json({
        ok: false,
        msg: message
    });
};

// Get Uncompleted Tasks
const getUncompletedTasks = async (req, res) => {
    const { userId } = req.query;
    const query = `SELECT * FROM tasks WHERE "userId" = $1 AND "isCompleted" = false`;
    const params = [userId];
    try {
        const result = await executeQuery(query, params, 0);
        logger.info(`Uncompleted tasks retrieved for user ${userId}`);
        res.status(200).json(result.rows);
    } catch (error) {
        handleError(err, res, 'getUncompletedTasks');
        res.status(500).json({ error: error.message });
        throw err;
    }
};

// Get completed tasks
const getCompletedTasks = async (req, res) => {
    const { userId } = req.query;
    const query = `SELECT * FROM tasks WHERE "userId" = $1 AND "isCompleted" = true`;
    const params = [userId];
    try {
        const result = await executeQuery(query, params, 1);
        logger.info(`Completed tasks retrieved for user ${userId}`);
        res.status(200).json(result.rows);
    } catch (err) {
        handleError(err, res, 'getCompletedTasks');
        res.status(500).json({ error: err.message });
        throw err;
    }
};

// Craete a Task
const createTask = async (req, res) => {
    const { title, description, dateTime, priority, id, isCompleted, completedDate, userId } = req.body;
    const query = `
    INSERT INTO tasks (id, "userId", title, description, "dateTime", priority, "isCompleted", "completedDate")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
    const params = [id, userId, title, description, dateTime, priority, isCompleted, completedDate];

    try {
        const result = await executeQuery(query, params, 1);
        await sleep(1000);
        logger.info(`Task created with ID ${id} for user ${userId}`);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        handleError(err, res, 'createTask');
        res.status(500).json({ error: error.message });
        throw err;
    }
};

// Update a Task
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, dateTime, priority } = req.body.requestBody;

    const query = `UPDATE tasks SET title = $2, description = $3, "dateTime" = $4, priority = $5 WHERE id = $1 RETURNING *`;
    const params = [id, title, description, dateTime, priority];

    try {
        const result = await executeQuery(query, params, 0.7);
        logger.info(`Task with ID ${id} updated`);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        handleError(err, res, 'updateTask');
        res.status(500).json({ error: error.message });
        throw err;
    }
};

// Delete a Task
const deleteTask = async (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM tasks WHERE id = $1`;
    const params = [id];

    try {
        await executeQuery(query, params, 0.8);
        logger.info(`Task with ID ${id} deleted`);
        res.status(204).send();
    } catch (error) {
        handleError(err, res, 'deleteTask');
        res.status(500).json({ error: error.message });
        throw err;
    }
};

// Complete a task
const completeTask = async (req, res) => {
    const { id } = req.params;
    const completedDate = new Date();

    const query = `UPDATE tasks SET "isCompleted" = true, "completedDate" = $2 WHERE id = $1 RETURNING *`;
    const params = [id, completedDate];

    try {
        const result = await executeQuery(query, params, 0.9);
        logger.info(`Task with ID ${id} marked as completed`);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        handleError(err, res, 'completeTask');
        res.status(500).json({ error: error.message });
        throw err;
    }
};

// retake a task
const retakeTask = async (req, res) => {
    const { id } = req.params;

    const query = `UPDATE tasks SET "isCompleted" = false, "completedDate" = null WHERE id = $1 RETURNING *`;
    const params = [id];

    try {
        const result = await executeQuery(query, params, 0.9);
        logger.info(`Task with ID ${id} marked as not completed`);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        handleError(err, res, 'retakeTask');
        res.status(500).json({ error: error.message });
        throw err;
    }
};

module.exports = {
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    retakeTask,
    getUncompletedTasks,
    getCompletedTasks
}