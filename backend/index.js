import express from "express";
import cors from "cors";
import { welcome } from "./src/welcome.js";
import { login } from "./src/login.js";

const app = express();
const port = 8080;

const success = message => {
  return {"status" : "success", "message" : message};
};

const failed = message => {
  return {"status" : "failed", "message" : message};
};

app.use(cors());

app.get("/", (req, res) => {
  res.send(welcome(success));
});

app.get("/login", (req, res) => {
  const inputs = req.body;
  res.json(login(inputs, success, failed));
});


app.listen(port, () => {
  console.log(`Backend API Listening on Port ${port}`)
});
