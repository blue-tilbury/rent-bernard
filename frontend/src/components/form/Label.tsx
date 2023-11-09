type labelProps = {
  name: string;
  required: boolean;
};

export const Label = ({ name, required }: labelProps) => {
  return (
    <p className="basis-1/6 text-sm capitalize md:text-end md:text-base">
      {name}
      {required && <span className="text-red-600">*</span>}
    </p>
  );
};
