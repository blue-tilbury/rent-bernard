type Props = {
  msg: string;
};

export const ErrorMsg = ({ msg }: Props) => {
  return (
    <section className="container flex h-[65vh] flex-col items-center pt-24">
      {msg}
    </section>
  );
};
