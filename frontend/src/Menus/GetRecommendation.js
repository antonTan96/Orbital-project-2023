import Background from "../CSSComponents/Background";
import NavigationBar from "../OtherComponents/NavigationBar";
import images from "../Assets/FinalBackground.png";
import GetRandomTask from "../CRUDFunctionAbstractions/GetRandomTask";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GetExistingTask from "../CRUDFunctionAbstractions/GetExistingTask";
import AddNewTask from "../CRUDFunctionAbstractions/AddNewTask";
import ChangeTask from "../CRUDFunctionAbstractions/ChangeTask";
function GetReccomendation() {
  const [newTask, setNewTask] = useState(null);
  const [existingTask, setExistingTask] = useState(null);
  const user = useParams().user;
  const navigate = useNavigate();
  const [off, setOff] = useState(false);
  useEffect(() => {
    GetRandomTask(setNewTask);
    GetExistingTask(setExistingTask);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Background image={images} />
        {newTask ? (
          <div className="list">
            <div
              className={off ? "checkable disabled" : "checkable"}
              onClick={() => {
                setOff(true);
                AddNewTask(newTask, user, navigate);
              }}
            >
              {newTask["Task Name"]}
            </div>

            {existingTask ? (
              <>
                <>or</>{" "}
                <div
                  className={off ? "checkable disabled" : "checkable"}
                  onClick={() => {
                    setOff(true);
                    ChangeTask(existingTask["Task ID"], navigate);
                  }}
                >
                  {existingTask["Task Name"]}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div></div>
        )}
      </header>
      <NavigationBar />
    </div>
  );
}

export default GetReccomendation;
