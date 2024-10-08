import { createRoot } from "react-dom/client";
import "./styles/index.css";
import Router from "./Routes/Router";

createRoot(document.getElementById("root")!).render(<Router />);
