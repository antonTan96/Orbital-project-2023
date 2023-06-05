const router = require('express').Router();
const  bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const connection = require('../connector');

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).json({"Message" : error.details[0].message});
    }

    const inputs = req.body;
    const table_name = "Users";
    const Email = inputs["Email"]
    const Username = inputs["Username"];
    const Password = inputs["Password"];
    const query = `SELECT Password FROM ${table_name} WHERE Username = BINARY ?`;
    connection.query(query, [Username, Email], async (error, result) => {
      if (error) return res.status(500).json({"Message" : "database error"});
      if (result.length == 0) {
        return res.status(401).json({"Message" : "User has not registered yet!"});
      }

      const passwordCheck = await bcrypt.compare(Password, result[0]["Password"]);
  
      if (passwordCheck) {
        const token = jwt.sign({"Username" : Username}, process.env.JWT_PRIVATE_KEY, {
          "expiresIn" : "7d"
        });
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
    Username: Joi.string().token().min(1).max(255).required().label("Username"),
    Email: Joi.string().email().max(255).required().label("Email"),
    Password: Joi.string().required().label("Password")
  });
  return schema.validate(inputs);
}

module.exports = router;