export const Footer = () => {
  return (
    <footer className="absolute bottom-0 w-full bg-black">
      <div className="container py-10 text-white">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-3 pb-2 text-lg font-medium">
            <h2>RENT BERNARD</h2>
          </div>
          <ul className="flex flex-2 flex-col gap-1 pb-8 text-sm font-light md:text-base">
            <li>
              <a href="/">Room</a>
            </li>
            <li>
              <a href="/wishlist">My Wishlist</a>
            </li>
            <li>
              <a href="/about-us">About Us</a>
            </li>
          </ul>
        </div>
        <p className="text-center text-xs">
          &copy; 2023 RENT BERBARD, Inc. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};
