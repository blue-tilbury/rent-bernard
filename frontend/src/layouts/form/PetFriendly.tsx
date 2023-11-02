import { Label } from "../../components/form/Label";
import { RadioButton } from "../../components/form/RadioButton";
import { ControlledInputProps } from "../../types/form.type";
import { PostRoom } from "../../types/room.type";

export const PetFriendly = ({ control, error }: ControlledInputProps<PostRoom>) => {
  return (
    <div className="flex">
      <Label name="Pet Friendly" required={true} />
      <RadioButton control={control} name="is_pet_friendly" error={error} />
    </div>
  );
};
