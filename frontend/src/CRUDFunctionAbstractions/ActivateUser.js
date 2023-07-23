import Axios from "axios";
import { useNavigate } from "react-router-dom";
function ActivateUser(token) {
  const navigate = useNavigate();
  Axios.patch(
    "https://orbital-be.azurewebsites.net:443/activate",
    {},
    {
      headers: {
        Token: token,
      },
    }
  )
    .then((response) => {
      console.log(response);
      if (response.data.Data) {
        console.log("something happende");
      }
    })
    .catch((e) => {
      console.log(e);
      navigate("../");
      alert("Authentication failed");
      console.log("what");
    });
}
export default ActivateUser;
