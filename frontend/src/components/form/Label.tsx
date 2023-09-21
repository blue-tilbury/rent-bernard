type labelProps = {
  name: string;
  required: boolean;
};

export const Label = ({ name, required }: labelProps) => {
  return (
    <p className={"text-end capitalize basis-1/6"}>
      {name}
      {required && <span className="text-red-600">*</span>}
    </p>
  );
};
