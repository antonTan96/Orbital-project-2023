import Axios from "axios";
function SendRequest(username, list, updateList) {
  console.log(username);
  Axios.post(
    `https://orbital-be.azurewebsites.net:443/friend/send`,
    {
      Username: username,
    },
    {
      headers: {
        Token: localStorage.getItem("token"),
      },
    }
  )
    .then((response) => {
      console.log(response);
      const otherlist = list.map((user) => {
        if (user.Users == username) {
          user["Friend Status"] = "Sent";
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

export default SendRequest;
