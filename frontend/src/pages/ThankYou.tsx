import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

import { Button } from "../components/Button";

export const ThankYou = () => {
  return (
    <section className="container flex flex-col items-center pb-24 pt-16">
      <CheckCircleIcon className="h-36 w-36 text-rent-dark-green lg:h-60 lg:w-60" />
      <h2 className="pb-3 pt-6 text-xl font-semibold lg:text-3xl lg:font-bold">
        Thank you!
      </h2>
      <p className="pb-16">Your submission has been sent.</p>
      <Link to="/">
        <Button size="lg" color="primary" type="button">
          Go back home
        </Button>
      </Link>
    </section>
  );
};
