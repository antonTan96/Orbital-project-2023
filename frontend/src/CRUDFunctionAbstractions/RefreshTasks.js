import Axios from "axios";

function RefreshTasks(updateList) {
  localStorage.removeItem("tasks");

  Axios.get("https://orbital-be.azurewebsites.net:443/task", {
    headers: {
      Token: localStorage.getItem("token"),
    },
  })
    .then((response) => {
      if (response.data.Data.length != 0) {
        console.log(response.data);

        updateList(response.data.Data);
      } else {
        updateList([]);
      }
    })
    .catch((e) => console.log(e));
  console.log("done");
}

export default RefreshTasks;
