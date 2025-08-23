import "./App.css";
import { RouterProvider } from "react-router-dom";
import route from "./Routes/index.jsx";

function App() {
  return (
    <>
      <RouterProvider router={route} />
    </>
  );
}

export default App;
