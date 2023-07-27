const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const {ERRORS} = require('../config/constants');
const {decrypt_data} = require('../helpers/data_processing');

router.post("/", async (req, res) => {
    try {
        const validate = data => {
            const schema = Joi.object({
                User: Joi.string().token().max(255).required(),
                Token: Joi.string().required()
            });
            return schema.validate(data);
        };
        const {error} = validate(req.body);
        if (error) {
            return res.status(400).json({"Message" : error.details[0].message});
        }
        const {User, Token} = req.body;
        jwt.verify(Token, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
            if (err) {
                return res.status(400).json({"Message" : "Invalid Token!"});
            }
            const Username = decrypt_data(decoded["Data"]);
            return res.status(200).json({"Data" : User == Username});
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json(ERRORS.SERVER);
    }
});

module.exports = router;