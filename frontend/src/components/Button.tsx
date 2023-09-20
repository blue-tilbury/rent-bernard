type ButtonProps = {
  name: string;
  type: "submit" | "button";
};

export const Button = ({ name, type }: ButtonProps) => {
  return (
    <button
      type={type}
      className="rounded-md bg-rent-light-blue px-20 py-2 text-lg font-medium text-white shadow-md hover:bg-rent-very-light-blue"
    >
      {name}
    </button>
  );
};
