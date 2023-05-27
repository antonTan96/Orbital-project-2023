import express from "express";
import cors from "cors";
import { welcome } from "./src/welcome.js";
import { login } from "./src/login.js";
import { register } from "./src/register.js";

const app = express();
const port = 8080;

const response = (code, message) => {
  return {"status" : code, "message" : message};
};

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const output = await welcome(response);
  await res.status(output["status"]).send(output["message"]);
});

app.post("/login", async (req, res) => {
  try {
    const output = await login(req.body, response);
    await res.status(output["status"]).send(output["message"]);
  } catch (error) {
    console.error(error);
    await res.status(500).send("Internal Server Error!");
  }
});

app.post("/register", async (req, res) => {
  try {
    const output = await register(req.body, response);
    await res.status(output["status"]).send(output["message"]);
  } catch (error) {
    console.log(error);
    await res.status(500).send("Internal Server Error!");
  }
})

app.listen(port, () => {
  console.log(`Backend API Listening on Port ${port}`);
});
