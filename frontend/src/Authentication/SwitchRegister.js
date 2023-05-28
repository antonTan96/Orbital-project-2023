import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function SwitchRegister({ setHeader }) {
  const [regStatus, setRegStatus] = useState(false);
  const navigate = useNavigate();
  const getCredentials = async (e) => {
    //const response = await Axios.get("http://localhost:5000/getCredentials");
    console.log("req sent");

    const response = await Axios.post(
      "https://orbital-be.azurewebsites.net:443/login",
      e
    );
    console.log(response);
    if (response.status == 200) {
      navigate("/Menu");
    }
  };
  const saveCredentials = async (e) => {
    //const response = await Axios.get("http://localhost:5000/getCredentials");
    console.log("reg sent");

    const response = await Axios.post(
      "https://orbital-be.azurewebsites.net:443/register",
      e
    );
    console.log(response.data);
  };
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    //fetch('/some-api', { method: form.method, body: formData });
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    getCredentials(formJson);
  }
  function handleReg(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    //fetch('/some-api', { method: form.method, body: formData });
    const formJson = Object.fromEntries(formData.entries());

    if (formJson.pass == formJson.Password) {
      saveCredentials(formJson);
    } else {
      console.log("stupid");
    }
  }
  return regStatus ? (
    <>
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
            <input type="text" name="pass" />
          </label>
        </div>
        <input type="Submit" value="Submit" />
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
        <button type="Submit" children="Submit" />
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
