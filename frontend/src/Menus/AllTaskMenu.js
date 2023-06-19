import Axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RefreshTasks from "../OtherComponents/RefreshTasks";
import { useParams } from "react-router-dom";
function AllTaskMenu() {
  const navigate = useNavigate();
  const user = useParams();
  let temp = JSON.parse(localStorage.getItem("tasks"));
  if (temp != null) {
    temp.sort((a, b) => a.Deadline > b.Deadline);
  }
  const [tasks, changeTasks] = useState(temp);

  console.log(tasks);

  function toMenu() {
    navigate(`./../Menu`);
  }

  function TaskContainer({ tasks }) {
    function removeTask(task) {
      Axios.delete("https://orbital-be.azurewebsites.net:443/task/delete", {
        headers: {
          Token: localStorage.getItem("token"),
        },
        data: {
          taskName: task["Task Name"],
        },
      }).catch((e) => console.log(e));
      console.log(tasks);

      tasks = tasks.filter((sus) => sus.Name != task.Name);
      console.log(task);
      changeTasks(tasks);
    }
    return (
      <header id="dynamicList" className="App-header">
        <button onClick={() => toMenu()}>See Current Task</button>
        <AddTaskContainer />

        {tasks
          ? tasks.map((e) => (
              <>
                <>
                  <div>{e["Task Name"]}</div>
                  <>{e.Deadline.substring(0, 10)}</>
                </>
                <button onClick={() => removeTask(e)}>Remove Task</button>
              </>
            ))
          : null}
      </header>
    );
  }
  function AddTaskContainer() {
    function addTask(e) {
      e.preventDefault();

      async function sendTask(task) {
        try {
          const response = await Axios.post(
            `https://orbital-be.azurewebsites.net:443/task/add`,
            {
              taskName: task["Task Name"],
              taskDescription: "",
              taskEndTime: task.Deadline,
              taskIssuer: user.user,
              taskGetter: user.user,
            },
            {
              headers: {
                Token: localStorage.getItem("token"),
              },
            }
          );
          console.log("the response is");
          console.log(response);
        } catch (e) {
          if (e.response.status === 400) {
            tasks.shift();
            changeTasks(tasks);
          } else {
            console.log(e);
          }
        }
      }
      // Read the form data
      const form = e.target;
      const formData = new FormData(form);
      //fetch('/some-api', { method: form.method, body: formData });
      const formJson = Object.fromEntries(formData.entries());
      console.log(formJson);
      sendTask(formJson);

      if (tasks == null) {
        localStorage.setItem("tasks", JSON.stringify([formJson]));
        changeTasks([formJson]);
      } else {
        let gaylist = tasks.slice();
        let trulist = [...gaylist, formJson];
        trulist.sort((a, b) => a.Deadline > b.Deadline);
        localStorage.setItem("tasks", JSON.stringify(trulist));
        changeTasks(trulist);
      }
    }

    return (
      <>
        <form onSubmit={(a) => addTask(a)}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <label>
              Task :
              <input type="text" name="Task Name" />
            </label>
          </div>
          <div>
            <label
              style={{
                display: "flex",

                alignItems: "flex-start",
              }}
            >
              Description :
              <textarea name="Task Description" rows="5" cols="17"></textarea>
            </label>
          </div>
          <div>
            <label>
              Deadline :
              <input type="date" name="Deadline" defaultValue={"2023-12-31"} />
            </label>
          </div>
          <button type="Submit" children="Add Task" />
        </form>
      </>
    );
  }

  return (
    <div className="App">
      <TaskContainer tasks={tasks}></TaskContainer>
    </div>
  );
}

export default AllTaskMenu;
