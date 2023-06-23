import Axios from "axios";
function CancelRequest(username, list, updateList) {
  Axios.delete(
    "https://orbital-be.azurewebsites.net:443/friend/cancel",

    {
      headers: {
        Token: localStorage.getItem("token"),
      },
      data: {
        Username: username,
      },
    }
  )
    .then((response) => {
      console.log(response);
      const otherlist = list.map((user) => {
        if (user.Users == username) {
          console.log("changed");
          user["Friend Status"] = "Nothing";
          return user;
        } else {
          return user;
        }
      });
      updateList(otherlist);
    })
    .catch((e) => console.log(e));
  console.log("done");
}

export default CancelRequest;
