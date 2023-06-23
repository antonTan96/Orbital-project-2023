import { useEffect, useState } from "react";
import "./../App.css";
import { useNavigate, useParams } from "react-router-dom";
import CurrentTaskContainer from "./CurrentTaskContainer";
import RefreshTasks from "../CRUDFunctionAbstractions/RefreshTasks";
import Axios from "axios";
function CurrentTaskMenu() {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    RefreshTasks(setLoading);
  });

  const { user } = useParams();
  let current = JSON.parse(localStorage.getItem("tasks")); //returns an array of tasks
  if (current == undefined || current.length == 0) {
    current = {
      "Task Name": "None",
      Deadline: "None",
    };
  } else {
    let chosen = false;
    for (let i = 0; i < current.length; i++) {
      if (current[i]["Is Current"] != 0) {
        current = current[i];
        chosen = true;
        break;
      }
      if (!chosen) {
        current = {
          "Task Name": "None",
          Deadline: "None",
        };
      }
    }
  }
  console.log(current);
  const navigate = useNavigate();

  function seeTasks() {
    navigate(`./../AllTasks`);
  }
  function changeTask() {
    navigate(`./../ChangeTask`);
  }
  async function completeTask() {
    try {
      console.log(current["Task ID"]);
      const response = await Axios.delete(
        "https://orbital-be.azurewebsites.net:443/task/delete",
        {
          headers: {
            Token: localStorage.getItem("token"),
          },
          data: {
            taskID: current["Task ID"],
          },
        }
      );
      changeTask();
    } catch (e) {
      if (e.response) {
        console.log(e.response);
      } else {
        console.log(e);
      }
    }
  }
  if (isLoading) {
    return <>Loading</>;
  }
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <em>User : {user}</em>
        </div>
        <CurrentTaskContainer task={current} />
        <button onClick={() => seeTasks()}> Get Recommedation</button>
        <button onClick={() => changeTask()}> Change Current Task</button>
        <button onClick={() => seeTasks()}> See All Tasks</button>
        <button onClick={() => completeTask()}> Task Completed</button>
        <button onClick={() => navigate(`./../Contacts`)}> Contacts</button>
      </header>
    </div>
  );
}

export default CurrentTaskMenu;
