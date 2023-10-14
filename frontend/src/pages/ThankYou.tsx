import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

import { Button } from "../components/Button";

export const ThankYou = () => {
  return (
    <section className="container flex flex-col items-center pb-24 pt-16">
      <CheckCircleIcon className="h-60 w-60 text-rent-dark-green" />
      <h2 className="pb-3 pt-6 text-3xl font-bold">Thank you!</h2>
      <p className="pb-16">Your submission has been sent.</p>
      <Link to="/">
        <Button size="lg" color="primary" type="button">
          Go back home
        </Button>
      </Link>
    </section>
  );
};
