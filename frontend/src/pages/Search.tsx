import { useState } from "react";

import { ErrorMsg } from "../components/ErrorMsg";
import { Pagination } from "../components/Pagination";
import { SelectBox } from "../components/SelectBox";
import { Spinner } from "../components/Spinner";
import { useRoom } from "../hooks/useAxios";
import { Gallery } from "../layouts/listing/gallery/index";
import { errorMessage } from "../shared/errorMessage";
import { Order, QueryParams, SortBy } from "../types/room.type";

export type SortType = "new" | "old" | "low" | "high";

export const Search = () => {
  const ItemsPerPage = 3;
  const [queryParams, setQueryParams] = useState<QueryParams>({
    sortBy: SortBy.UPDATED_AT,
    order: Order.DESC,
    page: 0,
    per_page: ItemsPerPage,
  });
  const [sortType, setSortType] = useState<SortType>("new");
  const [pageIndex, setPageIndex] = useState(0);
  const { data, isError, isLoading, isValidating } = useRoom(queryParams);

  if (isError) return <ErrorMsg msg={errorMessage.connection} isReloadBtn={true} />;
  if (isLoading || isValidating) return <Spinner />;
  if (!data || data.count === 0)
    return <ErrorMsg msg={errorMessage.noRoom} isReloadBtn={false} />;

  const rooms = data.rooms;
  const galleries = rooms.map((room) => <Gallery key={room.id} {...room} />);

  const handleSelectBox = (sortBy: SortBy, order: Order, sortType: SortType) => {
    setSortType(sortType);
    setQueryParams((prev) => ({ ...prev, sortBy, order }));
  };

  const handlePagination = (page: number) => {
    setPageIndex(page);
    setQueryParams((prev) => ({ ...prev, page }));
  };

  return (
    <section className="container flex min-h-screen flex-col justify-between py-6">
      <div>
        <div className="flex justify-between">
          <h2 className="p-2 text-sm">
            Showing {pageIndex * ItemsPerPage + 1}-{(pageIndex + 1) * ItemsPerPage} of{" "}
            {data.count} results
          </h2>
          <SelectBox handleSelect={handleSelectBox} sortType={sortType} />
        </div>
        <ul className="flex flex-col flex-wrap sm:flex-row">{galleries}</ul>
      </div>
      <Pagination
        handlePagination={handlePagination}
        pageCount={Math.ceil(data.count / ItemsPerPage)}
        pageIndex={pageIndex}
      />
    </section>
  );
};
