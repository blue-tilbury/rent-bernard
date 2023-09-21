import roomImg from "../assets/sample.jpeg";
import { WishListing } from "../layouts/listing/WishListing";

const rooms = [
  {
    id: 0,
    title: "Room 1",
    price: 100000,
    location: "Vancuover",
    img: roomImg,
    updated_at: "20",
  },
  {
    id: 1,
    title: "Room 1",
    price: 100000,
    location: "Vancuover",
    img: roomImg,
    updated_at: "20",
  },
];

export const Wishlist = () => {
  const wishlistListing = rooms.map((room) => (
    <li key={room.id} className="flex-1 flex-col p-2">
      <WishListing {...room} />
    </li>
  ));
  return (
    <section className="wishlist container py-6">
      <h2 className="p-2 text-sm">Showing 1-2 of 2 results</h2>
      <ul className="flex flex-col list-none">{wishlistListing}</ul>
    </section>
  );
};
