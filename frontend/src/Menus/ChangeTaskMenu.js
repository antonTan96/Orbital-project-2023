import UWUButton from "../CSSComponents/UWUButton";
import RefreshTasks from "../OtherComponents/RefreshTasks";
import { useEffect, useState } from "react";
function ChangeTaskMenu() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    RefreshTasks(setLoading);
  });
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  function changeTask() {
    console.log("fuck");
  }
  if (loading) {
    return <>Loading</>;
  }

  return (
    <div className="App">
      <header className="App-header">
        {tasks.map((e) => (
          <UWUButton
            onClick={() => changeTask()}
            children={`${e.Name}
             ${e.Deadline}`}
          ></UWUButton>
        ))}
      </header>
    </div>
  );
}
export default ChangeTaskMenu;
