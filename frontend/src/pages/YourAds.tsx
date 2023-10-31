import { ErrorMsg } from "../components/ErrorMsg";
import { Spinner } from "../components/Spinner";
import { useYourRoom } from "../hooks/useAxios";
import { Thumb } from "../layouts/listing/thumb";
import { errorMessage } from "../shared/errorMessage";
import { ListItem } from "../types/room.type";

export const YourAds = () => {
  const { data, isError, isLoading, isValidating } = useYourRoom();

  if (isError) return <ErrorMsg msg={errorMessage.connection} isReloadBtn={true} />;
  if (isLoading || isValidating) return <Spinner />;
  if (!data || data.rooms.length === 0)
    return <ErrorMsg msg={errorMessage.noRoom} isReloadBtn={false} />;

  const ads: ListItem[] = data.rooms;
  const thumbs = ads.map((ad) => <Thumb key={ad.id} room={ad} page="yourAds" />);

  return (
    <section className="container pb-16 pt-8">
      <h1 className="pb-4 pl-2 text-lg font-medium">Your Ads</h1>
      <ul className="flex flex-col space-y-4">{thumbs}</ul>
    </section>
  );
};
