import Axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorContainer from "../OtherComponents/ErrorContainer";
import { useState } from "react";

function RegisterContainer(set, pageChange) {
  const [errorString, setErrorString] = useState("");
  const navigate = useNavigate();
  function handleError(err) {
    setErrorString(err);
  }

  function handleReg(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    const submitButton = document.getElementById("submitButton");
    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    //fetch('/some-api', { method: form.method, body: formData });
    const formJson = Object.fromEntries(formData.entries());

    if (
      document.getElementById("pass")._valueTracker.getValue() ==
      formJson.Password
    ) {
      saveCredentials(formJson);
    } else {
      setErrorString("Passwords are different");
    }
  }
  const saveCredentials = async (e) => {
    //const response = await Axios.get("http://localhost:5000/getCredentials");
    const submitButton = document.getElementById("submitButton");
    const switchButton = document.getElementById("changeLoginMethodButton");
    const username = e.Username;
    submitButton.disabled = true;
    switchButton.disabled = true;
    try {
      const response = await Axios.post(
        "https://orbital-be.azurewebsites.net:443/register",
        e
      );
      console.log(response);
      if (response.status >= 200 && response.status < 300) {
        localStorage.setItem("token", response.data.Data);
        navigate(`/${username}/Menu`, { state: { login: true } });
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
      <form onSubmit={(a) => handleReg(a)}>
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
        <div>
          <label>
            Password Again :
            <input type="password" id="pass" />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input type="text" name="Email" />
          </label>
        </div>
        <button id="submitButton" type="Submit" children="Register Account" />
      </form>
    </>
  );
}
export default RegisterContainer;
