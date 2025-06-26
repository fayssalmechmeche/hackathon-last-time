import { createBrowserRouter, RouterProvider } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import ServicesPage from "./pages/DisplayServices";
import EditProfilePage from "./pages/EditProfilePage";
import HomePage from "./pages/HomePage";
import ListServices from "./pages/ListServices";
import LoginPage from "./pages/LoginPage";
import ManageServicesPage from "./pages/ManageServicesPage";
import RegisterPage from "./pages/RegisterPage";
import RegisterProfilePage from "./pages/RegisterProfilePage";
import ServiceFormPage from "./pages/ServiceFormPage";

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
    element: (
      <ProtectedRoute>
        <EditProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/services",
    element: <ServicesPage />,
  },
  {
    path: "/services/list",
    element: (
      <ProtectedRoute>
        <ListServices />
      </ProtectedRoute>
    ),
  },
  {
    path: "/services/manage",
    element: (
      <ProtectedRoute>
        <ManageServicesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/service/:serviceId",
    element: <ServiceFormPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
