import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS for the default styles
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <App />
    <ToastContainer position="top-center" />
  </>
);
