const router = require('express').Router();
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const connection = require('../connector');

router.get("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
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
            const table_name = "Tasks";
            const query = `SELECT * FROM ${table_name} WHERE Username = ?`;
            connection.query(query, [Username], async (error, result) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({"Message" : "Database Error!"});
                }
                return res.status(200).json({"Data" : result});
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
});

router.post("/add", async (req, res) => {
    const { error } = validate2(req.body);
    if (error) {
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
            let Username, Name, Description, Deadline, Issuer;
            const table_name = "tasks";
            if ("Username" in inputs)
                Username = inputs["Username"]
            if ("taskName" in inputs) 
                Name = inputs["taskName"];
            if ("taskDescription" in inputs)
                Description = inputs["taskDescription"];
            if ("taskEndTime" in inputs)
                Deadline = inputs["taskEndTime"];
            if ("taskIssuer" in inputs)
                Issuer = inputs["taskIssuer"]
            Username = Username || decoded["Username"];
            Name = Name || "";
            Description = Description || "";
            Deadline = Deadline || "";
            Issuer = Issuer || "";
            const convertedDeadline = new Date(Deadline).getTime();
            if (convertedDeadline < new Date().getTime())
                return res.status(400).json({"Message": "Deadline cannot be in the past!"})
            const query = `INSERT INTO ${table_name} (Username, Name, Description, Deadline, Issuer) VALUES (?, ?, ?, ?, ?)`;
            connection.query(query, [Username, Name, Description, Deadline, Issuer], async (error, result) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({"Message" : "Database Error!"});
                }
                res.status(200).json({"Message" : "Tasks added successfully!"});
            });
            
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
});

router.delete("/delete", async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
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
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({"Message" : "Internal Server Error!"});
    }
});

function validate(data) {
    const schema = Joi.object({
        Token: Joi.string().required().label("Token")
    });
    return schema.validate(data);
}

function validate2(data) {
    const schema = Joi.object({
        Token: Joi.string().required().label("Token"),
        taskName: Joi.string().min(1).max(255).required().label("taskName"),
        taskDescription: Joi.string().max(255).required().allow("").label("taskDescription"),
        taskEndTime: Joi.string().min(1).max(64).required().label("taskEndTime"),
        taskIssuer: Joi.string().min(1).max(255).required().label("taskIssuer"),
        taskGetter: Joi.string().min(1).max(255).required().label("taskGetter")
    });
    return schema.validate(data);
}
module.exports = router;