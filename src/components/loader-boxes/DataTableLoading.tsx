/** @format */
"use client";
import { FC } from "react";
import "./DataTableLoading.css";

type DataTableLoadingProps = {
  rows?: number;
};

const DataTableLoading: FC<DataTableLoadingProps> = ({ rows = 5 }) => {
  return (
    <>
      {[...Array(rows)].map((_, i) => {
        return (
          <div
            style={{
              background:
                "linear-gradient(to right, #121111 4%, #1E1E1E 25%, #000000 36%)",
            }}
            key={i}
            className="line loading-shimmer"
          ></div>
        );
      })}
    </>
  );
};

export { DataTableLoading };
