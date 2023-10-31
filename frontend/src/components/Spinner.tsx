import CircularProgress from "@mui/material/CircularProgress";

export const Spinner = () => {
  return (
    <section className={`container flex justify-center pt-24`}>
      <CircularProgress />
    </section>
  );
};
