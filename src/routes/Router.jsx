import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayouts";

import Home from "../pages/Home";
import Bookings from "../pages/Bookings";
import Users from "../pages/Users";
import Summary from "../pages/Summary";
import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,

    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "bookings",
        element: <Bookings />,
      },

      {
        path: "users",
        element: <Users />,
      },

      {
        path: "summary",
        element: <Summary />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
