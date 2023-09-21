import roomImg from "../assets/sample.jpeg";
import { RoomListing } from "../layouts/listing/RoomListing";

const rooms = [
  {
    id: 0,
    title: "Room 1",
    price: 100000,
    location: "Vancuover",
    posted: "20 mins ago",
    img: roomImg,
    updated_at: "20",
  },
  {
    id: 1,
    title: "Room 1",
    price: 100000,
    location: "Vancuover",
    posted: "20 mins ago",
    img: roomImg,
    updated_at: "20",
  },
];

export const Search = () => {
  const roomListing = rooms.map((room) => (
    <li key={room.id} className="flex-1 flex-col sm:flex-1/3">
      <RoomListing {...room} />
    </li>
  ));

  return (
    <section id="search" className="container py-6">
      <h2 className="p-2 text-sm">Showing 1-2 of 2 results</h2>
      <ul className="flex list-none">{roomListing}</ul>
    </section>
  );
};
