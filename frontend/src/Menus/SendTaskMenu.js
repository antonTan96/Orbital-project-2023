import Axios from "axios";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NavigationBar from "../OtherComponents/NavigationBar";
import images from "../Assets/FinalBackground.png";
import Background from "../CSSComponents/Background";
import CheckUser from "../CRUDFunctionAbstractions/CheckUser";
function SendTaskMenu() {
  const user = useParams();
  const navigate = useNavigate();
  const accepter = useLocation();
  CheckUser();
  useEffect(() => {
    if (accepter.state == null) {
      navigate("./..");
    }
  }, []);

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
            taskGetter: accepter.state.user,
          },
          {
            headers: {
              Token: localStorage.getItem("token"),
            },
          }
        );
        console.log("the response is");
        console.log(response);
        navigate("./..");
      } catch (e) {
        console.log(e);
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
    <div className="App">
      <header className="App-header">
        <Background image={images} />
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
                <input
                  type="date"
                  name="Deadline"
                  defaultValue={"2023-12-31"}
                />
              </label>
            </div>
            <button type="Submit" children="Send Task" />
          </form>
        </>
      </header>
      <NavigationBar />
    </div>
  );
}

export default SendTaskMenu;
