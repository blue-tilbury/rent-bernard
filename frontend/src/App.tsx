import { GoogleOAuthProvider } from "@react-oauth/google";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { ErrorPage } from "./pages/ErrorPage";
import { Login } from "./pages/Login";
import { Posting } from "./pages/Posting";
import { Search } from "./pages/Search";
import { ThankYou } from "./pages/ThankYou";
import { Wishlist } from "./pages/Wishlist";
import { YourAds } from "./pages/YourAds";
import { Root } from "./routes/Root";

const clientId =
  "477582483733-fqk8g2caavivanck0tagmntvvkeikhvb.apps.googleusercontent.com";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Search /> },
          { path: "wishlist", element: <Wishlist /> },
          { path: "posting", element: <Posting /> },
          { path: "thankyou", element: <ThankYou /> },
          { path: "your-ads", element: <YourAds /> },
          { path: "*", element: <ErrorPage /> },
        ],
      },
    ],
  },
  { path: "login", element: <Login /> },
]);

export default function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  );
}
