import "./../CSSComponents/Buttons.css";
function RemoveFriendButton(props) {
  return (
    <button className="RemoveFriendButton" onClick={props.onClick}></button>
  );
}

export default RemoveFriendButton;
