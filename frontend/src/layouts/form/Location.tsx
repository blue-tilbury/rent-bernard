import { Label } from "../../components/form/Label";
import { TextInput } from "../../components/form/TextInput";
import { InputProps } from "../../types/form.type";

export const Location = ({ register, error }: InputProps) => {
  return (
    <div className="flex items-baseline gap-3">
      <Label name="Location" required={true} />
      <div className="basis-4/6">
        <TextInput
          register={register}
          name="city"
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
