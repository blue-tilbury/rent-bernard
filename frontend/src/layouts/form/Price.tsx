import { Label } from "../../components/form/Label";
import { NumberInput } from "../../components/form/NumberInput";
import { InputProps } from "../../types/form.type";

export const Price = ({ register, error }: InputProps) => {
  return (
    <label className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-3">
      <Label name="Price" required={true} />
      <NumberInput register={register} name="price" error={error} />
    </label>
  );
};
