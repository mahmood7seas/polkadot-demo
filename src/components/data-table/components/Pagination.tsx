/** @format */

import React, { FC, useEffect } from "react";

interface Props {
  total: number;
  currentPage: number;
  setPage: (e: number) => void;
}

const Pagination: FC<Props> = ({ total, currentPage, setPage }) => {
  const [pagesPagination, setPagePagination] = React.useState<number[]>();

  const setPrev = () => {
    setPage(currentPage - 1);
  };

  const setNext = () => {
    setPage(currentPage + 1);
  };

  useEffect(() => {
    let pages: number[] = [];
    for (let i = 1; i <= total; i++) {
      const index = pages.findIndex((page) => page == i);
      if (index == -1) {
        pages.push(i);
      }
    }
    setPagePagination(pages);
  }, [total, currentPage]);

  return (
    <div className="flex justify-center mt-5">
      <button
        disabled={currentPage == 1 ? true : false}
        onClick={() => setPrev()}
        className="bg-primary rounded-l-full w-[40px] text-white cursor-pointer"
      >
        <i className="fi fi-rr-angle-left"></i>
      </button>
      <div>
        <select
          onChange={(e) => setPage(+e.target.value)}
          value={currentPage}
          className={
            "bg-white border border-[#0037A0]  py-2 px-1 text-gray1 outline-none text-sm"
          }
        >
          {pagesPagination &&
            pagesPagination?.length > 0 &&
            pagesPagination.map((page, i) => {
              return (
                <option key={i} value={page}>
                  Page {page}
                </option>
              );
            })}
        </select>
      </div>
      <button
        disabled={currentPage === total ? true : false}
        onClick={() => setNext()}
        className="bg-primary rounded-r-full w-[40px] text-white cursor-pointer"
      >
        <i className="fi fi-rr-angle-right"></i>
      </button>
    </div>
  );
};

export default Pagination;
