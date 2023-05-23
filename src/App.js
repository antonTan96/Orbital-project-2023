import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import Axios from "axios";

function App() {
  const [backendNumber, setNum] = useState(0);
  const getNum = async () => {
    const response = await Axios.get("http://localhost:5000/getNum");
    setNum(response.data);
  };
  useEffect(() => {
    getNum();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>Backend number : {backendNumber}</div>
        <form>
          <label>
            Name:
            <input type="number" name="name" />
          </label>
          //TODO : Change backend number
          <input type="submit" value="Submit" />
        </form>
      </header>
    </div>
  );
}

export default App;
