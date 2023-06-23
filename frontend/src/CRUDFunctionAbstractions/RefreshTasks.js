import Axios from "axios";

function RefreshTasks(setLoading) {
  localStorage.removeItem("tasks");

  Axios.get("https://orbital-be.azurewebsites.net:443/task", {
    headers: {
      Token: localStorage.getItem("token"),
    },
  })
    .then((response) => {
      if (response.data.Data.length != 0) {
        console.log(response.data);

        localStorage.setItem("tasks", JSON.stringify(response.data.Data));
        console.log(JSON.parse(localStorage.getItem("tasks")));
      }
      setLoading(false);
    })
    .catch((e) => console.log(e));
  console.log("done");
}

export default RefreshTasks;
