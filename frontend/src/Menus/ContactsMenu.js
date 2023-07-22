import { useNavigate } from "react-router-dom";
import Axios from "axios";
import RefreshContacts from "../CRUDFunctionAbstractions/RefreshContacts";
import { useState, useEffect } from "react";
import GetRequests from "../CRUDFunctionAbstractions/GetRequests";
import DeleteFriend from "../CRUDFunctionAbstractions/DeleteFriend";
import NavigationBar from "../OtherComponents/NavigationBar";
import images from "../Assets/FinalBackground.png";
import Background from "../CSSComponents/Background";
import UWUButton from "../CSSComponents/UWUButton";
import SendTaskButton from "../OtherComponents/SendTaskButton";
import RemoveFriendButton from "../OtherComponents/RemoveFriendButton";
import "./../CSSComponents/container.css";
function ContactsMenu() {
  const navigate = useNavigate();
  const [contactLoading, setContactLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(true);

  const [nameListAfterSearch, updateList] = useState(null);

  useEffect(() => {
    GetRequests(setRequestLoading);
    RefreshContacts(setContactLoading, updateList);
  }, [requestLoading]);
  let requestNum = JSON.parse(localStorage.getItem("Requests"));
  if (requestNum) {
    requestNum = requestNum.length;
  }

  function ContactsContainer(nameList) {
    return nameList ? (
      nameList.nameList.map((fre) => (
        <div className="containerWithButtons">
          <>{fre.Friends} </>
          <div className="buttonContainer">
            <RemoveFriendButton
              onClick={() =>
                DeleteFriend(fre.Friends, nameList.nameList, updateList)
              }
            >
              Remove
            </RemoveFriendButton>
            <SendTaskButton
              onClick={() =>
                navigate("./SendTask", { state: { user: fre.Friends } })
              }
            >
              Send Task
            </SendTaskButton>
          </div>
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
        <Background image={images} />
        <>Contacts</>
        <UWUButton onClick={() => navigate("./AddContacts")}>
          Add new Contacts
        </UWUButton>
        <UWUButton onClick={() => navigate("./Requests")}>
          View Requests ( {requestNum} )
        </UWUButton>
        <div className="list">
          <form onSubmit={(e) => query(e)}>
            <input name="prefix" placeholder="Search your friends here"></input>
          </form>
          <ContactsContainer nameList={nameListAfterSearch} />
        </div>
        <NavigationBar />
      </header>
    </div>
  );
}

export default ContactsMenu;
