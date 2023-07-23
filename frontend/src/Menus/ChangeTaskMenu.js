import UWUButton from "../CSSComponents/UWUButton";
import RefreshTasks from "../CRUDFunctionAbstractions/RefreshTasks";
import { useEffect, useState } from "react";
import "./../CSSComponents/modal.css";
import Axios from "axios";
import NavigationBar from "../OtherComponents/NavigationBar";
import images from "../Assets/FinalBackground.png";
import Background from "../CSSComponents/Background";
import { useNavigate } from "react-router-dom";
import CheckUser from "../CRUDFunctionAbstractions/CheckUser";
import ChangeTask from "../CRUDFunctionAbstractions/ChangeTask";

function ChangeTaskMenu() {
  const [tasks, changeTasks] = useState(null);
  const navigate = useNavigate();
  CheckUser();
  useEffect(() => {
    RefreshTasks(changeTasks);
  }, []);

  if (tasks == null) {
    return <header className="App-header"></header>;
  }
  return (
    <div className="App">
      <header className="App-header">
        <Background image={images} />
        {tasks.map((e) => (
          <UWUButton onClick={() => ChangeTask(e["Task ID"], navigate)}>
            {`${e["Task Name"]}
             ${e.Deadline.slice(0, 10)}`}
          </UWUButton>
        ))}
      </header>
      <NavigationBar />
    </div>
  );
}
export default ChangeTaskMenu;
