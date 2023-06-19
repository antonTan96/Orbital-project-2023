import { useState } from "react";
import LoginContainer from "./LoginContainer";
import RegisterContainer from "./RegisterContainer";
import UWUButton from "../CSSComponents/UWUButton";

function LoginPage({ set }) {
  const [Login, changePage] = useState();

  const text = ["Log in", "Register"];
  const [buttonText, changeButton] = useState(text[0]);
  const components = [<RegisterContainer />, <LoginContainer />];

  function changeText(a) {
    console.log(a);
    if (a == text[0]) {
      set(text[0]);
      changePage(components[1]);
      changeButton(text[1]);
    } else {
      set(text[1]);
      changePage(components[0]);
      changeButton(text[0]);
    }
  }

  return (
    <>
      {Login}
      <UWUButton
        onClick={() => {
          changeText(buttonText);
        }}
        children={buttonText}
      />
    </>
  );
}

export default LoginPage;
