import "./App.css";
import { useEffect, useState } from "react";

import Login from "./Authentication/Login";

function App() {
  const [headerText, setHeaderText] = useState("Welcome");

  //import spawn from "child_process";
  //import express from "express";

  //  const { spawn } = require("child_process");
  //  const express = require('express');
  //const { spawn } = require("node:child_process");

  //const pythonAPI = spawn("python3", ["./backend/app.py"]);
  //  const app = express();

  return (
    <div className="App">
      <header className="App-header">
        <div>{headerText}</div>
        <Login set={setHeaderText}></Login>
      </header>
    </div>
  );
}

export default App;
