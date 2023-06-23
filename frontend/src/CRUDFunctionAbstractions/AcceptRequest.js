import Axios from "axios";
function AcceptRequest(username, updateList) {
  Axios.patch(
    "https://orbital-be.azurewebsites.net:443/friend/accept",
    {
      Username: username,
    },
    {
      headers: {
        Token: localStorage.getItem("token"),
      },
    }
  )
    .then((res) => {
      console.log(res);
      let updatedList = JSON.parse(localStorage.getItem("Requests"));

      updatedList = updatedList.filter((user) => user.Username != username);
      localStorage.setItem("Requests", JSON.stringify(updatedList));
      updateList(updatedList);
    })
    .catch((e) => console.log(e));
}
export default AcceptRequest;
