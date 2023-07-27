const router = require('express').Router();
const Joi = require('joi');
const connection = require('../config/connector');
const { hash_password, jwt_generate_auth_token, encrypt_data } = require('../helpers/data_processing');
const {sendEmail} = require('../helpers/email');
const {DB_TABLES} = require('../config/constants');

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error) {
			return res.status(400).json({"Message" : error.details[0].message});
		}

		const table_name = "Users";
		const inputs = req.body;
		const Email = inputs["Email"];
    	const Username = inputs["Username"];
    	const Password = inputs["Password"];

		let query = `SELECT * FROM ${table_name} WHERE Username = BINARY ?`;

		connection.query(query, [Username, Email], async (error, result) => {
			if (error) {
				console.error(error);
				return res.status(500).json({"Message" : "Database Error!"});
			}
			if (result.length != 0) {
				return res.status(409).json({"Message" : "Username already exists!"});
			}
			query = `INSERT INTO ${DB_TABLES.user} (Username, Password, Email, Status) VALUES (?, ?, ?, ?)`;
			const passwordHash = await hash_password(Password);
			connection.query(query, [Username, passwordHash, Email, "Pending"], (error, result) => {
				if (error) {
					console.error(error);
					return res.status(500).json({"Message" : "Database Error!"});
				}
				const data = encrypt_data(Username);
				const token = jwt_generate_auth_token(data, "15m");
				sendEmail(Email, token);
				setTimeout(() => {
					const query = `DELETE FROM ${DB_TABLES.user} WHERE Username = BINARY ? AND Status = ?`;
					connection.query(query, [Username, "Pending"], async (err, result) => {
						if (err) {
							console.error(err);
						}
					});
				}, 15 * 60 * 1000);
				return res.status(201).json({"Message" : "User registration Successful, please check you email to activate your account in 15 minutes!"});
			});
		});
		
	} catch (error) {
		console.error(error);
		return res.status(500).json({"Message" : "Internal Server Error"});
	}
});

function validate(inputs) {
	const schema = Joi.object({
		Username: Joi.string().token().max(255).required(),
		Email: Joi.string().email().max(255).required(),
		Password: Joi.string().required()
	});
	return schema.validate(inputs);
}

module.exports = router;