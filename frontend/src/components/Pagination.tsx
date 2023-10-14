import { ArrowLongLeftIcon, ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import { Button } from "./Button";
// import useSWR from "swr";

export const Pagination = () => {
  const [pageIndex, setPageIndex] = useState(0);
  // const { data } = useSWR(`/api/data?page=${index}`, fetcher);

  return (
    <div className="flex justify-center py-6">
      {/* {data.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))} */}
      <Button
        size="xs"
        color="secondary"
        type="button"
        handleClick={() => setPageIndex(pageIndex - 1)}
      >
        <ArrowLongLeftIcon className="h-4 w-4" />
      </Button>
      1
      <Button
        size="xs"
        color="secondary"
        type="button"
        handleClick={() => setPageIndex(pageIndex + 1)}
      >
        <ArrowLongRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
