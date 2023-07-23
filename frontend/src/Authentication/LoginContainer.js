import Axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorContainer from "../OtherComponents/ErrorContainer";
import { useState } from "react";

function LoginContainer() {
  const [errorString, setErrorString] = useState("");
  const navigate = useNavigate();
  function handleError(e) {
    setErrorString(e);
  }
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    const submitButton = document.getElementById("submitButton");
    const switchButton = document.getElementById("changeLoginMethodButton");
    // Read the form data
    const form = e.target;
    submitButton.disabled = true;
    switchButton.disabled = true;

    const formData = new FormData(form);
    //fetch('/some-api', { method: form.method, body: formData });
    const formJson = Object.fromEntries(formData.entries());
    getCredentials(formJson);
  }
  const getCredentials = async (e) => {
    //const response = await Axios.get("http://localhost:5000/getCredentials");
    const submitButton = document.getElementById("submitButton");
    const switchButton = document.getElementById("changeLoginMethodButton");

    try {
      const response = await Axios.post(
        "https://orbital-be.azurewebsites.net:443/login",
        e
      );
      console.log(response);
      const username = e.Username;

      if (response.status === 200) {
        localStorage.setItem("token", response.data.Data);
        localStorage.setItem("user", username);
        navigate(`../${username}/Menu`);
      }
    } catch (e) {
      if (e.response) {
        console.log(e.response);
        handleError(e.response.data.Message);
      } else {
        handleError(e.message);
      }

      submitButton.disabled = false;
      switchButton.disabled = false;
    }
  };

  return (
    <>
      <ErrorContainer
        errorString={errorString}
        setErrorString={setErrorString}
      />
      <form onSubmit={(a) => handleSubmit(a)}>
        <div>
          <label>
            Username :
            <input type="text" name="Username" />
          </label>
        </div>
        <div>
          <label>
            Password :
            <input type="password" name="Password" />
          </label>
        </div>
        <button id="submitButton" type="Submit" children="Log in" />
      </form>
    </>
  );
}
export default LoginContainer;
