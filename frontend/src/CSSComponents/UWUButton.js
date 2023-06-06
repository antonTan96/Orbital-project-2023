import styled from "styled-components";
import React, { useState } from "react";

const StyledButton = styled.button`
  color: white;
  height: ${(props) => props.height ?? "auto"};
  width: 50%;
  background-color: blue;
  border: 5px solid yellow;
  border-radius: 5%;
  :hover {
    color: red;
    background-color: green;
    text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #bc13fe;
  }
  :active {
    color: white;
    background-color: white;
  }
`;
function UWUButton({ onClick, children }) {
  function NewlineText(text) {
    const newText = text.split("\n").map((str) => <div>{str}</div>);

    return newText;
  }

  return (
    <StyledButton
      onClick={(e) => {
        e.target.disabled = true;

        onClick();
        e.target.disabled = false;
      }}
    >
      {NewlineText(children)}
    </StyledButton>
  );
}
export default UWUButton;
