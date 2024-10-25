/** @format */
import { isArray } from "lodash";
import { useEffect, useState } from "react";
// import { useFetch } from "../../../../../../hooks";
// import { Loader } from "../../../../../Loader";
import DataTableImage from "./components/DataTableImage";
import DataTablePagination from "./components/DataTablePagination";
import "./DataTable.css";

const isImage = (text: string) => {
  if (!text) return false;

  text = text.toString().toLowerCase();
  return (
    text.endsWith(".webp") ||
    text.endsWith(".jpg") ||
    text.endsWith(".jpeg") ||
    text.endsWith(".png")
  );
};

type Props = {
  headers: Array<string | HeaderProps>;
  body: Array<BodyProps | string>;
  initPage?: number;
  query?: any;
  url?: string;
  data?: Array<any>;
  dataField?: string;
  title?: string;
  condition?: {
    enabled: boolean;
    message: string;
  };
  id?: string;
  getRefetcher?: any;
  onDataChanged?: (data: any) => void;
  tableClassName?: string;
};

export type HeaderProps = {
  text: string;
  sortable?: boolean;
  fit?: boolean;
};

export type BodyProps = {
  field?: string;
  component?: Function;
  props?: object;
  get?: (item: any) => void;
};

export function DataTable({
  headers,
  body,
  // url = "",
  initPage = 1,
  data: preData,
  dataField = "result",
  condition,
  onDataChanged,
  title,
  id = "",
  tableClassName,
}: Props) {
  const [currentPage, setCurrentPage] = useState(initPage);
  const [response, setResponse] = useState<any>(preData);
  //   const { query: urlQuery } = useRouter();

  // const isEnabled = (): boolean => {
  //   return (!condition && !!url) || (!!condition && condition.enabled);
  // };

  //   const {
  //     isLoading,
  //     isFetching,
  //     isError,
  //     data: fetchResponse,
  //     refetch,
  //   } = useFetch<any>(
  //     url,
  //     {
  //       page: currentPage,
  //       ...(query ?? {}),
  //     },
  //     {
  //       enabled: isEnabled(),
  //     }
  //   );

  //   const forceRefetecher = () => {
  //     refetch();
  //   };

  useEffect(() => {
    if (preData) {
      setResponse(preData);
    }
  }, [preData]);

  useEffect(() => {
    response && onDataChanged && onDataChanged(response);
    if (response?.current_page) {
      setCurrentPage(response?.current_page);
    }
  }, [response]);

  //   useEffect(() => {
  //     getRefetcher && getRefetcher(forceRefetecher);
  //   }, [refetch]);

  //   useEffect(() => {
  //     const page = urlQuery[`${id}_page`]?.toString() ?? null;
  //     if (page) {
  //       setCurrentPage(parseInt(page));
  //     }
  //   }, [urlQuery]);

  const getData = (): Array<any> => {
    let data = new Array<any>();

    if (response) {
      if (isArray(response)) {
        return response;
      }

      const records = response as Record<string, any>;
      if (records[dataField]) {
        return records[dataField];
      }

      if (dataField.includes(".")) {
        const keys = dataField.split(".");
        let lastNest: any = null;
        keys.forEach((key) => {
          lastNest = lastNest ? lastNest[key] : records[key];
        });
        return lastNest;
      }
    }

    return data;
  };

  const getBody = () => {
    const getColumn = (b: BodyProps | string, row: object) => {
      const dataItem = row as Record<string, any>;

      if (typeof b == "object") {
        let Component: any = b.component;
        if (Component && typeof Component == "function") {
          const props = b.props ?? {};
          return <Component item={row} {...props} />;
        }
        if (b.field) {
          return dataItem[b.field as string] ?? "";
        }
        if (b.get) {
          return b.get(row);
        }
      } else if (typeof b == "string") {
        if (dataItem[b]) {
          if (isImage(dataItem[b])) {
            return <DataTableImage src={dataItem[b]} />;
          }
          return dataItem[b];
        }

        if (b.includes(".")) {
          const keys = b.split(".");
          let lastNest: any = null;
          keys.forEach((key) => {
            lastNest = lastNest ? lastNest[key] : dataItem[key];
          });
          return lastNest;
        }
      }

      return "";
    };

    return getData()?.map((item, index) => {
      return (
        <tr key={index} className="">
          {body.map((b, i) => {
            return (
              <td key={i} className="test-2">
                <div
                  className={`row-wrapper text-xs text-white bg-[#070707] border-[#191919]  whitespace-nowrap  border-t border-b  ${
                    i == 0 && "border-l rounded-l-[25px]"
                  } ${i === body.length - 1 && "border-r rounded-r-[25px]"}`}
                >
                  <div className="c-t">{getColumn(b, item)}</div>
                </div>
              </td>
            );
          })}
        </tr>
      );
    });
  };

  return !condition || (condition && condition.enabled) ? (
    <>
      {title && <h3 className="font-bold text-[#444] p-2 pt-0">{title}</h3>}

      {/* {!isError && (isLoading || isFetching) && !preData && <Loader />} */}

      {/* {!isError &&
        response &&
        !isLoading &&
        !isFetching &&
        getData() &&
        getData()?.length == 0 && (
          <NoResultsBox isLoading={isLoading || isFetching} refetch={refetch} />
        )} */}

      {/* {isError && (
        <ErrorBox isLoading={isLoading || isFetching} refetch={refetch} />
      )} */}

      {(!preData || preData) &&
        response &&
        getData() &&
        getData().length > 0 && (
          <div className="text-white">
            {/* {isFetching && (
            <div className="table-loading">
              <div className="loading-line"></div>
            </div>
            )} */}

            <table className={`text-sm ${tableClassName}`}>
              <thead>
                {
                  <tr>
                    {headers.map((h, index) => {
                      if (typeof h == "string") {
                        return (
                          <th key={index} className="text-white text-[10px]">
                            {h.toString()}
                          </th>
                        );
                      }

                      if (typeof h == "object") {
                        return (
                          <th className="text-white text-[10px]" key={index}>
                            {h.text}
                          </th>
                        );
                      }
                    })}
                  </tr>
                }
              </thead>
              <tbody>{getBody()}</tbody>
            </table>
          </div>
        )}

      {response?.has_pagination && (
        <DataTablePagination
          total={response?.last_page ?? 1}
          currentPage={currentPage}
          tableId={id}
        />
      )}
    </>
  ) : (
    <>{condition?.message}</>
  );
}
