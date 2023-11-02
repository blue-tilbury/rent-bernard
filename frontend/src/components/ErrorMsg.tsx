import { Button } from "./Button";

type ErrorMsgProps = {
  msg: string;
  isReloadBtn: boolean;
};

export const ErrorMsg = ({ msg, isReloadBtn }: ErrorMsgProps) => {
  return (
    <section className="mx-auto flex h-[65vh] flex-col items-center pt-24">
      <p className="pb-10">{msg}</p>
      {isReloadBtn && (
        <Button
          size="md"
          color="primary"
          type="button"
          handleClick={() => (window.location.href = "/")}
        >
          Click here to reload the app
        </Button>
      )}
    </section>
  );
};
