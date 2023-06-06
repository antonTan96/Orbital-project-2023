import { Axios } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AllTaskMenu() {
  const navigate = useNavigate();

  let tasks = [
    {
      task: "None",
      deadline: "None",
    },
  ];
  const [list, changeList] = useState(tasks);

  function toMenu() {
    navigate(`./../Menu`, { state: {} });
  }

  async function sendTask(task) {
    const response = await Axios.get(
      `https://orbital-be.azurewebsites.net:443/getList`,
      { Token: localStorage.getItem("token") }
    );
    let updatedTaskList = response.data.list;
    changeList(updatedTaskList);
  }
  function TaskContainer({ tasks }) {
    return (
      <header id="dynamicList" className="App-header">
        <button onClick={() => toMenu()}>See Current Task</button>
        {tasks.map((e) => (
          <>
            <div>{e.task}</div>
            <>{e.deadline}</>
          </>
        ))}
        <AddTaskContainer />
      </header>
    );
  }
  function AddTaskContainer() {
    function addTask(e) {
      e.preventDefault();

      function sendTask(task) {
        /*const response = await Axios.post(
          `https://orbital-be.azurewebsites.net:443/addTask`,
          {
            task: task,
            user: user,
          }
        );*/

        var gayList = list.slice();
        var trueList = [...gayList, task];
        changeList(trueList);
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
              <input type="date" name="deadline" />
            </label>
          </div>
          <button type="Submit" children="Add Task" />
        </form>
      </>
    );
  }
  //to be replaced with get data

  return (
    <div className="App">
      <TaskContainer tasks={list}></TaskContainer>
    </div>
  );
}

export default AllTaskMenu;
