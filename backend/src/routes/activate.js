const router = require('express').Router();
const jwt = require('jsonwebtoken');
const connection = require('../config/connector');
const {DB_TABLES, ERRORS} = require('../config/constants');
const {jwt_generate_auth_token, decrypt_data} = require('../helpers/data_processing');

router.patch("/", async (req, res) => {
    try {
        if (!("token" in req.headers))
            return res.status(401).json(ERRORS.NOT_FOUND("Token"));
        const token = req.headers["token"];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).json(ERRORS.AUTH);
            }
            const Username = decrypt_data(decoded["Data"]);
            const query = `UPDATE ${DB_TABLES.user} SET Status = ? WHERE Username = BINARY ? AND Status = ?`;
            connection.query(query, ["Activated", Username, "Pending"], async (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json(ERRORS.DB);
                }
                const loginToken = jwt_generate_auth_token(decoded["Data"], "1d");
                return res.status(200).json({"Message" : "User account activation successful!", "Data" : {
                    "Token" : loginToken,
                    "Username" : Username
                }});
            });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json(ERRORS.SERVER);
    }
});

module.exports = router;