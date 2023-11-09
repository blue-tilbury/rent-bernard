import { AddressInput } from "../../components/form/AddressInput";
import { Label } from "../../components/form/Label";
import { AddressInputProps } from "../../types/form.type";

export const Address = ({
  control,
  error,
  handleAddress,
  addressInfo,
}: AddressInputProps) => {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-3">
      <Label name="Address" required={true} />
      <AddressInput
        control={control}
        name="formatted_address"
        error={error}
        handleAddress={handleAddress}
        addressInfo={addressInfo}
      />
    </div>
  );
};
