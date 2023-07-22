import "./App.css";
import { useState } from "react";
import "./CSSComponents/background.css";
import images from "./Assets/FinalBackground.png";
import LoginPage from "./Authentication/LoginPage";
import Background from "./CSSComponents/Background";

function App() {
  const [headerText, setHeaderText] = useState("Welcome");

  return (
    <div className="App">
      <header className="App-header">
        <Background image={images} />
        <div>{headerText}</div>
        <LoginPage set={setHeaderText}></LoginPage>
      </header>
    </div>
  );
}

export default App;
