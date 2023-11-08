import { Label } from "../../components/form/Label";
import { TextInput } from "../../components/form/TextInput";
import { InputProps } from "../../types/form.type";

export const Email = ({ register, error }: InputProps) => {
  return (
    <label className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-3">
      <Label name="Email" required={true} />
      <TextInput
        register={register}
        name="email"
        style="rounded border-rent-input-gray p-1 md:p-2"
        error={error}
      />
    </label>
  );
};
