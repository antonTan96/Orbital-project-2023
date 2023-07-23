import "./../CSSComponents/navbar.css";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
function NavigationBar(props) {
  const [open, changeState] = useState(false);
  const navigate = useNavigate();
  const toggleButton = useRef(null);
  const sidebar = useRef(null);
  const user = useParams();

  useEffect(() => {
    if (toggleButton.current) {
      toggleButton.current.addEventListener("click", () => {
        console.log("show the fucking navbar");

        sidebar.current.classList.toggle("show");
      });
    }
  }, [open]);

  return (
    <>
      {!open && (
        <div
          ref={toggleButton}
          onClick={() => changeState(!open)}
          className="navbarButton"
        >
          <div className="icon"></div>
          <div className="icon"></div>
          <div className="icon"></div>
        </div>
      )}
      <div className="navbar" ref={sidebar}>
        <div
          className="content"
          onClick={() => {
            console.log("ok");
            navigate(`../${user.user}/Menu`);
          }}
        >
          Current Task
        </div>
        <div
          className="content"
          onClick={() => {
            console.log("To Task List");
            navigate(`../${user.user}/AllTasks`);
          }}
        >
          Task List
        </div>
        <div
          className="content"
          onClick={() => {
            console.log("To Task List");
            navigate(`../${user.user}/Contacts`);
          }}
        >
          Contacts
        </div>
        <div
          className="content"
          onClick={() => {
            console.log("return to login page");
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("../");
          }}
        >
          Log Out
        </div>
      </div>
      {open && (
        <div
          className="overlay navbarButton"
          ref={toggleButton}
          onClick={() => changeState(!open)}
        ></div>
      )}
    </>
  );
}

export default NavigationBar;
