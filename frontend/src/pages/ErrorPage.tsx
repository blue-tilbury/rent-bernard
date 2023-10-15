import { Button } from "../components/Button";

export const ErrorPage = () => {
  return (
    <div className="container flex h-[65vh] flex-col items-center pt-24">
      <h1 className="text-2xl font-medium">Oops!</h1>
      <p className="pb-10">Sorry, an unexpected error has occurred.</p>
      <Button
        size="md"
        color="primary"
        type="button"
        handleClick={() => (window.location.href = "/")}
      >
        Click here to reload the app
      </Button>
    </div>
  );
};
