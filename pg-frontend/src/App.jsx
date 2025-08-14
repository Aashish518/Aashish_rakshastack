import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Ownerdashboard from "./pages/Ownerdashboard";
import Pgdetails from "./pages/Pgdetails";
import PGListingPage from "./pages/Pglisting";
import SavedPGs from "./pages/Savedpg";
import "./App.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/Profile",
    element: <Profile />,
  },
  {
    path: "/owner-dashboard",
    element: <Ownerdashboard />,
  },
  {
    path: "/pg-detail/:id",
    element: <Pgdetails />,
  },
  {
    path: "/pg-listing",
    element: <PGListingPage />,
  },
  {
    path: "/saved-pg",
    element: <SavedPGs />,
  }
]);

const App = () => {
  return(
    <RouterProvider router={router} />
  )
}

export default App
