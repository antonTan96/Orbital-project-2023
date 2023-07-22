import "./../CSSComponents/Buttons.css";
function XButton(props) {
  return (
    <div className="base" onClick={props.onClick}>
      <div className="XButton"></div>
    </div>
  );
}

export default XButton;
