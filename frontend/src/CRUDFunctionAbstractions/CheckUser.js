import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function CheckUser() {
  const user = useParams();
  const navigate = useNavigate();
  console.log("checking");

  useEffect(() => {
    if (user.user != localStorage.getItem("user")) {
      navigate("../");
      console.log("getOut");
    }
  }, []);
}

export default CheckUser;
