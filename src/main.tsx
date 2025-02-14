import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/system";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <NextUIProvider>
        <App></App>
      </NextUIProvider>
    </BrowserRouter>
);
