import { Outlet } from "react-router-dom";

import { Footer } from "./footer";
import { Navbar } from "./navbar";

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
