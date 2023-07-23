import AcceptRequest from "../CRUDFunctionAbstractions/AcceptRequest";
import RejectRequest from "../CRUDFunctionAbstractions/RejectRequest";
import { useState } from "react";
import NavigationBar from "../OtherComponents/NavigationBar";
import images from "../Assets/FinalBackground.png";
import Background from "../CSSComponents/Background";
import CheckUser from "../CRUDFunctionAbstractions/CheckUser";
function RequestMenu() {
  CheckUser();
  let [requests, updateRequests] = useState(
    JSON.parse(localStorage.getItem("Requests"))
  );
  console.log(requests);
  return (
    <div className="App">
      <header className="App-header">
        <Background image={images} />
        <div className="list">
          {requests.map((req) => (
            <div className="containerWithButtons">
              {req.Username}
              <div className="buttonContainer">
                <button
                  onClick={() => AcceptRequest(req.Username, updateRequests)}
                >
                  Accept
                </button>
                <button
                  onClick={() => RejectRequest(req.Username, updateRequests)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </header>
      <NavigationBar />
    </div>
  );
}

export default RequestMenu;
