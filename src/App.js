import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import Axios from "axios";
import Login from "./Login";

function App() {
  const [headerText, setHeaderText] = useState("Welcome");

  return (
    <div className="App">
      <header className="App-header">
        <div>{headerText}</div>
        <Login set={setHeaderText}>WhatHowdoesThisWork</Login>
      </header>
    </div>
  );
}

export default App;
