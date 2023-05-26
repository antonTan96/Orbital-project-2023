import "./App.css";
import { useState } from "react";
import Axios from "axios";

import Login from "./Authentication/Login";

function App() {
  const [headerText, setHeaderText] = useState("Welcome");


//import spawn from "child_process";
//import express from "express";


//  const { spawn } = require("child_process");
//  const express = require('express');
//  const pythonAPI = spawn('python3', ['./backend/app.py']);
//  const app = express();
/*
  const getNum = async () => {
    //const response = await Axios.get("http://localhost:5000/getCredentials");
    const response = await Axios.get('http://localhost:8080/');
    console.log(response.data);
    
  };
  useEffect(() => {
    getCredentials();
  }, []);
  */
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
