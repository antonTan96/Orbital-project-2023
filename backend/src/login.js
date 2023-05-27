import { connection } from "./connector.js";
import bcrypt from "bcryptjs";

export async function login(inputs, response) {
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

    let query = `SELECT Password FROM ${table_name} WHERE Username = ?`;
    let res = "default";
    const [result, fields] = await connection.query(query, [Username]);
    if (result.length == 0) {
          res = (response(401, "User does not exists!"));
    } else {
      const password_check = await bcrypt.compare(Password, result[0]["Password"]);
      if (password_check) {
        res = (response(200, "Login Successful!"));
      } else {
        res = (response(401, "Incorrect Password!"));
      }
    }
    return res;
	} catch (error) {
		console.log(error);
		return (response(500, "Error occured while accessing database!"));
	}
}
