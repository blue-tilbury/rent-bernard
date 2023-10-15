type ButtonProps = {
  children: React.ReactNode;
  size: "xs" | "sm" | "md" | "lg";
  color: "primary" | "secondary" | "danger";
  type: "submit" | "button";
  handleClick?(): void;
};

export const Button = ({ children, size, color, type, handleClick }: ButtonProps) => {
  let btnSize;
  let btnColor;

  switch (size) {
    case "xs":
      btnSize = "px-2 py-1 text-xs font-base";
      break;
    case "sm":
      btnSize = "px-4 py-2 text-sm font-base";
      break;
    case "md":
      btnSize = "px-8 py-2 text-md font-medium";
      break;
    case "lg":
      btnSize = "px-20 py-2 text-lg font-medium";
      break;
  }
  switch (color) {
    case "primary":
      btnColor = "bg-rent-light-blue hover:bg-rent-very-light-blue text-white";
      break;
    case "secondary":
      btnColor = "bg-white hover:bg-rent-bg-gray border border-rent-dark-blue";
      break;
    case "danger":
      btnColor = "bg-red-600 hover:bg-red-400 text-white";
      break;
  }

  return (
    <button
      type={type}
      className={`rounded-md ${btnColor} ${btnSize} shadow-md`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
