import Axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import SendRequest from "../CRUDFunctionAbstractions/SendRequest";
import CancelRequest from "../CRUDFunctionAbstractions/CancelRequest";
import NavigationBar from "../OtherComponents/NavigationBar";
import images from "../Assets/FinalBackground.png";
import Background from "../CSSComponents/Background";
import CheckUser from "../CRUDFunctionAbstractions/CheckUser";
function AddContactsMenu() {
  const searcher = useParams();
  const [list, updateList] = useState(null);
  CheckUser();

  console.log(list);
  function buttonBasedOnStatus(user) {
    console.log(user["Friend Status"]);
    switch (user["Friend Status"]) {
      case "Nothing":
        return (
          <button onClick={() => SendRequest(user.Users, list, updateList)}>
            Send Request
          </button>
        );
      case "Sent":
        return (
          <button onClick={() => CancelRequest(user.Users, list, updateList)}>
            Cancel Request
          </button>
        );

      default:
        return (
          <button onClick={() => SendRequest(user.Users, list, updateList)}>
            default?
          </button>
        );
    }
  }
  function query(e) {
    e.preventDefault();

    async function search(user) {
      try {
        const response = await Axios.post(
          `https://orbital-be.azurewebsites.net:443/user/search`,
          {
            Prefix: user.prefix,
          },
          {
            headers: {
              Token: localStorage.getItem("token"),
            },
          }
        );
        console.log("the response is");
        console.log(response); //returns array of objects of users
        updateList(
          response.data.Data.filter(
            (obj) =>
              obj.Username != searcher.user &&
              obj["Friend Status"] != "Accepted"
          )
        );
      } catch (e) {
        if (e.response && e.response.status === 400) {
          console.log(e.response);
        } else {
          console.log(e);
        }
      }
    }
    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    //fetch('/some-api', { method: form.method, body: formData });
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    search(formJson);
  }
  return (
    <div className="App">
      <Background image={images} />
      <header className="App-header">
        <form onSubmit={(e) => query(e)}>
          <input name="prefix"></input>
        </form>
        <div className="list">
          {list ? (
            list.length != 0 ? (
              list.map((user) => (
                <div
                  className="containerWithButtons"
                  style={{ wordWrap: "break-word" }}
                >
                  <div style={{ wordWrap: "break-word", maxWidth: "50%" }}>
                    {user.Users}
                  </div>
                  <div className="buttonContainer">
                    {buttonBasedOnStatus(user)}
                  </div>
                </div>
              ))
            ) : (
              <>No User</>
            )
          ) : (
            <>Search for User</>
          )}
        </div>
        <NavigationBar />
      </header>
    </div>
  );
}
export default AddContactsMenu;
