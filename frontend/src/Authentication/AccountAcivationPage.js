import ActivateUser from "../CRUDFunctionAbstractions/ActivateUser";
import { useLocation } from "react-router-dom";
import Background from "../CSSComponents/Background";
import images from "../Assets/FinalBackground.png";
function AccountActivationPage() {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");
  console.log(token);
  ActivateUser(token);
  return <Background image={images} />;
}
export default AccountActivationPage;
