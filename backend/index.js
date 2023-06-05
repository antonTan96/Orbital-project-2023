require('dotenv').config();
const express = require('express');
const cors = require('cors');
const welcomeRoute = require('./src/routes/welcome');
const loginRoute = require('./src/routes/login');
const registerRoute = require('./src/routes/register');
const userRoute = require('./src/routes/user');
const taskRoute = require('./src/routes/task');
const BE_PORT = require('./constants');

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", welcomeRoute);
app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/user", userRoute);
app.use("/task", taskRoute);

const port = process.env.BE_PORT || BE_PORT;
app.listen(port, () => {
  console.log(`Backend API Listening on Port ${port}`);
});
