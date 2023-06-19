import React from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default () => (
  <Popup
    trigger={(open) => (
      <button className="button">Trigger - {open ? "Opened" : "Closed"}</button>
    )}
    position="right center"
    closeOnDocumentClick
  >
    {" "}
    <span> Popup content </span>
  </Popup>
);
