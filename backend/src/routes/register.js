const router = require('express').Router();
const Joi = require('joi');
const connection = require('../connector');
const { hash_password, jwt_generate_auth_token, encrypt_data } = require('../data_processing');

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
			if (error) return res.status(500).json({"Message" : "Database Error!"});
			if (result.length != 0) {
				return res.status(409).json({"Message" : "Username already exists!"});
			}
			query = `INSERT INTO ${table_name} (Username, Password, Email) VALUES (?, ?, ?)`;
			const passwordHash = await hash_password(Password);
			connection.query(query, [Username, passwordHash, Email], (error, result) => {
				if (error)
					return res.status(500).json({"Message" : "Database Error!"});
				const data = encrypt_data(Username);
				const token = jwt_generate_auth_token(data);
				return res.status(201).json({"Message" : "User registration Successful!", "Data" : token});
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