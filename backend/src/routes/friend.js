const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const connection  = require("../config/connector");
const { decrypt_data } = require("../helpers/data_processing");
const { ERRORS, DB_TABLES } = require('../config/constants');

const table_name = "Friends";
const status = {
    Pending: "Pending",
    Accepted: "Accepted"
}
/**
 * @api {GET} /friend/ Get Friend List
 * @apiName GetFriendList
 * @apiGroup Friend
 * 
 * @apiDescription Retrieves a list of friends of a user.
 */
router.get("/", async(req, res) => {
    try {
        if (!("token" in req.headers)) {
            return res.status(401).json({"Message" : "Token not found!"});
        }
        const token = (req.headers)["token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async(err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).json({"Message" : "Authentication failed!"});
            }
            const Username = decrypt_data(decoded["Data"]);
            const alias = "Friends"
            const query = `(SELECT User1 AS ${alias} FROM ${table_name} WHERE User2 = ? AND Status = ?) UNION 
                           (SELECT User2 AS ${alias} FROM ${table_name} WHERE User1 = ? AND Status = ?) ORDER BY 
                           ${alias}`
            connection.query(query, [Username, status.Accepted, Username, status.Accepted], async(err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({"Message" : "Database Error!"});
                }
                return res.status(200).json({"Data" : result});
            });
        });
        return res.status(200);
    } catch (error) {
        console.error(error);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
});

/**
 * @api {GET} /friend/received Get Received Friend Request
 * @apiName GetReceivedFriendRequest
 * @apiGroup Friend
 */
router.get("/receive", async(req, res) => {
    try {
        if (!("token" in req.headers)) {
            return res.status(401).json({"Message" : "Token not found!"});
        }
        const token = (req.headers)["token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async(err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).json({"Message" : "Authentication failed!"});
            }
            const Username = decrypt_data(decoded["Data"]);
            const alias = "Username";
            const query = `SELECT User1 AS ${alias} FROM ${table_name} WHERE User2 = BINARY ? AND Status = ?`
            connection.query(query, [Username, status.Pending], async(err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({"Message" : "Database Error!"});
                }
                return res.status(200).json({"Data" : result});
            });
        });
        return res.status(200);
    } catch(err) {
        console.error(err);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
});

/**
 * @api {GET} /friend/sent Get Sent Friend Request
 */
router.get("/sent", async(req, res) => {
    try {
        if (!("token") in req.headers) {
            return res.status(401).json(ERRORS.NOT_FOUND("Token"));
        }
        const token = (req.headers)["token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).json(ERRORS.AUTH);
            }
            const Username = decrypt_data(decoded["Data"]);
            const alias = "Username";
            const query = `SELECT User2 AS ${alias} FROM ${DB_TABLES.friend} WHERE User1 = BINARY ? AND Status = ?`;
            connection.query(query, [Username, status.Pending], async (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json(ERRORS.DB);
                }
                return res.status(200).json({"Data" : result});
            });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json(ERRORS.SERVER);
    }
});

/**
 * Send Friend Request
 */
router.post("/send", async(req, res) => {
    try {
        if (!("token" in req.headers)) {
            return res.status(401).json({"Message" : "Token not found!"});
        }
        const token = (req.headers)["token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async(err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).json({"Message" : "Authentication failed!"});
            }
            const validate = data => {
                const schema = Joi.object({
                    Username: Joi.string().token().max(255).required()
                });
                return schema.validate(data);
            };
            const {error} = validate(req.body);
            if (error) {
                console.error(error);
                return res.status(400).json({"Message" : error.details[0].message});
            }
            const query = `SELECT Username FROM ${DB_TABLES.user} WHERE Username = ?`;
            connection.query(query, req.body["Username"], async (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json(ERRORS.DB);
                }
                if (result.length == 0) {
                    return res.status(400).json(ERRORS.NOT_FOUND(req.body["Username"]));
                }
                const Username = decrypt_data(decoded["Data"]);
                const query = `SELECT IF(Status = "Pending", IF(User1 = ?, "Sent", "Received"), Status) AS Status FROM ${DB_TABLES.friend} WHERE (User1 = ? AND User2 = ?) OR (User1 = ? AND User2 = ?)`;
                connection.query(query, [Username, Username, req.body["Username"], req.body["Username"], Username], async(err, result) => {
                    if(err) {
                        console.error(err);
                        return res.status(500).json(ERRORS.DB);
                    }
                    if (result.length != 0) {
                        const stat = result[0]["Status"];
                        const message = stat == "Accepted" ? "Both of you are friends already!" 
                                                           : stat == "Sent"
                                                           ? "Friend request sent before!"
                                                           : "Friend request still pending! Please check your received friend requests!";
                        return res.status(400).json({"Message" : message});
                    }
                    const query = `INSERT INTO ${table_name} (User1, User2, Status) VALUES (?, ?, ?)`;
                    connection.query(query, [Username, req.body["Username"], status.Pending], async(err, result) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({"Message" : "Database Error!"});
                        }
                        return res.status(200).json({"Message" : "Friend request sent!"});
                    });
                });
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
});

/**
 * Cancel sent friend reqeust
 */
router.delete("/cancel", async(req, res) => {
    try {
        if (!("token" in req.headers)) {
            return res.status(401).json({"Message" : "Token not found!"});
        }
        const token = (req.headers)["token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async(err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).json({"Message" : "Authentication failed!"});
            }
            const validate = data => {
                const schema = Joi.object({
                    Username: Joi.string().token().max(255).required()
                });
                return schema.validate(data);
            };
            const {error} = validate(req.body);
            if (error) {
                console.error(error);
                return res.status(400).json({"Message" : error.details[0].message});
            }
            const Username = decrypt_data(decoded["Data"]);
            const query = `DELETE FROM ${table_name} WHERE User1 = ? AND User2 = ? AND Status = ?`;
            connection.query(query, [Username, req.body["Username"], status.Pending], async(err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({"Message" : "Database Error!"});
                }
                return res.status(200).json({"Message" : "Operation Successful!"});
            });
        });
        return res.status(200);
    } catch (error) {
        console.error(error);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
});

/**
 * Accept Friend Request
 */
router.patch("/accept", async(req, res) => {
    try {
        if (!("token" in req.headers)) {
            return res.status(401).json({"Message" : "Token not found!"});
        }
        const token = (req.headers)["token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async(err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).json({"Message" : "Authentication failed!"});
            }
            const validate = data => {
                const schema = Joi.object({
                    Username: Joi.string().token().max(255).required()
                });
                return schema.validate(data);
            };
            const {error} = validate(req.body);
            if (error) {
                console.error(error);
                return res.status(400).json({"Message" : error.details[0].message});
            }
            const Username = decrypt_data(decoded["Data"]);
            const query = `UPDATE ${table_name} SET Status = ? WHERE User1 = ? AND User2 = ? AND Status = ?`;
            connection.query(query, [status.Accepted, req.body["Username"], Username, status.Pending], async(err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({"Message" : "Database Error!"});
                }
                return res.status(200).json({"Message" : "Added as friends!"});
            });
        });
        return res.status(200);
    } catch (error) {
        console.error(error);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
});

/**
 * Reject Friend Request 
 */
router.delete("/reject", async(req, res) => {
    try {
        if (!("token" in req.headers)) {
            return res.status(401).json({"Message" : "Token not found!"});
        }
        const token = (req.headers)["token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async(err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).json({"Message" : "Authentication failed!"});
            }
            const validate = data => {
                const schema = Joi.object({
                    Username: Joi.string().token().max(255).required()
                });
                return schema.validate(data);
            };
            const {error} = validate(req.body);
            if (error) {
                console.error(error);
                return res.status(400).json({"Message" : error.details[0].message});
            }
            const Username = decrypt_data(decoded["Data"]);
            const query = `DELETE FROM ${table_name} WHERE User1 = ? AND User2 = ? AND Status = ?`;
            connection.query(query, [req.body["Username"], Username, status.Pending], async(err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({"Message" : "Database Error!"});
                }
                return res.status(200).json({"Message" : "Friend Request Rejected!"});
            });
        });
        return res.status(200);
    } catch (error) {
        console.error(error);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
});

/**
 * Remove Friend (Unfriend)
 */
router.delete("/remove", async(req, res) => {
    try {
        if (!("token" in req.headers)) {
            return res.status(401).json({"Message" : "Token not found!"});
        }
        const token = (req.headers)["token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async(err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).json({"Message" : "Authentication failed!"});
            }
            const validate = data => {
                const schema = Joi.object({
                    Username: Joi.string().token().max(255).required()
                });
                return schema.validate(data);
            };
            const {error} = validate(req.body);
            if (error) {
                console.error(error);
                return res.status(400).json({"Message" : error.details[0].message});
            }
            const Username = decrypt_data(decoded["Data"]);
            const query = `DELETE FROM ${table_name} WHERE (User1 = ? AND User2 = ? AND Status = ?) OR (User1 = ? AND User2 = ? AND Status = ?)`
            connection.query(query, [Username, req.body["Username"], status.Accepted, req.body["Username"], Username, status.Accepted], async(err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({"Message" : "Database Error!"});
                }
                return res.status(200).json({"Message" : "Removed as friend"});
            });
        });
        return res.status(200);
    } catch (error) {
        console.error(error);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
});
module.exports = router;