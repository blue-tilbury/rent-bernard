import { Navbar } from "./layouts/navbar";
import { Search } from "./pages/Search";
import { Footer } from "./layouts/footer";

export default function App() {
  return (
    <div className="bg-rent-background-gray">
      <Navbar />
      <Search />
      <Footer />
    </div>
  );
}
