import { createBrowserRouter, RouterProvider } from "react-router";
import DisplayServices from "./pages/DisplayServices";
import EditProfilePage from "./pages/EditProfilePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RegisterProfilePage from "./pages/RegisterProfilePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/register/profile",
    element: <RegisterProfilePage />,
  },
  {
    path: "/profile/edit",
    element: <EditProfilePage />,
  },
  {
    path: "/services",
    element: <DisplayServices />, // Assuming DisplayServices is the main service page
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
