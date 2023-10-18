import { Link } from "react-router-dom";

type LoginLinkProps = {
  isVisible: boolean;
};

export const LoginLink = ({ isVisible }: LoginLinkProps) => {
  return (
    <Link
      to="login"
      className={
        isVisible
          ? "p-2 text-sm font-bold text-rent-gray hover:text-rent-dark-blue"
          : "hidden"
      }
    >
      LOGIN
    </Link>
  );
};
