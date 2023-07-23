import Axios from "axios";
import ChangeTask from "./ChangeTask";
function AddNewTask(task, username, navigate) {
  const addDaysToDate = (date, daysToAdd) => {
    const newDate = new Date(date); // Create a new Date object to avoid modifying the original date
    newDate.setDate(newDate.getDate() + daysToAdd);
    return newDate;
  };

  // Usage example:
  const currentDate = new Date(); // Current date
  const newDate = addDaysToDate(currentDate, 100);
  console.log(newDate);
  Axios.post(
    `https://orbital-be.azurewebsites.net:443/task/add`,
    {
      taskName: task["Task Name"],
      taskDescription: task["Task Description"],
      taskEndTime: newDate.toISOString().slice(0, 10),
      taskIssuer: username,
      taskGetter: username,
    },
    {
      headers: {
        Token: localStorage.getItem("token"),
      },
    }
  )
    .then((response) => {
      console.log(response);
      ChangeTask(response.data.Data, navigate);
    })
    .catch((e) => console.log(e));
}

export default AddNewTask;
