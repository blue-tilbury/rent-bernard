import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import ReactPaginate from "react-paginate";

type PaginationType = {
  handlePagination(page: number): void;
  pageCount: number;
  pageIndex: number;
};

export const Pagination = ({
  handlePagination,
  pageCount,
  pageIndex,
}: PaginationType) => {
  const handlePageClick = (e: { selected: number }) => {
    handlePagination(e.selected);
  };

  return (
    <div className="flex justify-center space-x-1 py-6">
      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        breakLabel={"..."}
        onPageChange={handlePageClick}
        previousLabel={<ChevronLeftIcon className="h-4 w-4" />}
        nextLabel={<ChevronRightIcon className="h-4 w-4" />}
        forcePage={pageIndex}
        renderOnZeroPageCount={null}
        className="text-md flex items-center justify-center space-x-2 py-6 font-medium"
        nextClassName="h-7 w-7 bg-white hover:bg-rent-pagination-light-blue text-rent-pagination-blue rounded-md shadow-md"
        nextLinkClassName="flex items-center justify-center h-full w-full"
        previousClassName="h-7 w-7 bg-white hover:bg-rent-pagination-light-blue text-rent-pagination-blue rounded-md shadow-md"
        previousLinkClassName="flex items-center justify-center h-full w-full"
        pageClassName="h-7 w-7 bg-white hover:bg-rent-pagination-light-blue text-rent-pagination-blue rounded-md shadow-md"
        pageLinkClassName="flex items-center justify-center h-full w-full"
        activeLinkClassName="bg-rent-pagination-blue text-white rounded-md shadow-md"
        disabledClassName="hidden"
      />
    </div>
  );
};
