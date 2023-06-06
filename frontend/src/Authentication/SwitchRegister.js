import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorContainer from "../OtherComponents/ErrorContainer";

function SwitchRegister({ setHeader }) {
  const [regStatus, setRegStatus] = useState(false);
  const navigate = useNavigate();
  const [errorString, setErrorString] = useState("");

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
    const username = e.Username;
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
    }
  };
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    const submitButton = document.getElementById("submitButton");
    // Read the form data
    const form = e.target;
    submitButton.disabled = true;

    const formData = new FormData(form);
    //fetch('/some-api', { method: form.method, body: formData });
    const formJson = Object.fromEntries(formData.entries());
    getCredentials(formJson);
  }
  const getCredentials = async (e) => {
    //const response = await Axios.get("http://localhost:5000/getCredentials");
    const submitButton = document.getElementById("submitButton");
    try {
      const response = await Axios.post(
        "https://orbital-be.azurewebsites.net:443/login",
        e
      );
      console.log(response);
      const username = e.Username;

      if (response.status == 200) {
        localStorage.setItem("token", response.data.Data);
        navigate(`/${username}/Menu`);
      }
    } catch (e) {
      if (e.response) {
        console.log(e.response);
        handleError(e.response.data.Message);
      } else {
        handleError(e.message);
      }

      submitButton.disabled = false;
    }
  };

  return regStatus ? (
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
            <input type="text" name="Password" />
          </label>
        </div>
        <div>
          <label>
            Password Again :
            <input type="text" id="pass" />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input type="text" name="Email" />
          </label>
        </div>
        <button id="submitButton" type="Submit" children="Submit" />
      </form>
      <button
        onClick={() => {
          setRegStatus(false);
          setHeader("Log In");
        }}
      >
        Log In
      </button>
    </>
  ) : (
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
            <input type="text" name="Password" />
          </label>
        </div>
        <button id="submitButton" type="Submit" children="Submit" />
      </form>
      <button
        onClick={() => {
          setRegStatus(true);
          setHeader("Register");
        }}
      >
        Register
      </button>
    </>
  );
}

export default SwitchRegister;
