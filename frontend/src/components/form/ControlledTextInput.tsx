import { useEffect, useRef } from "react";
import { useController } from "react-hook-form";

import { AddressInputProps } from "../../types/form.type";

export const ControlledTextInput = ({
  control,
  name,
  error,
  handleAddress,
  addressInfo,
}: AddressInputProps) => {
  const { field } = useController({ control, name });
  const autocompleteRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    (async () => {
      const { Autocomplete } = (await google.maps.importLibrary(
        "places",
      )) as google.maps.PlacesLibrary;

      if (!autocompleteRef.current) return;
      const autocomplete = new Autocomplete(autocompleteRef.current as HTMLInputElement, {
        componentRestrictions: { country: "ca" },
        fields: ["place_id", "address_components", "formatted_address"],
      });

      const onPlaceChanged = () => {
        const place = autocomplete.getPlace();
        if (
          !place ||
          !place.place_id ||
          !place.formatted_address ||
          !place.address_components
        ) {
          field.onChange("");
          handleAddress({
            formatted_address: "",
            address_components: [],
            inputValue: "",
          });
        } else {
          field.onChange(place.place_id);
          handleAddress({
            formatted_address: place.formatted_address,
            address_components: place.address_components,
            inputValue: place.formatted_address,
          });
        }
      };

      autocomplete.addListener("place_changed", onPlaceChanged);
    })();
  });

  return (
    <div className="flex basis-4/6 flex-col">
      <input
        {...field}
        value={addressInfo.inputValue}
        ref={autocompleteRef}
        onChange={(e) => {
          field.onChange("");
          handleAddress({
            formatted_address: "",
            address_components: [],
            inputValue: e.target.value,
          });
        }}
        placeholder=""
        className="rounded border-rent-input-gray"
      />
      {error?.message && (
        <p className="pl-1 pt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};
