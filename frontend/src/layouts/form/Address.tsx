import { ControlledTextInput } from "../../components/form/ControlledTextInput";
import { Label } from "../../components/form/Label";
import { AddressInputProps } from "../../types/form.type";

export const Address = ({
  control,
  error,
  handleAddress,
  addressInfo,
}: AddressInputProps) => {
  return (
    <div className="flex items-baseline gap-3">
      <Label name="Address" required={true} />
      <div className="basis-4/6">
        <ControlledTextInput
          control={control}
          name="place_id"
          error={error}
          handleAddress={handleAddress}
          addressInfo={addressInfo}
        />
      </div>
    </div>
  );
};
