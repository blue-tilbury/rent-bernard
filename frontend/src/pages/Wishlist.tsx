import { ErrorMsg } from "../components/ErrorMsg";
import { Spinner } from "../components/Spinner";
import { useWishlist } from "../hooks/useAxios";
import { Thumb } from "../layouts/listing/thumb";
import { errorMessage } from "../shared/errorMessage";

export const Wishlist = () => {
  const { data, isError, isLoading, isValidating } = useWishlist();

  if (isError) return <ErrorMsg msg={errorMessage.connection} isReloadBtn={true} />;
  if (isLoading || isValidating) return <Spinner />;
  if (!data || data.rooms.length === 0)
    return <ErrorMsg msg={errorMessage.noRoom} isReloadBtn={false} />;

  const { rooms } = data;
  const thumbs = rooms.map((room) => <Thumb key={room.id} room={room} page="wishlist" />);

  return (
    <section className="container pb-16 pt-8">
      <h1 className="pb-4 pl-2 text-lg font-medium">Your Wishlist</h1>
      <ul className="flex list-none flex-col space-y-4">{thumbs}</ul>
    </section>
  );
};
