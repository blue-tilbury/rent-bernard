import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="w-full bg-rent-dark-blue">
      <div className="container py-10 text-white">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-3 pb-2 text-lg font-medium">
            <h2>RENT BERNARD</h2>
          </div>
          <div className="flex flex-2 flex-col gap-1 pb-8 text-sm font-light md:text-base">
            <Link to="/" className="hover:text-rent-light-gray">
              Room
            </Link>
            <Link to="/wishlist" className="hover:text-rent-light-gray">
              My Wishlist
            </Link>
            <Link to="/posting" className="hover:text-rent-light-gray">
              Post Ad
            </Link>
          </div>
        </div>
        <p className="text-center text-xs">
          &copy; 2023 RENT BERNARD, Inc. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};
