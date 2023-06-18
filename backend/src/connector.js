const mysql = require('mysql2');

function connect() {
  try {
    return mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      port: process.env.DB_PORT,
      ssl: Buffer.from(Buffer.from(process.env.SSL, 'base64').toString('utf-8'), 'utf-8')
    });  
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

const connection = connect();

module.exports = connection;