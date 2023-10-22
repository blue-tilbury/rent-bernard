import { ErrorMsg } from "../components/ErrorMsg";
import { Loading } from "../components/Loading";
import { useWishlist } from "../hooks/useAxios";
import { Thumb } from "../layouts/listing/thumb";

export const Wishlist = () => {
  const { data, isError, isLoading, isValidating } = useWishlist();

  if (isError)
    return (
      <ErrorMsg msg="Sorry, something wrong with the connection." isReloadBtn={true} />
    );
  if (isLoading) return <Loading />;
  // TODO: set UI for isValidating
  if (isValidating) return <p>Validating...</p>;
  if (!data || data.rooms.length === 0)
    return <ErrorMsg msg="Sorry, no ads found." isReloadBtn={false} />;

  const { rooms } = data;
  const thumbs = rooms.map((room) => <Thumb key={room.id} room={room} page="wishlist" />);

  return (
    <section className="container pb-16 pt-8">
      <h2 className="pb-4 pl-2 text-sm">Showing 1-2 of 2 results</h2>
      <ul className="flex list-none flex-col space-y-4">{thumbs}</ul>
    </section>
  );
};
