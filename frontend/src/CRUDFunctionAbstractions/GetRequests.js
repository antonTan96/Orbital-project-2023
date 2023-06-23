import Axios from "axios";

function GetRequests(setLoading) {
  console.log("request!");

  Axios.get("https://orbital-be.azurewebsites.net:443/friend/receive", {
    headers: {
      Token: localStorage.getItem("token"),
    },
  })
    .then((response) => {
      if (response.data.Data) {
        localStorage.setItem("Requests", JSON.stringify(response.data.Data));
        console.log("Requests Set as");
        console.log(JSON.parse(localStorage.getItem("Requests")));
        setLoading(false);
      }
    })
    .catch((e) => console.log(e));
}

export default GetRequests;
