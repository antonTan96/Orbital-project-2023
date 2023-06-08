import Axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RefreshTasks from "../OtherComponents/RefreshTasks";

function AllTaskMenu() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    RefreshTasks(setLoading);
  });

  let tasks = JSON.parse(localStorage.getItem("tasks"));
  console.log(tasks);
  if (tasks == undefined || tasks.length === 0) {
    tasks = [
      {
        Name: "None",
        Deadline: "None",
      },
    ];
  }

  function toMenu() {
    navigate(`./../Menu`);
  }

  function TaskContainer({ tasks }) {
    return (
      <header id="dynamicList" className="App-header">
        <button onClick={() => toMenu()}>See Current Task</button>
        {tasks.map((e) => (
          <>
            <div>{e.Name}</div>
            <>{e.Deadline.substring(0, 10)}</>
          </>
        ))}
        <AddTaskContainer />
      </header>
    );
  }
  function AddTaskContainer() {
    function addTask(e) {
      e.preventDefault();

      async function sendTask(task) {
        const response = await Axios.post(
          `https://orbital-be.azurewebsites.net:443/task/add`,
          {
            taskName: task.task,
            taskDescription: "",
            taskEndTime: task.deadline,
            taskIssuer: "",
            taskGetter: "",
          },
          {
            headers: {
              Token: localStorage.getItem("token"),
            },
          }
        );
        console.log("the response is");
        console.log(response);
        setLoading(true);
      }
      // Read the form data
      const form = e.target;
      const formData = new FormData(form);
      //fetch('/some-api', { method: form.method, body: formData });
      const formJson = Object.fromEntries(formData.entries());
      console.log(formJson);
      sendTask(formJson);
    }

    return (
      <>
        <form onSubmit={(a) => addTask(a)}>
          <div>
            <label>
              Task :
              <input type="text" name="task" />
            </label>
          </div>
          <div>
            <label>
              Deadline :
              <input type="date" name="deadline" defaultValue={"2023-12-31"} />
            </label>
          </div>
          <button type="Submit" children="Add Task" />
        </form>
      </>
    );
  }
  if (isLoading) {
    return <>Loading</>;
  }
  return (
    <div className="App">
      <TaskContainer tasks={tasks}></TaskContainer>
    </div>
  );
}

export default AllTaskMenu;
