const router = require('express').Router();
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const connection = require('../config/connector');
const {DB_TABLES, ERRORS} = require('../config/constants');
/**
 * Add a task to common task pool (task Name, Description)
 */
router.post("/add", async (req, res) => {
    try {
        if (!("token" in req.headers)) {
            return res.status(401).json(ERRORS.NOT_FOUND("Token"));
        }
        const token = req.headers["token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).json(ERRORS.AUTH);
            }
            const validate = data => {
                const schema = Joi.object({
                    taskName : Joi.string().max(255).required(),
                    taskDescription : Joi.string().max(255).required().allow("")
                });
                return schema.validate(data);
            };
            const { error } = validate(req.body);
            if (error) {
                console.error(error);
                return res.status(400).json({"Message" : error.details[0].message});
            }
            const {taskName, taskDescription} = req.body;
            const query = `INSERT IGNORE INTO ${DB_TABLES.pool.name} (Name, Description) VALUES (?, ?)`;
            connection.query(query, [taskName, taskDescription], async (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json(ERRORS.DB);
                }
                return res.status(201).json({"Message" : "Task added to Pool!"});
            });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json(ERRORS.SERVER);
    }
});

/**
 * Return all 
 */
router.get("/random", async (req, res) => {
    try {
        if (!("token" in req.headers)) {
            return res.status(401).json(ERRORS.NOT_FOUND("Token"));
        }
        const token = req.headers["token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).json(ERRORS.AUTH);
            }
            const alias = "count";
            const query = `SELECT COUNT(*) AS ${alias} FROM ${DB_TABLES.pool.name}`;
            connection.query(query, [], async (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json(ERRORS.DB);
                }
                const toGet = 50;
                const toSkip = Math.max(0, result[0][alias] - toGet);
                const query = `SELECT Name AS "Task Name", Description AS "Task Description" FROM ${DB_TABLES.pool.name} LIMIT ${toSkip}, ${toGet}`;
                connection.query(query, [], async (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json(ERRORS.DB);
                    }
                    return res.status(200).json({"Data" : result});
                });
            });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json(ERRORS.SERVER);
    }
});

module.exports = router;