import { useState } from "react";
function SwitchRegister({ setHeader }) {
  const [regStatus, setRegStatus] = useState(false);
  return regStatus ? (
    <>
      <form>
        <div>
          <label>
            Email :
            <input type="text" />
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
      <form>
        <div>
          <label>
            Email :
            <input type="text" />
          </label>
        </div>
        <div>
          <label>
            Password :
            <input type="text" />
          </label>
        </div>
        <input type="Submit" value="Submit" />
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
