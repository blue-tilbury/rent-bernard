import { Route, Routes } from "react-router-dom";

import { Layout } from "./layouts/index";
import { Posting } from "./pages/Posting";
import { Search } from "./pages/Search";
import { ThankYou } from "./pages/ThankYou";
import { Wishlist } from "./pages/Wishlist";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Search />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/posting" element={<Posting />} />
        <Route path="/thankyou" element={<ThankYou />} />
      </Route>
    </Routes>
  );
}
