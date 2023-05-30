import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import CurrentTaskMenu from "./Menus/CurrentTaskMenu";
import AllTaskMenu from "./Menus/AllTaskMenu";
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
]);
