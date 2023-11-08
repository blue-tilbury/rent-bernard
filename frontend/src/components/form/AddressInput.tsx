import { useEffect, useRef } from "react";
import { useController } from "react-hook-form";

import { AddressInputProps } from "../../types/form.type";

export const AddressInput = ({
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
        fields: ["address_components", "formatted_address", "geometry"],
      });

      const onPlaceChanged = () => {
        const place = autocomplete.getPlace();
        if (
          !place ||
          !place.geometry ||
          !place.geometry.location ||
          !place.formatted_address ||
          !place.address_components
        ) {
          field.onChange("");
          handleAddress({
            formatted_address: "",
            address_components: [],
            longitude: NaN,
            latitude: NaN,
          });
        } else {
          field.onChange(place.formatted_address);
          handleAddress({
            formatted_address: place.formatted_address,
            address_components: place.address_components,
            longitude: place.geometry.location.lng(),
            latitude: place.geometry.location.lat(),
          });
        }
      };

      autocomplete.addListener("place_changed", onPlaceChanged);
    })();
  });

  return (
    <div className="flex flex-1 flex-col lg:flex-none lg:basis-2/3">
      <input
        {...field}
        value={addressInfo.formatted_address}
        ref={autocompleteRef}
        onChange={(e) => {
          field.onChange("");
          handleAddress({
            formatted_address: e.target.value,
            address_components: [],
            longitude: NaN,
            latitude: NaN,
          });
        }}
        placeholder=""
        className="rounded border-rent-input-gray p-1 md:p-2"
      />
      {error?.message && (
        <p className="pl-1 pt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};
