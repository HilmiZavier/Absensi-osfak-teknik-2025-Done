import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout/navbar";
import BarcodeScanner from "../pages/BarcodeScanner";
import DATA from "../pages/Maba";
import Login from "../pages/login";
import ProtectedRoute from "./ProtectedRoute";
import Absen from "../pages/absen";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <BarcodeScanner />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "/DataMahasiswa",
      //   element: (
      //     <ProtectedRoute>
      //       <DATA />
      //     </ProtectedRoute>
      //   ),
      // },
      {
        path: "/DataMahasiswa",
        element: (
          <ProtectedRoute>
            <Absen />
          </ProtectedRoute>
        ),
      },
      { path: "login", element: <Login /> },
    ],
  },
]);
export default route;
