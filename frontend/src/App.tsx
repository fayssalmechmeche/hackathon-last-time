import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RegisterProfilePage from "./pages/RegisterProfilePage";
import EditProfilePage from "./pages/EditProfilePage";

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
