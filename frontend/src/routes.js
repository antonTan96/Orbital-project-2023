import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import task from "./Menus/SampleTask";
import CurrentTaskMenu from "./Menus/CurrentTaskMenu";
export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/Menu",
    element: <CurrentTaskMenu someTask={task} />,
  },
]);
