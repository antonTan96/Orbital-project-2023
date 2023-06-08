import { useEffect, useState } from "react";
import "./../App.css";
import { useNavigate, useParams } from "react-router-dom";
import CurrentTaskContainer from "./CurrentTaskContainer";
import RefreshTasks from "../OtherComponents/RefreshTasks";
function CurrentTaskMenu() {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    RefreshTasks(setLoading);
  });

  const { user } = useParams();
  let current = JSON.parse(localStorage.getItem("tasks")); //returns an array of tasks
  if (current == undefined || current.length == 0) {
    current = {
      Name: "None",
      Deadline: "None",
    };
  } else {
    current = current[0];
  }
  console.log(current);
  const navigate = useNavigate();

  function seeTasks() {
    navigate(`./../AllTasks`);
  }
  function changeTask() {
    navigate(`./../ChangeTask`);
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
      </header>
    </div>
  );
}

export default CurrentTaskMenu;
