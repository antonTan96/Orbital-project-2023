import "./../App.css";

function CurrentTaskMenu({ someTask }) {
  let datestr = "";
  for (let i = 0; i < someTask[1].length - 1; i++) {
    datestr += someTask[1][i] + "/";
  }
  datestr += someTask[1][someTask[1].length - 1];
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <em>Current Task</em>
        </div>
        <div>{someTask[0]}</div>
        <div>Deadline : {datestr}</div>
      </header>
    </div>
  );
}

export default CurrentTaskMenu;
