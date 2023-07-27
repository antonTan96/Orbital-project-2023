const router = require('express').Router();
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const connection = require('../config/connector');
const { decrypt_data, hash_password } = require('../helpers/data_processing');
const { DB_TABLES, ERRORS } = require('../config/constants');

router.get("/", async (req, res) => {
    try {
        if (!("token" in req.headers)) {
            return res.status(401).json(ERRORS.NOT_FOUND("Token"));
        }
        const inputs = req.headers;
        const token = inputs["token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, (error, decoded) => {
            if (error) {
                console.error(error);
                return res.status(401).json({"Message" : "Authentication Failed!"});
            }
            const Username = decrypt_data(decoded["Data"]);
            const query = `SELECT Email FROM ${DB_TABLES.user} WHERE Username = BINARY ?`;
            connection.query(query, [Username], async (error, result) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json(ERRORS.DB);
                }
                if (result.length == 0) {
                    return res.status(400).json(ERRORS.NOT_FOUND("User"));
                }
                return res.status(200).json({"Email" : result[0]["Email"]});
            });
        });
        return res.status(200); // At least a response is return
    } catch (error) {
        console.error(error);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
});

router.put("/update", async (req, res) => {
    try {
        if (!("token" in req.headers))
            return res.status(401).json(ERRORS.NOT_FOUND("Token"));

        const token = (req.headers)["token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).json(ERRORS.AUTH);
            }
            const { error } = validate(req.body);
            if (error) {
                console.error(error);
                return res.status(400).json({"Message" : error.details[0].message});
            }
            const inputs = req.body;
            const Username = decrypt_data(decoded["Data"]);
            const query = `SELECT Email, Password FROM ${DB_TABLES.user} WHERE Username = BINARY ?`
            connection.query(query, [Username], async (error, result) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json(ERRORS.DB);
                }
                if (result.length == 0) {
                    return res.status(400).json(ERRORS.NOT_FOUND("User"));
                }
                const Email = inputs["Email"] || result[0]["Email"]
                let Password = undefined;
                Password = inputs["Password"];
                if (Password.length == 0) {
                    Password = result[0]["Password"];
                } else {
                    Password = await hash_password(Password);
                }
                const query = `UPDATE ${DB_TABLES.user} SET Email = ?, Password = ? WHERE Username = BINARY ?`;
                connection.query(query, [Email, Password, Username], async (error, result) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({"Message" : "Database Error!"});
                    }
                    return res.status(200).json({"Message" : "Profile update successful!"});
                });
            });
        });    
        return res.status(200); // To make sure a response is return
    } catch (error) {
        console.error(error);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
});

router.delete("/delete", async (req, res) => {
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
            const query = `SELECT * FROM ${DB_TABLES.user} WHERE Username = BINARY ?`;
            connection.query(query, [Username], async (err, result) => {
                if (err) {
                    return res.status(500).json(ERRORS.DB);
                }
                if (result.length == 0) {
                    return res.status(400).json(ERRORS.NOT_FOUND("User"));
                }
                const query = `DELETE FROM ${DB_TABLES.user} WHERE Username = BINARY ?`;
                connection.query(query, [Username], async (error, result) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json(ERRORS.DB);
                    }
                    return res.status(200).json({"Message" : "Account deleted successfully!"});
            })
            });
            
        });
        return res.status(200); // at least a response is return
    } catch (error) {
        console.error(error);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
});

/**
 * Search users by given prefix username
 */
router.post("/search", async(req, res) => {
    try {
        if (!("token" in req.headers))
            return res.status(401).json({"Message" : "Token not found!"});

        const token = (req.headers)["token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).json({"Message" : "Authentication failed!"});
            }
            function validate(data) {
                const schema = Joi.object({
                    Prefix: Joi.string().token().max(255).required().allow("")
                });
                return schema.validate(data);
            };
            const { error } = validate(req.body);
            if (error) {
                console.error(error);
                return res.status(400).json({"Message" : error.details[0].message});
            }
            const prefix = mysql.escape((req.body)["Prefix"]);
            const Username = decrypt_data(decoded["Data"]);
            // const query = `SELECT ${DB_TABLES.user}.Username AS Users, ${DB_TABLES.friend}.Status AS Friend Status
            //                 FROM ${DB_TABLES.user} LEFT JOIN ${DB_TABLES.friend} ON Users = ${DB_TABLES.friend}.User2
            //                 WHERE BINARY Users LIKE ? AND ${DB_TABLES.friend}.user1 = ? ORDER BY Username ASC`;
            const query = `SELECT DISTINCT ${DB_TABLES.user}.Username AS "Users", IF(${DB_TABLES.friend}.Status = "Pending",
                            IF(${DB_TABLES.friend}.User1 = ?, "Sent", "Received"), IFNULL(${DB_TABLES.friend}.Status, "Nothing"))
                            AS "Friend Status" FROM ${DB_TABLES.user} LEFT JOIN ${DB_TABLES.friend} ON
                            (${DB_TABLES.user}.Username = BINARY ${DB_TABLES.friend}.User1 AND ${DB_TABLES.friend}.User2 = BINARY ?) OR
                            (${DB_TABLES.user}.Username = BINARY ${DB_TABLES.friend}.User2 AND ${DB_TABLES.friend}.User1 = BINARY ?) WHERE
                            BINARY ${DB_TABLES.user}.Username LIKE ? AND BINARY ${DB_TABLES.user}.Username != ? AND ${DB_TABLES.user}.Status = ?
                            ORDER BY ${DB_TABLES.user}.Username`
            connection.query(query, [Username, Username, Username, `${prefix.slice(1, prefix.length - 1)}%`, Username, "Activated"], (error, result) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({"Message" : "Database Error!"});
                }
                return res.status(200).json({"Data" : result});
            });
        });
        return res.status(200); // Just to make sure at least a response is made
    } catch (error) {
        console.error(error);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
});

function validate(inputs) {
    const schema = Joi.object({
        Email: Joi.string().email().required().allow("").max(255).label("Email"),
        Password: Joi.string().required().allow("").label("Password"),
    });
    return schema.validate(inputs)
}

module.exports = router;