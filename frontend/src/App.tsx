import { createBrowserRouter, RouterProvider } from "react-router";
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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
