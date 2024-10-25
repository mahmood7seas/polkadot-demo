/** @format */

import { FC } from "react";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";

type DataTablePaginationProps = {
  total: number;
  currentPage: number;
  tableId: string;
};

const DataTablePagination: FC<DataTablePaginationProps> = ({
  total,
  currentPage,
}) => {
  // const location = useLocation();

  // const handleChange = (newPage: number) => {
  //   const searchParams = new URLSearchParams(location.search);
  //   searchParams.set(`${tableId}_page`, newPage.toString());
  // };

  return (
    <div className="mt-4">
      <ResponsivePagination
        current={currentPage}
        total={total}
        onPageChange={() => {}}
      />
    </div>
  );
};

export default DataTablePagination;
