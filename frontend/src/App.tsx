import { Routes, Route } from "react-router-dom";
import { Search } from "./pages/Search";
import { Posting } from "./pages/Posting";
import { Layout } from "./layouts/index";
import { Wishlist } from "./pages/Wishlist";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Search />} />
        <Route path="/posting" element={<Posting />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Route>
    </Routes>
  );
}
