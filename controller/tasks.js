const { executeQuery } = require("../database/config");

// Craete a Task
const createTask = async (req, res) => {
    const { title, description, dateTime, priority, id, isCompleted, completedDate } = req.body.requestBody;
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
};

// Update a Task
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, dateTime, priority } = req.body;

    const query = `UPDATE tasks SET title = $2, description = $3, dateTime = $4, priority = $5 WHERE id = $1 RETURNING *`;
    const params = [id, title, description, dateTime, priority];

    try {
        const result = await executeQuery(query, params);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a Task
const deleteTask = async (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM tasks WHERE id = $1`;
    const params = [id];

    try {
        const result = await executeQuery(query, params);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Complete a task
const completeTask = async (req, res) => {
    const { id } = req.params;
    const completedDate = new Date();

    const query = `UPDATE tasks SET isCompleted = true, completedDate = $2 WHERE id = $1 RETURNING *`;
    const params = [id, completedDate];

    try {
        const result = await executeQuery(query, params);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Complete a task
const retakeTask = async (req, res) => {
    const { id } = req.params;

    const query = `UPDATE tasks SET isCompleted = false, completedDate = null WHERE id = $1 RETURNING *`;
    const params = [id];

    try {
        const result = await executeQuery(query, params);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    retakeTask
}