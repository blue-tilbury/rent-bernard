import { ErrorMsg } from "../components/ErrorMsg";
import { Loading } from "../components/Loading";
import { Pagination } from "../components/Pagination";
import { SelectBox } from "../components/SelectBox";
import { useRoom } from "../hooks/useAxios";
import { Gallery } from "../layouts/listing/gallery/index";
import { errorMessage } from "../shared/errorMessage";
import { ListItem } from "../types/room.type";

export const Search = () => {
  const { data, isError, isLoading } = useRoom();

  if (isError) return <ErrorMsg msg={errorMessage.connection} isReloadBtn={true} />;
  if (isLoading) return <Loading />;
  if (!data || data.rooms.length === 0)
    return <ErrorMsg msg={errorMessage.noRoom} isReloadBtn={false} />;

  const rooms: ListItem[] = data.rooms;
  const galleries = rooms.map((room) => <Gallery key={room.id} {...room} />);

  return (
    <section className="container py-6">
      <div className="flex justify-between">
        <h2 className="p-2 text-sm">Showing 1-2 of 2 results</h2>
        <SelectBox />
      </div>
      <ul className="flex flex-col flex-wrap sm:flex-row">{galleries}</ul>
      <Pagination />
    </section>
  );
};
