import styled from "styled-components";
import React from "react";

const StyledButton = styled.button`
  color: white;
  height: ${(props) => props.height ?? "auto"};
  width: ${(props) => props.width ?? "50%"};
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
  :disabled {
    opacity: 0.6;
  }
`;
function UWUButton(props) {
  function NewlineText(text) {
    let x = "";
    for (let i = 0; i < text.length; i++) {
      x += text[i];
    }
    const newText = x.split("\n").map((str) => <div>{str}</div>);

    return newText;
  }
  console.log(props.children);
  return (
    <StyledButton
      id={props.id}
      onClick={(e) => {
        props.onClick();
      }}
      width={props.width}
      disabled={props.disabled ? true : false}
    >
      {NewlineText(props.children)}
    </StyledButton>
  );
}
export default UWUButton;
