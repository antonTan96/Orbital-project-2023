import dotenv from "dotenv";
import mysql from "mysql2/promise";
import fs from "fs";

dotenv.config();

export const connection = await mysql.createConnection({
  host: process.env.HOST_NAME,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT,
  ssl: fs.readFileSync("DigiCertGlobalRootCA.crt.pem")
});