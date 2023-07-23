import Axios from "axios";

function ChangeTask(taskID, navigate) {
  Axios.patch(
    "https://orbital-be.azurewebsites.net:443/task/current",
    {
      taskID: taskID,
    },
    {
      headers: {
        Token: localStorage.getItem("token"),
      },
    }
  )
    .then((response) => navigate("./../")) //do nothing
    .catch((e) => console.log(e));
}

export default ChangeTask;
