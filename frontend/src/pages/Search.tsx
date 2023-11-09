import { useState } from "react";

import { ErrorMsg } from "../components/ErrorMsg";
import { Pagination } from "../components/Pagination";
import { SelectBox } from "../components/SelectBox";
import { Spinner } from "../components/Spinner";
import { useRoom } from "../hooks/useAxios";
import { Filter } from "../layouts/filter";
import { Gallery } from "../layouts/listing/gallery/index";
import { errorMessage } from "../shared/errorMessage";
import { FilterType } from "../types/filter.type";
import { Order, QueryParams, SortBy } from "../types/room.type";

export type SortType = "new" | "old" | "low" | "high";

export const Search = () => {
  const ItemsPerPage = 3;
  const [queryParams, setQueryParams] = useState<QueryParams>({
    sort_by: SortBy.UPDATED_AT,
    order: Order.DESC,
    page: 0,
    per_page: ItemsPerPage,
  });
  const [sortType, setSortType] = useState<SortType>("new");
  const [filter, setFilter] = useState<FilterType>({});
  const [pageIndex, setPageIndex] = useState(0);
  const { data, isError, isLoading, isValidating } = useRoom({
    ...queryParams,
    ...filter,
  });

  if (isError) return <ErrorMsg msg={errorMessage.connection} isReloadBtn={true} />;
  if (isLoading || isValidating) return <Spinner />;

  const rooms = data?.rooms;
  const galleries = rooms?.map((room) => <Gallery key={room.id} {...room} />);

  const handleSelectBox = (sort_by: SortBy, order: Order, sortType: SortType) => {
    setSortType(sortType);
    setQueryParams((prev) => ({ ...prev, sort_by, order }));
  };

  const handleFilter = (newValues: FilterType) => {
    setFilter(newValues);
  };

  const handlePagination = (page: number) => {
    setPageIndex(page);
    setQueryParams((prev) => ({ ...prev, page }));
  };

  return (
    <section className="mx-auto min-h-screen px-8 py-6 xl:w-[1280px] 2xl:w-[1536px]">
      <div className="flex min-h-[inherit]">
        <Filter handleFilter={handleFilter} filter={filter} />
        {!data || data?.count === 0 ? (
          <ErrorMsg msg={errorMessage.noRoom} isReloadBtn={false} />
        ) : (
          <div className="flex flex-1 flex-col items-stretch justify-between">
            <div className="flex flex-col">
              <div className="flex h-14 justify-between">
                <h2 className="p-2 text-sm">
                  Showing {pageIndex * ItemsPerPage + 1}-
                  {Math.min((pageIndex + 1) * ItemsPerPage, data.count)} of {data.count}{" "}
                  results
                </h2>
                <SelectBox handleSelect={handleSelectBox} sortType={sortType} />
              </div>
              <ul className="flex h-full flex-col flex-wrap sm:flex-row">{galleries}</ul>
            </div>
            <Pagination
              handlePagination={handlePagination}
              pageCount={Math.ceil(data.count / ItemsPerPage)}
              pageIndex={pageIndex}
            />
          </div>
        )}
      </div>
    </section>
  );
};
