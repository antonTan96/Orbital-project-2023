import { useState } from "react";
import Axios from "axios";

function SwitchRegister({ setHeader }) {
  const [regStatus, setRegStatus] = useState(false);
  const getCredentials = async (e) => {
    //const response = await Axios.get("http://localhost:5000/getCredentials");
    console.log("req sent");

    const response = await Axios.post("http://localhost:8080/login", e);
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
  return regStatus ? (
    <>
      <form>
        <div>
          <label>
            Username :
            <input type="text" name="username" />
          </label>
        </div>
        <div>
          <label>
            Password :
            <input type="text" />
          </label>
        </div>
        <div>
          <label>
            Password Again :
            <input type="text" />
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
            <input type="text" name="username" />
          </label>
        </div>
        <div>
          <label>
            Password :
            <input type="text" name="password" />
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
