import { useEffect, useState } from "react";
import "./../App.css";
import { useNavigate, useParams } from "react-router-dom";
import CurrentTaskContainer from "./CurrentTaskContainer";
import RefreshTasks from "../CRUDFunctionAbstractions/RefreshTasks";
import Axios from "axios";
import NavigationBar from "../OtherComponents/NavigationBar";
import images from "../Assets/FinalBackground.png";
import Background from "../CSSComponents/Background";
import UWUButton from "../CSSComponents/UWUButton";
function CurrentTaskMenu() {
  const [taskList, updateList] = useState(null);
  let disable = true;
  let chosen = false;
  useEffect(() => {
    RefreshTasks(updateList);
  }, []);

  const { user } = useParams();
  let current = taskList; //returns an array of tasks
  console.log(current);
  if (current == undefined) {
    current = {
      "Task Name": "Loading...",
      Deadline: "Loading...",
    };
  } else if (current.length == 0) {
    current = {
      "Task Name": "None",
      Deadline: "None",
    };
  } else {
    if (!chosen) {
      for (let i = 0; i < current.length; i++) {
        if (current[i]["Is Current"] != 0) {
          current = current[i];
          disable = false;
          chosen = true;
          console.log("wut");

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
    console.log("the task?");
    console.log(current);
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

  return (
    <div className="App">
      <header className="App-header">
        <Background image={images} />
        <div>
          <em>User : {user}</em>
        </div>
        <CurrentTaskContainer task={current} />
        <div>
          <UWUButton onClick={() => seeTasks()}> Get Recommedation</UWUButton>
          <UWUButton onClick={() => changeTask()}>
            Change Current Task
          </UWUButton>
          <UWUButton onClick={() => completeTask()} disabled={disable}>
            {" "}
            Task Completed
          </UWUButton>
        </div>

        <NavigationBar />
      </header>
    </div>
  );
}

export default CurrentTaskMenu;
