import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAtomValue } from "jotai";
import { RouterProvider, createBrowserRouter, redirect } from "react-router-dom";

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
import { loggedIn, userAtom } from "./shared/globalStateConfig";

const clientId =
  "477582483733-fqk8g2caavivanck0tagmntvvkeikhvb.apps.googleusercontent.com";

export default function App() {
  const user = useAtomValue(userAtom);

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
            {
              path: "wishlist",
              element: <Wishlist />,
              loader: () => (!loggedIn(user) ? redirect("/") : null),
            },
            {
              path: "posting",
              element: <Posting />,
              loader: () => (!loggedIn(user) ? redirect("/") : null),
            },
            {
              path: "posting/:id",
              element: <Posting />,
              loader: () => (!loggedIn(user) ? redirect("/") : null),
            },
            {
              path: "thankyou",
              element: <ThankYou />,
              loader: () => (!loggedIn(user) ? redirect("/") : null),
            },
            {
              path: "your-ads",
              element: <YourAds />,
              loader: () => (!loggedIn(user) ? redirect("/") : null),
            },
            {
              path: "your-reviews",
              element: <YourReviews />,
              loader: () => (!loggedIn(user) ? redirect("/") : null),
            },
            { path: "error", element: <ErrorPage /> },
            { path: "*", element: <ErrorPage /> },
          ],
        },
      ],
    },
    { path: "login", element: <Login /> },
  ]);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  );
}
