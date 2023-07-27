const router = require('express').Router();
const  bcrypt = require('bcryptjs');
const Joi = require('joi');
const connection = require('../config/connector');
const { encrypt_data, jwt_generate_auth_token } = require('../helpers/data_processing');

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).json({"Message" : error.details[0].message});
    }

    const inputs = req.body;
    const table_name = "Users";
    const Username = inputs["Username"];
    const Password = inputs["Password"];
    const query = `SELECT Password FROM ${table_name} WHERE Username = BINARY ? AND Status = ?`;
    connection.query(query, [Username, "Activated"], async (error, result) => {
      if (error) return res.status(500).json({"Message" : "database error"});
      if (result.length == 0) {
        return res.status(401).json({"Message" : "User has not registered yet!"});
      }

      const passwordCheck = await bcrypt.compare(Password, result[0]["Password"]);
  
      if (passwordCheck) {
        const data = encrypt_data(Username);
        const token = jwt_generate_auth_token(data, "1d");
        return res.status(200).json({"Message" : "User login successful", "Data" : token});
      }
      return res.status(401).json({"Message" : "Incorrect Password!"});
    });  
  } catch (error) {
    console.error(error);
    return res.status(500).json({"Message" : "Internal Server Error!"});
  }
});

function validate(inputs) {
  const schema = Joi.object({
    Username: Joi.string().token().max(255).required().label("Username"),
    Password: Joi.string().required().label("Password")
  });
  return schema.validate(inputs);
}

module.exports = router;