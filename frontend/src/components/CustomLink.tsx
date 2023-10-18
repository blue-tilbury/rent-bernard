import { Link } from "react-router-dom";

import { PagePath } from "../types/common.type";

type CustomLinkProps = {
  children: React.ReactNode;
  to: PagePath;
  type: "navbar" | "userMenu" | "footer" | "noStyle";
};

export const CustomLink = ({ children, to, type }: CustomLinkProps) => {
  let style;

  switch (type) {
    case "navbar":
      style = "p-2 text-sm font-bold text-rent-gray hover:text-rent-dark-blue";
      break;
    case "userMenu":
      style =
        "hover:bg-rent-very-light-gray flex items-center gap-3 py-1 pl-2 hover:rounded-md";
      break;
    case "footer":
      style = "hover:text-rent-light-gray";
      break;
    case "noStyle":
      style = "";
      break;
  }

  return (
    <Link to={to} className={style}>
      {children}
    </Link>
  );
};
