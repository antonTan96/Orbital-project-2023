import UWUButton from "../CSSComponents/UWUButton";
import RefreshTasks from "../CRUDFunctionAbstractions/RefreshTasks";
import { useEffect, useState } from "react";
import PopupComponent from "../OtherComponents/PopupComponent";
import Axios from "axios";
function ChangeTaskMenu() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    RefreshTasks(setLoading);
  });
  const tasks = JSON.parse(localStorage.getItem("tasks"));
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
    } catch (e) {
      if (e.response) {
        console.log(e.response);
      } else {
        console.log(e);
      }
    }
  }
  if (loading) {
    return <>Loading</>;
  }
  if (tasks == null) {
    return <header className="App-header"></header>;
  }
  return (
    <div className="App">
      <header className="App-header">
        {tasks.map((e) => (
          <UWUButton
            onClick={() => changeTask(e)}
            children={`${e["Task Name"]}
             ${e.Deadline}`}
          ></UWUButton>
        ))}
        <PopupComponent />
      </header>
    </div>
  );
}
export default ChangeTaskMenu;
