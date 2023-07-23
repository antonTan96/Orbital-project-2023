import Axios from "axios";
function GetRandomTask(setTask) {
  const seed = new Date() - 1;
  console.log(seed);
  Axios.get("https://orbital-be.azurewebsites.net:443/pool/random", {
    headers: {
      Token: localStorage.getItem("token"),
    },
  })
    .then((response) => {
      console.log(response);
      setTask(response.data.Data[seed % response.data.Data.length]);
    })
    .catch((e) => console.log(e));
}

export default GetRandomTask;
