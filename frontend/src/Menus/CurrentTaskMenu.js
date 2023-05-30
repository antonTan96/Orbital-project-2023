import { useEffect } from "react";
import "./../App.css";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

function CurrentTaskMenu() {
  const { user } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  let taskList;
  let current;
  function seeTasks() {
    navigate(`./../AllTasks`, { state: { login: true, taskList: taskList } });
  }
  useEffect(() => {
    const response = Axios.get(
      "https://orbital-be.azurewebsites.net:443/getList"
    );
    taskList = response.data.list;
    current = response.data.current;
  });
  return state.login ? (
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
        <button onClick={() => seeTasks()}> See All Tasks</button>
      </header>
    </div>
  ) : (
    <div className="App">
      <header className="App-header">Sugondese balls</header>
    </div>
  );
}

export default CurrentTaskMenu;
