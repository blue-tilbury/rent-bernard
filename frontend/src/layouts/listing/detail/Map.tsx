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
  flex: 1,
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
    <div className="flex flex-col pb-10 lg:flex-col-reverse lg:pt-10">
      <div className="flex pb-3 lg:pb-0 lg:pt-3">
        <MapPinIcon className="my-1 h-4 w-4 shrink-0" />
        <p className="pl-1">{formatted_address}</p>
      </div>
      {isLoaded && (
        <div className="flex justify-center">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            onLoad={onLoad}
          />
        </div>
      )}
    </div>
  );
};
