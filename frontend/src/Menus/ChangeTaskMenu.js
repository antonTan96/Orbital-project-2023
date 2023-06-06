import UWUButton from "../CSSComponents/UWUButton";
function ChangeTaskMenu() {
  const tasks = {
    task: "nothing",
    deadline: "nothing",
  };
  function changeTask() {
    console.log("fuck");
  }
  return (
    <div className="App">
      <header className="App-header">
        {tasks.map((e) => (
          <UWUButton
            onClick={() => changeTask()}
            children={`${e.task}
             ${e.deadline}`}
          ></UWUButton>
        ))}
      </header>
    </div>
  );
}
export default ChangeTaskMenu;
