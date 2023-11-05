import { MapPinIcon } from "@heroicons/react/24/solid";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useMemo } from "react";

type MapProps = {
  formatted_address: string;
  latitude: number;
  longitude: number;
};

const containerStyle = {
  width: "400px",
  height: "320px",
};

export const Map = ({ formatted_address, latitude, longitude }: MapProps) => {
  const center = useMemo(
    () => ({
      lat: latitude,
      lng: longitude,
    }),
    [latitude, longitude],
  );
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
  });

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      new google.maps.Marker({
        map: map,
        position: center,
      });
    },
    [center],
  );

  return (
    <>
      <div className="flex justify-center pt-10">
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            onLoad={onLoad}
          />
        )}
      </div>
      <div className="flex pb-20 pt-3">
        <MapPinIcon className="my-1 h-4 w-4 shrink-0" />
        <p className="pl-1">{formatted_address}</p>
      </div>
    </>
  );
};
