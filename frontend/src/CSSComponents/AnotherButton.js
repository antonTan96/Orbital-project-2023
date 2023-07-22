import { useState } from "react";
import "./modal.css";
import "./task.css";
import soundEffect from "./../Assets/are-you-sure-about-that.mp3";
import RemoveTask from "../CRUDFunctionAbstractions/RemoveTask";
import XButton from "../OtherComponents/XButton";

function AnotherButton(props) {
  const [modal, changeModal] = useState(false);
  const [confirmButton, changeButton] = useState(false);
  const element = (
    <div
      className={
        timeDiff(props.task["Deadline"]) < 86400000
          ? "checkable urgent"
          : "checkable"
      }
      onClick={() => changeModal(!modal)}
    >
      {props.children}{" "}
      {timeDiff(props.task["Deadline"]) <= 0 ? "(Expired)" : ""}
    </div>
  );

  function timeDiff(date) {
    const dateObject = new Date(date);

    dateObject.setDate(date.slice(8, 10));
    dateObject.setHours(23);
    dateObject.setMinutes(59);
    const currentDate = new Date();
    return dateObject - currentDate;
  }

  function playSound() {
    new Audio(soundEffect).play();
  }

  return (
    <>
      {element}
      {modal && (
        <>
          <div
            onClick={() => {
              changeModal(!modal);
              changeButton(false);
            }}
            className="overlay"
          ></div>
          <div className="taskContent">
            <XButton
              onClick={() => {
                changeModal(!modal);
                changeButton(false);
              }}
            ></XButton>
            <div>{props.task["Task Description"]}</div>
            <div>Deadline:{props.task["Deadline"].slice(0, 10)}</div>

            {confirmButton ? (
              <button
                onClick={() =>
                  RemoveTask(props.task, props.list, props.updateList)
                }
              >
                Confirm?
              </button>
            ) : (
              <button
                onClick={() => {
                  changeButton(true);
                  playSound();
                }}
              >
                Remove Task
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}
export default AnotherButton;
