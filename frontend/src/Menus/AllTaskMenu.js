import Axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RefreshTasks from "../CRUDFunctionAbstractions/RefreshTasks";
import { useParams } from "react-router-dom";
import AnotherButton from "../CSSComponents/AnotherButton";
import NavigationBar from "../OtherComponents/NavigationBar";
import images from "../Assets/FinalBackground.png";
import Background from "../CSSComponents/Background";
import "../CSSComponents/container.css";
import XButton from "../OtherComponents/XButton";
import CheckUser from "../CRUDFunctionAbstractions/CheckUser";
import AddPublicTask from "../CRUDFunctionAbstractions/AddPublicTask";

function AllTaskMenu() {
  const navigate = useNavigate();
  const user = useParams();
  CheckUser();
  const [tasks, changeTasks] = useState(null);
  if (tasks != null) {
    tasks.sort((a, b) => a.Deadline > b.Deadline);
  }

  console.log(tasks);
  useEffect(() => {
    RefreshTasks(changeTasks);
  }, []);

  function TaskContainer({ tasks }) {
    return (
      <header id="dynamicList" className="App-header">
        <AddTaskContainer />
        <div className="list">
          <div style={{ textDecoration: "underline" }}> Tasks</div>
          {tasks
            ? tasks.map((e) => (
                <div>
                  <AnotherButton task={e} list={tasks} updateList={changeTasks}>
                    {e["Task Name"]}
                  </AnotherButton>
                </div>
              ))
            : null}
        </div>
      </header>
    );
  }
  function AddTaskContainer() {
    const [modal, changeModal] = useState(false);

    function addTask(e) {
      e.preventDefault();

      async function sendTask(task) {
        try {
          console.log(task.Deadline);
          if (task.Public == "on") {
            AddPublicTask(task);
          }
          const response = await Axios.post(
            `https://orbital-be.azurewebsites.net:443/task/add`,
            {
              taskName: task["Task Name"],
              taskDescription: task["Task Description"],
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
          RefreshTasks(changeTasks);
        } catch (e) {
          if (e) {
            alert(JSON.parse(e.request.response).Message);
          }
          console.log(e.request);
        }
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
        <button
          className="checkable"
          style={{ width: "40%" }}
          onClick={() => changeModal(!modal)}
        >
          Add Task
        </button>
        {modal && (
          <>
            <div
              onClick={() => {
                changeModal(!modal);
              }}
              className="overlay"
            ></div>
            <form className="basicContainer" onSubmit={(a) => addTask(a)}>
              <XButton
                onClick={() => {
                  changeModal(!modal);
                }}
              ></XButton>
              <div style={{ marginLeft: "60px" }}>
                <label>
                  Task :
                  <input type="text" name="Task Name" />
                </label>
              </div>
              <div>
                <label>
                  Description :
                  <textarea
                    name="Task Description"
                    rows="5"
                    cols="17"
                  ></textarea>
                </label>
              </div>

              <div>
                <label>
                  Deadline :
                  <input
                    type="date"
                    name="Deadline"
                    defaultValue={"2023-12-31"}
                  />
                </label>
              </div>
              <div>
                <label>
                  Recommend Task?
                  <input type="checkbox" name="Public" />
                </label>
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Recommend tasks to others! The 'Get Recommendation' feature is based entirely on inputs from our community!"
                    )
                  }
                >
                  ?
                </button>
              </div>
              <button type="Submit" children="Add Task" />
            </form>
          </>
        )}
      </>
    );
  }

  return (
    <div className="App">
      <Background image={images} />
      <TaskContainer tasks={tasks}></TaskContainer>
      <NavigationBar />
    </div>
  );
}

export default AllTaskMenu;
