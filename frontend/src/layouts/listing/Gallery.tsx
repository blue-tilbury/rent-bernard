import { MapPinIcon } from "@heroicons/react/24/solid";

type GalleryProps = {
  title: string;
  price: number;
  location: string;
  img: string;
  updated_at: string;
};

export const Gallery = (props: GalleryProps) => {
  return (
    <div className="flex flex-1 flex-col rounded-md bg-white p-6 shadow-sm hover:shadow-lg sm:flex-1/3">
      <img className="rounded-lg" src={props.img} />
      <div className="flex flex-col px-2 pt-4">
        <h2 className="text-lg font-medium text-rent-blue">{props.title}</h2>
        <p className="text-lg font-semibold text-rent-dark-green">${props.price}</p>
        <div className="flex items-center">
          <MapPinIcon className="h-4 w-4 text-rent-gray" />
          <p className="pl-1 text-sm text-rent-gray">{props.location}</p>
        </div>
        <p className="text-sm text-rent-gray">{props.updated_at} mins ago</p>
      </div>
    </div>
  );
};
