const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const connection  = require("../connector");
const { decrypt_data } = require("../data_processing");

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
 * @api {GET} /friend/request Get Friend Request
 * @apiName GetFriendRequest
 * @apiGroup Friend
 */
router.get("/request", async(req, res) => {
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
            const query = `SELECT User1 AS ${alias} FROM ${table_name} WHERE User2 = ? AND Status = ?`
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
            const Username = decrypt_data(decoded["Data"]);
            const query = `INSERT INTO ${table_name} (User1, User2, Status) VALUES (?, ?, ?)`;
            connection.query(query, [Username, req.body["Username"], status.Pending], async(err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({"Message" : "Database Error!"});
                }
                return res.status(200).json({"Message" : "Friend request sent!"});
            });
        });
        return res.status(200);
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