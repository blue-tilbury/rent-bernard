import { Label } from "../../components/form/Label";
import { TextInput } from "../../components/form/TextInput";
import { InputProps } from "../../types/register.type";

export const Location = ({ register, error }: InputProps) => {
  return (
    <div className="flex items-baseline">
      <Label name="Location" required={true} />
      <div className="basis-4/6">
        <TextInput
          register={register}
          name="area"
          error={error}
          style="rounded border-rent-input-gray"
        />
        <TextInput
          register={register}
          name="street"
          style="rounded border-rent-input-gray mt-2"
        />
      </div>
    </div>
  );
};
