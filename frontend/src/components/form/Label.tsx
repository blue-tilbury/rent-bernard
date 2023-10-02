type labelProps = {
  name: string;
  required: boolean;
};

export const Label = ({ name, required }: labelProps) => {
  return (
    <p className={"basis-1/6 text-end capitalize"}>
      {name}
      {required && <span className="text-red-600">*</span>}
    </p>
  );
};
