const router = require('express').Router();
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connection = require('../connector');

router.get("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).json({"Message" : error.details[0].message});
    }
    try {
        const inputs = req.body;
        const token = inputs["Token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, (error, decoded) => {
            if (error) {
                console.error(error);
                return res.status(401).json({"Message" : "Authentication Failed!"});
            }
            const Username = decoded["Username"];
            const table_name = "Users";
            const query = `SELECT Email FROM ${table_name} WHERE Username = BINARY ?`;
            connection.query(query, [Username], async (error, result) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({"Message" : "Database Error!"});
                }
                if (result.length == 0) {
                    return res.status(401).json({"Message" : "User not found!"});
                }
                return res.status(200).json({"Email" : result[0]["Email"]});
            });
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
})

router.put("/update", async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        console.error(error);
        return res.status(400).json({"Message" : error.details[0].message});
    }
    try {
        const inputs = req.body;
        if ("Email" in inputs || "Password" in inputs) {
            const token = inputs["Token"];
                jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (error, decoded) => {
                    if (error) {
                        console.error(error);
                        return res.status(401).json({"Message" : "Authentication Failed!"});
                    }
                    const Username = decoded["Username"];
                    const table_name = "Users";
                    const query = `SELECT Email, Password FROM ${table_name} WHERE Username = ?`
                    connection.query(query, [Username], (error, result) => {
                        if (error) {
                            console.error(error);
                            return res.status(500).json({"Message" : "Database Error!"});
                        }
                        let Email = Password = undefined;
                        if ("Email" in inputs) {
                            Email = inputs["Email"];
                        }
                        if ("Password" in inputs) {
                            Password = inputs["Password"];
                        }
                        Email = Email || result[0]["Email"];
                        Password = Password || result[0]["Password"];
                        console.log(`${Username}, ${Email}, ${Password}`);
                        const query = `UPDATE ${table_name} SET Email = ?, Password = ? WHERE Username = ?`;
                        connection.query(query, [Email, Password, Username], async (error, result) => {
                            if (error) {
                                console.error(error);
                                return res.status(500).json({"Message" : "Database Error!"});
                            }
                        });
                    });
                })
        }
        return res.status(200).json({"Message" : "Profile Update Successful!"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
});

router.delete("/delete", async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        console.log(error);
        return res.status(400).json({"Message" : error.details[0].message});
    }
    try {
        const inputs = req.body;
        const token = inputs["Token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (error, decoded) => {
            if (error) {
                console.error(error);
                return res.status(401).json({"Message" : "Authentication Failed!"});
            }
            const Username = decoded["Username"];
            const table_name = "Users"
            const query = `DELETE FROM ${table_name} WHERE Username = ?`;
            connection.query(query, [Username], async (error, result) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({"Message" : "Database Error!"});
                }
                return res.status(200).json({"Message" : "Account deleted successfully!"});
            })
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
})

function validate(inputs) {
    const schema = Joi.object({
        Email: Joi.string().email().max(255).label("Email"),
        Password: Joi.string().label("Password"),
        Token: Joi.string().required().label("Token")
    });
    return schema.validate(inputs)
}


module.exports = router;