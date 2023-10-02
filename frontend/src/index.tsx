import { GoogleOAuthProvider } from "@react-oauth/google";
import * as React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

const clientId =
  "477582483733-fqk8g2caavivanck0tagmntvvkeikhvb.apps.googleusercontent.com";
const router = createBrowserRouter([{ path: "*", Component: App }]);

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
