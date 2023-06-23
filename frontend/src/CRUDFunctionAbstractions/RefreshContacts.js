import Axios from "axios";
//Returns a list of contacts

function RefreshContacts(setLoading, updateList) {
  Axios.get("https://orbital-be.azurewebsites.net:443/friend", {
    headers: {
      Token: localStorage.getItem("token"),
    },
  })
    .then((response) => {
      localStorage.setItem("Contacts", JSON.stringify(response.data.Data));
      console.log("Contacts Set as");
      console.log(JSON.parse(localStorage.getItem("Contacts")));
      updateList(JSON.parse(localStorage.getItem("Contacts")));
      setLoading(false);
    })
    .catch((e) => console.log(e));
}

export default RefreshContacts;
