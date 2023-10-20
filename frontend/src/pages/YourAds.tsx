import { ErrorMsg } from "../components/ErrorMsg";
import { Loading } from "../components/Loading";
import { useYourRoom } from "../hooks/useAxios";
import { Thumb } from "../layouts/listing/thumb";
import { ListItem } from "../types/room.type";

export const YourAds = () => {
  const { data, isError, isLoading } = useYourRoom();

  if (isError)
    return (
      <ErrorMsg msg="Sorry, something wrong with the connection." isReloadBtn={true} />
    );
  if (isLoading) return <Loading />;
  if (!data || data.rooms.length === 0)
    return <ErrorMsg msg="Sorry, no ads found." isReloadBtn={false} />;

  const ads: ListItem[] = data.rooms;
  const thumbs = ads.map((ad) => <Thumb key={ad.id} room={ad} page="yourAds" />);

  return (
    <section className="container pb-16 pt-8">
      <h1 className="pb-4 pl-2 text-lg font-medium">Your Ads</h1>
      <ul className="flex flex-col space-y-4">{thumbs}</ul>
    </section>
  );
};
