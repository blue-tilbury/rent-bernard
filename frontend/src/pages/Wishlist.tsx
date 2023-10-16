import roomImg from "../assets/sample.jpeg";
import { Thumb } from "../layouts/listing/Thumb";

const rooms = [
  {
    id: 0,
    title: "Room 1",
    price: 100000,
    city: "Vancuover",
    image_urls: roomImg,
    updated_at: "20",
  },
  {
    id: 1,
    title: "Room 1",
    price: 100000,
    city: "Vancuover",
    image_urls: roomImg,
    updated_at: "20",
  },
];

export const Wishlist = () => {
  const thumbs = rooms.map((room) => <Thumb key={room.id} room={room} page="wishlist" />);

  return (
    <section className="container pb-16 pt-8">
      <h2 className="pb-4 pl-2 text-sm">Showing 1-2 of 2 results</h2>
      <ul className="flex list-none flex-col space-y-4">{thumbs}</ul>
    </section>
  );
};
