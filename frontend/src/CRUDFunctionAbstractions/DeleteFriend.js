import Axios from "axios";
function DeleteFriend(username, list, updateList) {
  Axios.delete("https://orbital-be.azurewebsites.net:443/friend/remove", {
    headers: {
      Token: localStorage.getItem("token"),
    },
    data: {
      Username: username,
    },
  })
    .then((res) => {
      console.log(res);
      console.log(list.filter((obj) => obj.Friends != username));
      updateList(list.filter((obj) => obj.Friends != username));
    })
    .catch((e) => console.log(e));
}
export default DeleteFriend;
