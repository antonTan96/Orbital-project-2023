import Axios from "axios";
function RejectRequest(username, updateList) {
  Axios.delete(
    "https://orbital-be.azurewebsites.net:443/friend/reject",

    {
      headers: {
        Token: localStorage.getItem("token"),
      },
      data: {
        Username: username,
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
export default RejectRequest;
