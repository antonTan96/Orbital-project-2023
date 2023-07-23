import "./../CSSComponents/Buttons.css";
function SendTaskButton(props) {
  return <button className="SendTaskButton" onClick={props.onClick}></button>;
}

export default SendTaskButton;
