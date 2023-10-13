import { Route, Routes } from "react-router-dom";

import { Login } from "./pages/Login";
import { Posting } from "./pages/Posting";
import { Search } from "./pages/Search";
import { ThankYou } from "./pages/ThankYou";
import { Wishlist } from "./pages/Wishlist";
import { YourAds } from "./pages/YourAds";
import { Layout } from "./routes/Layout";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route index element={<Search />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/posting" element={<Posting />} />
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="/login" element={<Login />} />
        <Route path="/your-ads" element={<YourAds />} />
      </Route>
    </Routes>
  );
}
