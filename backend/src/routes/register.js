const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const connection = require('../connector');

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error) {
			return res.status(400).json({"Message" : error.details[0].message});
		}

		const table_name = "Users";
		const inputs = req.body;
		const Email = inputs["Email"]
    	const Username = inputs["Username"];
    	const Password = inputs["Password"];

		let query = `SELECT * FROM ${table_name} WHERE Username = BINARY ?`;

		connection.query(query, [Username, Email], async (error, result) => {
			if (error) return res.status(500).json({"Message" : "Database Error!"});
			if (result.length != 0) {
				return res.status(409).json({"Message" : "Username already exists!"});
			}
			query = `INSERT INTO ${table_name} (Username, Password, Email) VALUES (?, ?, ?)`;
			const hashPassword = await bcrypt.hash(Password, bcrypt.genSaltSync(12));
			connection.query(query, [Username, hashPassword, Email]);
			return res.status(201).json({"Message" : "User registration Successful!"});
		});
		
	} catch (error) {
		console.error(error);
		return res.status(500).json({"Message" : "Internal Server Error"});
	}
});

function validate(inputs) {
	const schema = Joi.object({
		Username: Joi.string().min(1).max(255).required().label("Username"),
		Email: Joi.string().email().max(255).required().label("Email"),
		Password: Joi.string().required().label("Password")
	});
	return schema.validate(inputs);
}

module.exports = router;