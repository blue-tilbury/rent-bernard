import { Outlet } from "react-router-dom";

import { Footer } from "../layouts/footer";
import { Navbar } from "../layouts/navbar";

export const Root = () => {
  return (
    <div className="bg-rent-bg-gray">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
