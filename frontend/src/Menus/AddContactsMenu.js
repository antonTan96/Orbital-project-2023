import Axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import SendRequest from "../CRUDFunctionAbstractions/SendRequest";
import CancelRequest from "../CRUDFunctionAbstractions/CancelRequest";
function AddContactsMenu() {
  const searcher = useParams();
  const [list, updateList] = useState(null);

  console.log(list);
  function buttonBasedOnStatus(user) {
    console.log(user);
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
          response.data.Data.filter((obj) => obj.Username != searcher.user)
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
      <header className="App-header">
        <form onSubmit={(e) => query(e)}>
          <input name="prefix"></input>
        </form>
        {list ? (
          list.length != 0 ? (
            list.map((user) => (
              <div>
                <>{user.Users}</> {buttonBasedOnStatus(user)}
              </div>
            ))
          ) : (
            <>No User</>
          )
        ) : (
          <>Search for User</>
        )}
      </header>
    </div>
  );
}
export default AddContactsMenu;
