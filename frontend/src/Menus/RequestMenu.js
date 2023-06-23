import AcceptRequest from "../CRUDFunctionAbstractions/AcceptRequest";
import RejectRequest from "../CRUDFunctionAbstractions/RejectRequest";
import { useState } from "react";
function RequestMenu() {
  let [requests, updateRequests] = useState(
    JSON.parse(localStorage.getItem("Requests"))
  );
  console.log(requests);
  return (
    <div className="App">
      <header className="App-header">
        {requests.map((req) => (
          <div>
            {req.Username}
            <button onClick={() => AcceptRequest(req.Username, updateRequests)}>
              Accept
            </button>
            <button onClick={() => RejectRequest(req.Username, updateRequests)}>
              Reject
            </button>
          </div>
        ))}
      </header>
    </div>
  );
}

export default RequestMenu;
