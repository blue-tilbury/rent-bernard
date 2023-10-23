import { useState } from "react";

import { ErrorMsg } from "../components/ErrorMsg";
import { Loading } from "../components/Loading";
import { Pagination } from "../components/Pagination";
import { SelectBox } from "../components/SelectBox";
import { useRoom } from "../hooks/useAxios";
import { Gallery } from "../layouts/listing/gallery/index";
import { errorMessage } from "../shared/errorMessage";
import { Order, QueryParams, SortBy } from "../types/room.type";

export type SortType = "new" | "old" | "low" | "high";

export const Search = () => {
  const [queryParams, setQueryParams] = useState<QueryParams>({
    sortBy: SortBy.UPDATED_AT,
    order: Order.DESC,
  });
  const [sortType, setSortType] = useState<SortType>("new");
  const { data, isError, isLoading } = useRoom(queryParams);

  if (isError) return <ErrorMsg msg={errorMessage.connection} isReloadBtn={true} />;
  if (isLoading) return <Loading />;
  if (!data || data.rooms.length === 0)
    return <ErrorMsg msg={errorMessage.noRoom} isReloadBtn={false} />;

  const rooms = data.rooms;
  const galleries = rooms.map((room) => <Gallery key={room.id} {...room} />);

  const handleSelectBox = (sortBy: SortBy, order: Order, sortType: SortType) => {
    setSortType(sortType);
    setQueryParams({ sortBy, order });
  };

  return (
    <section className="container py-6">
      <div className="flex justify-between">
        <h2 className="p-2 text-sm">Showing 1-2 of 2 results</h2>
        <SelectBox handleSelect={handleSelectBox} sortType={sortType} />
      </div>
      <ul className="flex flex-col flex-wrap sm:flex-row">{galleries}</ul>
      <Pagination />
    </section>
  );
};
