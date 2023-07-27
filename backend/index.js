require('dotenv').config();
const express = require('express');
const cors = require('cors');
const welcomeRoute = require('./src/routes/welcome');
const registerRoute = require('./src/routes/register');
const activationRoute = require('./src/routes/activate');
const loginRoute = require('./src/routes/login');
const userRoute = require('./src/routes/user');
const taskRoute = require('./src/routes/task');
const taskPoolRoute = require('./src/routes/pool');
const friendRoute = require('./src/routes/friend');
const checkRoute = require('./src/routes/check');
const { BE_PORT } = require('./src/config/constants');

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", welcomeRoute);
app.use("/register", registerRoute);
app.use("/activate", activationRoute);
app.use("/login", loginRoute);
app.use("/user", userRoute);
app.use("/task", taskRoute);
app.use("/pool", taskPoolRoute);
app.use("/friend", friendRoute);
app.use("/check", checkRoute);

const port = process.env.BE_PORT || BE_PORT;
app.listen(port, () => {
  console.log(`Backend API Listening on Port ${port}`);
});
