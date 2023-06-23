import { useNavigate } from "react-router-dom";
import Axios from "axios";
import RefreshContacts from "../CRUDFunctionAbstractions/RefreshContacts";
import { useState, useEffect } from "react";
import GetRequests from "../CRUDFunctionAbstractions/GetRequests";
import DeleteFriend from "../CRUDFunctionAbstractions/DeleteFriend";
function ContactsMenu() {
  const navigate = useNavigate();
  const [contactLoading, setContactLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(true);

  const [nameListAfterSearch, updateList] = useState(null);
  let requestNum = JSON.parse(localStorage.getItem("Requests")).length;
  useEffect(() => {
    GetRequests(setRequestLoading);
    RefreshContacts(setContactLoading, updateList);
  }, []);

  function ContactsContainer(nameList) {
    return nameList ? (
      nameList.nameList.map((fre) => (
        <div>
          {fre.Friends}{" "}
          <button
            onClick={() =>
              DeleteFriend(fre.Friends, nameList.nameList, updateList)
            }
          >
            Remove
          </button>
          <button
            onClick={() =>
              navigate("./SendTask", { state: { user: fre.Friends } })
            }
          >
            {" "}
            Send Task
          </button>
        </div>
      ))
    ) : (
      <div></div>
    );
  }
  if (contactLoading) {
    return <>Loading</>;
  }
  if (requestLoading) {
    return <>Loading</>;
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
        let searchList = response.data.Data.filter((obj) =>
          JSON.parse(localStorage.getItem("Contacts")).some(
            (ele) => ele.Friends == obj.Users
          )
        ).map((ele) => {
          ele.Friends = ele.Users;
          return ele;
        });

        updateList(searchList);
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
        <>Contacts</>
        <button onClick={() => navigate("./AddContacts")}>
          Add new Contacts
        </button>
        <button onClick={() => navigate("./Requests")}>
          View Requests ( {requestNum} )
        </button>
        <form onSubmit={(e) => query(e)}>
          <input name="prefix"></input>
        </form>
        <ContactsContainer nameList={nameListAfterSearch} />
      </header>
    </div>
  );
}

export default ContactsMenu;
