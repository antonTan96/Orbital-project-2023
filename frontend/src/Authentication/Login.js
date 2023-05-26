import { useState } from "react";
import SwitchRegister from "./SwitchRegister";
function Login({ set }) {
  const [clicked, setClicked] = useState(false);
  return clicked ? (
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
  );
}

export default Login;
