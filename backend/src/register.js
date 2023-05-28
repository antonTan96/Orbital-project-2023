import { connection } from "./connector.js";
import bcrypt from "bcryptjs";

export async function register(inputs, response) {
	const table_name = "Users";
	try {
		if (inputs == undefined || Object.entries(inputs).length == 0) {
	      return(response(500, "Inputs cannot be emptied!"));
	    }
	    if (!("Username" in inputs)) {
	      return(response(500, "Username field is not present!"));
	    }
	    if (!("Password" in inputs)) {
	      return(response(500, "Password field is not present!"));
	    }

	    const Username = inputs["Username"];
	    const Password = inputs["Password"];

	    let query = `SELECT Username FROM ${table_name} WHERE Username = ?`;
	    const [result, fields] = await connection.query(query, [Username]);
	    if (result.length != 0) {
	    	return response(401, "Username already exists! Please select another Username!");
	    } else {
	    	query = `INSERT INTO ${table_name} (Username, Password) VALUES (?, ?)`;
	    	const salt = await bcrypt.genSalt(12);
	    	connection.query(query, [Username, await bcrypt.hash(Password, salt)]);
	    	return response(200, "User registered successful!");
	    }

	} catch (error) {
		console.error(error);
		response(500, "Error occurred while accessing database!");
	}
}
