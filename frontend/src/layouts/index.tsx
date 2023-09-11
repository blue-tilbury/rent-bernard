import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export const Layout = () => {
  return (
    <div className="bg-rent-background-gray">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
