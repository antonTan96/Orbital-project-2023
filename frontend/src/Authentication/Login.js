import { useState } from "react";
import SwitchRegister from "./SwitchRegister";
import { useNavigate } from "react-router-dom";

function Login({ set }) {
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {clicked ? (
        <SwitchRegister setHeader={set} />
      ) : (
        <button
          onClick={() => {
            set("Log In");
            setClicked(!clicked);
          }}
        >
          Log in
        </button>
      )}
      <div>
        <button onClick={() => navigate("/Menu")} children="Skip" />
      </div>
    </>
  );
}

export default Login;
