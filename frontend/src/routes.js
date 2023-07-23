import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import CurrentTaskMenu from "./Menus/CurrentTaskMenu";
import AllTaskMenu from "./Menus/AllTaskMenu";
import ChangeTaskMenu from "./Menus/ChangeTaskMenu";
import ContactsMenu from "./Menus/ContactsMenu";
import AddContactsMenu from "./Menus/AddContactsMenu";
import RequestMenu from "./Menus/RequestMenu";
import SendTaskMenu from "./Menus/SendTaskMenu";
import AccountActivationPage from "./Authentication/AccountAcivationPage";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: `/:user/Menu`,
    element: <CurrentTaskMenu />,
  },
  {
    path: `/:user/AllTasks`,
    element: <AllTaskMenu />,
  },
  {
    path: `/:user/ChangeTask`,
    element: <ChangeTaskMenu />,
  },
  {
    path: `/:user/Contacts`,
    element: <ContactsMenu />,
  },
  {
    path: `/:user/Contacts/AddContacts`,
    element: <AddContactsMenu />,
  },
  {
    path: `/:user/Contacts/Requests`,
    element: <RequestMenu />,
  },
  {
    path: `/:user/Contacts/SendTask`,
    element: <SendTaskMenu />,
  },
  {
    path: `/activate`,
    element: <AccountActivationPage />,
  },
]);
