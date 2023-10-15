import { ErrorMsg } from "../components/ErrorMsg";
import { Loading } from "../components/Loading";
import { Pagination } from "../components/Pagination";
import { useRoom } from "../hooks/useAxios";
import { Gallery } from "../layouts/listing/Gallery";
import { ListItem } from "../types/room.type";

export const Search = () => {
  const { data, isError, isLoading } = useRoom({ method: "GET" });

  if (isError)
    return (
      <ErrorMsg msg="Sorry, something wrong with the connection." isReloadBtn={true} />
    );
  if (isLoading) return <Loading />;

  const rooms: ListItem[] = data.rooms;
  if (rooms.length === 0)
    return <ErrorMsg msg="Sorry, no rooms found." isReloadBtn={false} />;

  const galleries = rooms.map((room) => <Gallery key={room.id} {...room} />);

  return (
    <section className="container py-6">
      <h2 className="p-2 text-sm">Showing 1-2 of 2 results</h2>
      <ul className="flex flex-col flex-wrap sm:flex-row">{galleries}</ul>
      <Pagination />
    </section>
  );
};
