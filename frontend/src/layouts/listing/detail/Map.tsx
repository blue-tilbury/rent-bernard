import { MapPinIcon } from "@heroicons/react/24/solid";

type MapProps = {
  place_id: string;
  formatted_address: string;
};

// TODO: Implement the map
export const Map = ({ place_id, formatted_address }: MapProps) => {
  console.log(place_id);

  return (
    <>
      <div className="pt-10">Map here</div>
      <div className="flex pb-20">
        <MapPinIcon className="h-7 w-7" />
        <p className="pl-1">{formatted_address}</p>
      </div>
    </>
  );
};
