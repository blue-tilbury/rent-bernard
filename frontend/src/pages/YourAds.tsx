import roomImg from "../assets/sample.jpeg";
import { Thumb } from "../layouts/listing/Thumb";

const ads = [
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

export const YourAds = () => {
  const thumbs = ads.map((ad) => <Thumb key={ad.id} room={ad} page="yourAds" />);

  return (
    <section className="container pb-16 pt-8">
      <h1 className="pb-4 pl-2 text-lg font-medium">Your Ads</h1>
      <ul className="flex flex-col space-y-4">{thumbs}</ul>
    </section>
  );
};
