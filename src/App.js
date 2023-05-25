import "./App.css";
import { useState } from "react";
import Axios from "axios";
import Login from "./Authentication/Login";

function App() {
  const [headerText, setHeaderText] = useState("Welcome");

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
