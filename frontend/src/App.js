import "./App.css";
import { useState } from "react";

import LoginPage from "./Authentication/LoginPage";

function App() {
  const [headerText, setHeaderText] = useState("Welcome");

  return (
    <div className="App">
      <header className="App-header">
        <div>{headerText}</div>
        <LoginPage set={setHeaderText}></LoginPage>
      </header>
    </div>
  );
}

export default App;
