import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

import { Button } from "../components/Button";

export const ThankYou = () => {
  return (
    <section className="container flex flex-col items-center pt-16 pb-24">
      <CheckCircleIcon className="h-60 w-60 text-rent-dark-green" />
      <h2 className="font-bold text-3xl pt-6 pb-3">Thank you!</h2>
      <p className="pb-16">Your submission has been sent.</p>
      <Link to="/">
        <Button name="Go back home" type="button" />
      </Link>
    </section>
  );
};
