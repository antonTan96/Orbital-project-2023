import Axios from "axios";
function AddPublicTask(task) {
  Axios.post(
    `https://orbital-be.azurewebsites.net:443/pool/add`,
    {
      taskName: task["Task Name"],
      taskDescription: task["Task Description"],
    },
    {
      headers: {
        Token: localStorage.getItem("token"),
      },
    }
  )
    .then((response) => {
      //do nothing
    })
    .catch((e) => {
      console.log("this should not be triggered");
      console.log(e.response);

      e.response
        ? e.response.data
          ? alert(e.response.data.Message)
          : console.log("Network Error probably")
        : console.log("Network Error probably");
    });
}

export default AddPublicTask;
