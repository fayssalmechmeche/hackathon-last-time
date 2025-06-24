import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>Hello World</h1>,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
