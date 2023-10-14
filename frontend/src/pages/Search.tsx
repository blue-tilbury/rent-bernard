import { Error } from "./Error";
import { Loading } from "../components/Loading";
import { useRoom } from "../hooks/useAxios";
import { Gallery } from "../layouts/listing/Gallery";
import { ListItem } from "../types/room.type";

export const Search = () => {
  const { data, isLoading, isError } = useRoom({ method: "GET" });

  if (isError) return <Error msg="Sorry, something went wrong." />;
  if (isLoading) return <Loading />;

  const rooms: ListItem[] = data.rooms;
  if (rooms.length === 0) return <Error msg="Sorry, no rooms found." />;

  const galleries = rooms.map((room) => <Gallery key={room.id} {...room} />);

  return (
    <section className="container py-6">
      <h2 className="p-2 text-sm">Showing 1-2 of 2 results</h2>
      <ul className="flex flex-col flex-wrap sm:flex-row">{galleries}</ul>
    </section>
  );
};
