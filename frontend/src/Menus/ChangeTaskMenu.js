import UWUButton from "../CSSComponents/UWUButton";
import RefreshTasks from "../CRUDFunctionAbstractions/RefreshTasks";
import { useEffect, useState } from "react";
import "./../CSSComponents/modal.css";
import Axios from "axios";
import NavigationBar from "../OtherComponents/NavigationBar";
import images from "../Assets/FinalBackground.png";
import Background from "../CSSComponents/Background";
import { useNavigate } from "react-router-dom";
function ChangeTaskMenu() {
  const [tasks, changeTasks] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    RefreshTasks(changeTasks);
  }, []);

  async function changeTask(task) {
    try {
      console.log(task);
      const response = await Axios.patch(
        "https://orbital-be.azurewebsites.net:443/task/current",
        {
          taskID: task["Task ID"],
        },
        {
          headers: {
            Token: localStorage.getItem("token"),
          },
        }
      );
      console.log(response);
      navigate("./../Menu");
    } catch (e) {
      if (e.response) {
        console.log(e.response);
      } else {
        console.log(e);
      }
    }
  }

  if (tasks == null) {
    return <header className="App-header"></header>;
  }
  return (
    <div className="App">
      <header className="App-header">
        <Background image={images} />
        {tasks.map((e) => (
          <UWUButton onClick={() => changeTask(e)}>
            {`${e["Task Name"]}
             ${e.Deadline.slice(0, 10)}`}
          </UWUButton>
        ))}
      </header>
      <NavigationBar />
    </div>
  );
}
export default ChangeTaskMenu;
