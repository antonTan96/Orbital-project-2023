import { useEffect } from "react";
import "./../App.css";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function CurrentTaskMenu() {
  const { user } = useParams();
  let current = {
    task: "None",
    deadline: "None",
  };
  const navigate = useNavigate();

  function seeTasks() {
    navigate(`./../AllTasks`);
  }
  function changeTask() {
    navigate(`./../ChangeTask`);
  }
  async function theFunction() {
    try {
      console.log(localStorage.getItem("token"));
      const response = await Axios.get(
        "https://orbital-be.azurewebsites.net:443/task",
        {
          params: { Token: localStorage.getItem("token") },
        }
      );
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    theFunction();
  });

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <em>User : {user}</em>
        </div>
        <div>
          <em>Current Task : {current.task}</em>
        </div>
        <div></div>
        <div>Deadline : {current.deadline}</div>
        <button onClick={() => seeTasks()}> Get Recommedation</button>
        <button onClick={() => changeTask()}> Change Current Task</button>
        <button onClick={() => seeTasks()}> See All Tasks</button>
      </header>
    </div>
  );
}

export default CurrentTaskMenu;
