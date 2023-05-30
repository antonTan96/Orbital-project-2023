import { useLocation } from "react-router-dom";

function AllTaskMenu() {
  const { state } = useLocation();
  const taskList = state.taskList;
  //to be replaced with get data
  const tasks = {
    list: [
      {
        task: "suck cock",
        deadline: "2023-05-08",
      },
      {
        task: "suck more cock",
        deadline: "2023-05-09",
      },
      {
        task: "suck moar cock",
        deadline: "2023-05-10",
      },
    ],
  };
  return state.login ? (
    <div className="App">
      <header className="App-header">
        {tasks.list.map((e) => (
          <>
            <div>{e.task}</div>
            <>{e.deadline}</>
          </>
        ))}
      </header>
    </div>
  ) : (
    <>Nothing here, go look at your own stuff</>
  );
}
/*
{tasks.map((e) => (
          <>
            <div>{e.task}</div>
            <>{e.deadline}</>
          </>
        ))}
        */

export default AllTaskMenu;
