import roomImg from "../assets/sample.jpeg";
import { Gallery } from "../layouts/listing/Gallery";

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
  const galleries = rooms.map((room) => <Gallery key={room.id} {...room} />);

  return (
    <section id="search" className="container py-6">
      <h2 className="p-2 text-sm">Showing 1-2 of 2 results</h2>
      <ul className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        {galleries}
      </ul>
    </section>
  );
};
