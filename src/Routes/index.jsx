import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout/navbar";
import BarcodeScanner from "../pages/Barcodescanner";
import DATA from "../pages/Maba";
import Login from "../pages/login";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <BarcodeScanner />,
      },
      {
        path: "/DataMahasiswa",
        element: <DATA />,
      },
      { path: "login", element: <Login /> },
    ],
  },
]);
export default route;
