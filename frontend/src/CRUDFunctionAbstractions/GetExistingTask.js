import Axios from "axios";
import { useState } from "react";
function GetExistingTask(setTask) {
  const seed = new Date() - 1;
  Axios.get("https://orbital-be.azurewebsites.net:443/task", {
    headers: {
      Token: localStorage.getItem("token"),
    },
  })
    .then((response) => {
      if (response.data.Data.length != 0) {
        console.log(response.data);

        setTask(response.data.Data[seed % response.data.Data.length]);
      } else {
        setTask(null);
      }
    })
    .catch((e) => console.log(e));
}

export default GetExistingTask;
