import Axios from "axios";
import { useNavigate } from "react-router-dom";
function AutoLogin() {
  const user = localStorage.getItem("user");
  const navigate = useNavigate();
  Axios.post("https://orbital-be.azurewebsites.net:443/check", {
    User: user,
    Token: localStorage.getItem("token"),
  })
    .then((response) => {
      navigate(`./${user}/Menu`);
    })
    .catch((e) => {
      console.log("Log in the normal way bozo");
    });
}

export default AutoLogin;
