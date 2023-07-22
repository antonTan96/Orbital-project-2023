import Axios from "axios";
function RemoveTask(task, list, updateList) {
  Axios.delete("https://orbital-be.azurewebsites.net:443/task/delete", {
    headers: {
      Token: localStorage.getItem("token"),
    },
    data: {
      taskID: task["Task ID"],
    },
  })
    .then((res) => console.log(res))
    .catch((e) => console.log(e));
  list = list.filter((sus) => sus["Task ID"] != task["Task ID"]);
  console.log(task);
  updateList(list);
}
export default RemoveTask;
