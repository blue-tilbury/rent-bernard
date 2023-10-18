import { GoogleOAuthProvider } from "@react-oauth/google";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import {
  ErrorPage,
  Login,
  Posting,
  Search,
  ThankYou,
  Wishlist,
  YourAds,
  YourReviews,
} from "./pages";
import { Ad } from "./pages/Ad";
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
          { path: "ads/:id", element: <Ad /> },
          { path: "wishlist", element: <Wishlist /> },
          { path: "posting", element: <Posting /> },
          { path: "thankyou", element: <ThankYou /> },
          { path: "your-ads", element: <YourAds /> },
          { path: "your-reviews", element: <YourReviews /> },
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
