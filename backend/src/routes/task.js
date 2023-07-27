const router = require('express').Router();
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const connection = require('../config/connector');
const { decrypt_data } = require('../helpers/data_processing');
const { DB_TABLES, DEFAULT_RESPONSE, ERRORS } = require('../config/constants');

router.get("/", async (req, res) => {
    try {
        if (!("token" in req.headers)) {
            return res.status(401).json({"Message" : "Token not found!"});
        }
        const inputs = req.headers;
        const token = inputs["token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (error, decoded) => {
            if (error) {
                console.error(error);
                return res.status(401).json({"Message" : "Authentication Failed!"});
            }
            const Username = decrypt_data(decoded["Data"]);
            const query = `SELECT ID AS "Task ID", Name AS "Task Name", Description AS "Task Description",
                            CAST (Curr as UNSIGNED) as "Is Current", Deadline FROM ${DB_TABLES.task} 
                            WHERE Username = BINARY ? ORDER BY Curr DESC, Deadline`;
            connection.query(query, [Username], async (error, result) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({"Message" : "Database Error!"});
                }
                return res.status(200).json({"Data" : result});
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
});

router.post("/add", async (req, res) => {
    try {
        if (!("token" in req.headers)) {
            return res.status(401).json({"Message" : "Token not found!"});
        }

        const token = req.headers["token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).json({"Message" : "Authentication Failed!"});
            }        
            function validate(data) {
                const schema = Joi.object({
                    taskName: Joi.string().max(255).required(),
                    taskDescription: Joi.string().max(255).required().allow(""),
                    taskEndTime: Joi.string().max(64).required().allow(""),
                    taskIssuer: Joi.string().max(255).required().allow(""),
                    taskGetter: Joi.string().max(255).required().allow("")
                });
                return schema.validate(data);
            }

            const { error } = validate(req.body);
            if (error) {
                return res.status(400).json({"Message" : error.details[0].message});
            }
            const inputs = req.body;
            let Username, Name, Description, Deadline, Issuer;
            if ("taskGetter" in inputs)
                Username = inputs["taskGetter"];
            if ("taskName" in inputs) 
                Name = inputs["taskName"];
            if ("taskDescription" in inputs)
                Description = inputs["taskDescription"];
            if ("taskEndTime" in inputs)
                Deadline = inputs["taskEndTime"];
            if ("taskIssuer" in inputs)
                Issuer = inputs["taskIssuer"]
            Username = Username || decrypt_data(decoded["Data"]);
            Name = Name || "";
            Description = Description || "";
            Deadline = Deadline || "9999-12-30";
            Issuer = Issuer || decrypt_data(decoded["Data"]);
            if (Deadline.length == 10)
                Deadline = Deadline + "T23:59:59";
            const convertedDeadline = new Date(Deadline).getTime();
            if (convertedDeadline < new Date().getTime())
                return res.status(400).json({"Message": "Deadline cannot be in the past!"});
            const query = `SELECT Username FROM ${DB_TABLES.user} WHERE Username = BINARY ?`;
            connection.query(query, [Username], async (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json(ERRORS.DB);
                }
                if (result.length == 0) {
                    return res.status(400).json({"Message" : "The user assigned with the task does not exists!"});
                }
                const query = `INSERT INTO ${DB_TABLES.task} (Username, Name, Description, Deadline, Issuer, Curr) VALUES (?, ?, ?, ?, ?, ?)`;
                connection.query(query, [Username, Name, Description, Deadline.slice(0, 19), Issuer, 0], async (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json(ERRORS.DB);
                    }
                    // To-do: Make a cron scheduler for reminder, or maybe timeout with long ass duration lmao
                    const query = `SELECT ID FROM ${DB_TABLES.task} WHERE
                                     Username = ? AND Name = ? AND Description = ? AND Deadline = ? AND Issuer = ? AND Curr = ?
                                     ORDER BY ID DESC`;
                    connection.query(query, [Username, Name, Description, Deadline.slice(0, 19), Issuer, 0], async (err, result) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json(ERRORS.DB);
                        }
                        return res.status(200).json({"Message" : "Task added successfully!", "Data" : result[0]["ID"]});
                    });
                });

            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json(ERRORS.SERVER);
    }
});

router.delete("/delete", async (req, res) => {
    try {
        if (!("token" in req.headers)) {
            return res.status(401).json({"Message" : "token not found!"});
        }

        const token = req.headers["token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).json({"Message" : "Authentication Failed!"});
            }

            const inputs = req.body;
            function validate(data) {
                const schema = Joi.object({
                    taskID: Joi.number().integer().min(1).max(Number.MAX_SAFE_INTEGER).required()
                });
                return schema.validate(data);
            }
            const { error } = validate(req.body);
            if (error) {
                return res.status(400).json({"Message" : error.details[0].message});
            }

            const Username = decrypt_data(decoded["Data"]);
            const ID = inputs["taskID"];
            const query = `DELETE FROM ${DB_TABLES.task} WHERE ID = BINARY ? AND Username = BINARY ?`;
            connection.query(query, [ID, Username], async(error, result) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({"Message" : "Database Error!"});
                }
            });
            return res.status(200).json({"Message" : "Task deletion succesful!"});
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
});

router.patch("/current", async (req, res) => {
    try {
        if (!("token" in req.headers)) {
            return res.status(401).json({"Message" : "Token not found!"});
        }
        const token = req.headers["token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async(err, decoded) => {
            if (err) {
                return res.status(401).json({"Message" : "Authentication failed!"});
            }
            const inputs = req.body;
            const validate = (data) => {
                const schema = Joi.object({
                    taskID: Joi.number().integer().min(1).max(Number.MAX_SAFE_INTEGER).required()
                });
                return schema.validate(data);
            }
            const { error } = validate(inputs);
            if (error) {
                return res.status(400).json({"Message" : error.details[0].message});
            } 
            const ID = inputs["taskID"];
            const Username = decrypt_data(decoded["Data"]);
            const query = `SELECT ID FROM ${DB_TABLES.task} WHERE Username = ? AND ID = ?`;
            connection.query(query, [Username, ID], async(err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({"Message" : "Database Error!"});
                }
                if (result.length == 0) {
                    return res.status(400).json({"Message" : "The current user does not have any task with the given Task ID!"});
                }
                // Remove the "current" status for a previously set task
                let query = `UPDATE ${DB_TABLES.task} SET Curr = 0 WHERE Username = ? AND Curr = 1`;
                connection.query(query, [Username], (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({"Message" : "Database Error!"});
                    }
                });
                // Set the given task as "current"
                query = `UPDATE ${DB_TABLES.task} SET Curr = 1 WHERE Username = ? AND ID = ?`;
                connection.query(query, [Username, ID], (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({"Message" : "Database Error!"});
                    }
                    return res.status(200).json({"Message" : "Operation Successful!"});
                });
            });
            return res.status(200);
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
});

router.get("/current", async (req, res) => {
    try {
        if (!("token" in req.headers)) {
            return res.status(401).json({"Message" : "Token not found!"});
        }
        const token = (req.headers)["token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).json({"Message" : "Authentication Failed!"});
            }
            const Username = decrypt_data(decoded["Data"]);
            const query = `SELECT ID as "Task ID", Name as "Task Name", Deadline FROM ${DB_TABLES.task} WHERE Username = BINARY ? AND Curr = 1`;
            connection.query(query, [Username], (err, res) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({"Message" : "Database Error!"});
                }
                return res.status(200).json({"Data" : res});
            });
        });
        return res.status(200);
    } catch (err) {
        console.error(err);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
});

module.exports = router;