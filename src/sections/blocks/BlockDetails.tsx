/** @format */

import React, { FC, useEffect, useState } from "react";
import { truncateAddress } from "../../common";
import { DataTable, DataTableLoading, Modal } from "../../components";
import { usePolkadot } from "../../context";
import { ITokens } from "../../types";
import { TransactionDetails } from "./TransactionDetails";

interface Props {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedBlock: React.Dispatch<React.SetStateAction<number | null>>;
  selectedBlock: number | null;
}

const BlockDetails: FC<Props> = ({
  openModal,
  selectedBlock,
  setOpenModal,
}) => {
  const { api, getTokens } = usePolkadot();
  const [blockDetails, setBlockDetails] = useState<any>();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading] = useState(false);
  const [tokens, setTokens] = useState<ITokens[]>([]);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const getPayment = async (extrinsic: any, blockHash: any) => {
    if (!api) return;
    const payment = await api.rpc.payment.queryFeeDetails(
      extrinsic.toHex(),
      blockHash
    );

    // const queryPayment = await api.rpc.payment.queryInfo(
    //   extrinsic.toHex(),
    //   blockHash
    // );

    console.log(payment.toHuman());
    // console.log(queryPayment.toHuman());
  };

  useEffect(() => {
    const getAllTokes = async () => {
      setTokens(await getTokens());
    };
    if (!api) return;
    getAllTokes();
  }, [api]);

  const fetchTransactionsFromBlock = async (blockNumber: number) => {
    if (!api) return;
    try {
      const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
      const signedBlock = await api.rpc.chain.getBlock(blockHash);

      let allTransactions: any[] = [];

      const { block } = signedBlock;

      block.extrinsics.forEach((extrinsic) => {
        const transactionData = extrinsic;
        getPayment(transactionData, blockHash);
        allTransactions.push(transactionData);
      });

      allTransactions = allTransactions.filter((item) => item.isSigned);

      setTransactions(allTransactions);
    } catch (error) {
      console.error(
        `Error fetching transactions for block ${blockNumber}:`,
        error
      );
    }
  };

  const fetchBlockDetails = async (blockNumber: number) => {
    if (!api) return;
    let block: any;

    try {
      const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
      const signedBlock = await api.rpc.chain.getBlock(blockHash);
      const blockHeader = await api.rpc.chain.getHeader(blockHash);
      const blockAuthor = await api.derive.chain.getHeader(blockHash);
      let blockTimestamp: string | null = null;

      const events: any[] = await api.query.system.events.at(blockHash);

      const blockEvents = events.map(({ event }) => {
        return event.toHuman();
      });

      signedBlock.block.extrinsics.forEach((extrinsic) => {
        const {
          method: { method, section },
        } = extrinsic;
        if (section === "timestamp" && method === "set") {
          blockTimestamp = extrinsic.args[0].toString();
        }
      });

      const blockTime = blockTimestamp
        ? getRelativeTime(Number(blockTimestamp))
        : "Unknown";

      block = {
        blockNumber: blockNumber,
        blockHash: blockHash.toString(),
        blockLeader: blockAuthor.author?.toString() || "Unknown",
        blockTime: blockTime,
        parentHash: blockHeader.parentHash.toString(),
        events: blockEvents,
      };

      setBlockDetails(block);
    } catch (error) {
      console.error(
        `Error fetching block details for block ${blockNumber}:`,
        error
      );
    }
  };

  const getRelativeTime = (blockTimestamp: number) => {
    const currentTime = Date.now();
    const timeDifference = currentTime - blockTimestamp; // in milliseconds

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (seconds > 0) {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  useEffect(() => {
    if (selectedBlock) {
      fetchTransactionsFromBlock(selectedBlock);
      fetchBlockDetails(selectedBlock);
    }
  }, [api, selectedBlock]);

  const close = () => {
    setOpenModal(false);
    // setSelectedBlock(null);
  };

  const getToken = (tokenId: string) => {
    const selectedToken = tokens.find((item) => item.assetId == tokenId);
    return selectedToken?.metadata.name;
  };

  const selectTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    setOpenTransactionModal(true);
  };

  return (
    <>
      <Modal
        setOpen={close}
        open={openModal}
        className="!w-[55rem] border !border-text-color !text-white !bg-black !p-0"
      >
        <div className="max-h-[600px] overflow-y-auto">
          <div className="border-b border-text-color flex justify-between items-center p-5">
            <div className="flex items-center gap-x-4">
              <p>Block Details</p>
            </div>
            <button onClick={() => close()}>X</button>
          </div>
          <div className="p-5">
            <p className="text-lg font-bold">Overview</p>
            <div className="space-y-2 py-3">
              <div className="font-semibold">
                <p className="w-[150px] inline-block">Block</p>
                <p className=" inline-block text-primary">{selectedBlock!}</p>
              </div>
              <div className="font-semibold">
                <p className="w-[150px] inline-block">blockHash</p>
                <p className=" inline-block text-primary">
                  {truncateAddress(blockDetails?.blockHash!)}
                </p>
              </div>
              <div className="font-semibold">
                <p className="w-[150px] inline-block">blockLeader</p>
                <p className=" inline-block text-primary">
                  {blockDetails?.blockLeader!}
                </p>
              </div>
              <div className="font-semibold">
                <p className="w-[150px] inline-block">blockTime</p>
                <p className=" inline-block text-primary">
                  {blockDetails?.blockTime}
                </p>
              </div>
              <div className="font-semibold">
                <p className="w-[150px] inline-block">parentHash</p>
                <p className=" inline-block text-primary">
                  {truncateAddress(blockDetails?.parentHash)}
                </p>
              </div>
            </div>
          </div>
          <div className="p-5 pt-0">
            <p className="text-lg font-bold">Transaction</p>
            <div className="bg-[#D9D9D90A] p-5 rounded-2xl overflow-x-auto">
              {loading && <DataTableLoading />}
              {!loading && (
                <DataTable
                  tableClassName="min-w-[500px]"
                  data={transactions}
                  headers={[
                    "Signature",
                    "Block",
                    "Time ",
                    "signer",
                    "target",
                    "amount",
                    "token",
                    "NftItem",
                    "Collection",
                  ]}
                  body={[
                    {
                      get: (item) => {
                        return (
                          <div className="pl-4 font-bold">
                            <button
                              onClick={() => selectTransaction(item.toHuman())}
                              className=" text-primary font-medium"
                            >
                              {truncateAddress(item?.signature?.toString())}
                            </button>
                          </div>
                        );
                      },
                    },
                    {
                      get: () => {
                        return (
                          <div className="font-semibold pl-4 text-table-text">
                            {selectedBlock}
                          </div>
                        );
                      },
                    },
                    {
                      get: () => {
                        return (
                          <div className="pl-4 flex items-center text-table-text gap-x-1 font-semibold">
                            <b>{blockDetails?.blockTime}</b>
                          </div>
                        );
                      },
                    },
                    {
                      get: (item) => {
                        return (
                          <div className="pl-4 font-semibold text-table-text">
                            {truncateAddress(item?.signer?.toString())}
                          </div>
                        );
                      },
                    },
                    {
                      get: (item) => {
                        return (
                          <div className="pl-4 font-semibold text-table-text">
                            {item?.toHuman()?.method?.args?.target?.Id
                              ? truncateAddress(
                                  item.toHuman()?.method?.args?.target?.Id
                                )
                              : item?.toHuman()?.method?.args?.dest?.Id
                              ? truncateAddress(
                                  item?.toHuman()?.method?.args?.dest?.Id
                                )
                              : "----"}
                          </div>
                        );
                      },
                    },
                    {
                      get: (item) => {
                        return (
                          <div className="pl-4 font-semibold text-table-text">
                            {item?.toHuman()?.method?.args?.amount
                              ? item.toHuman()?.method?.args?.amount
                              : "--"}
                          </div>
                        );
                      },
                    },
                    {
                      get: (item) => {
                        return (
                          <div className="pl-4 font-semibold text-table-text">
                            {item?.toHuman()?.method?.args?.id
                              ? getToken(item?.toHuman()?.method?.args?.id)
                              : "--"}
                          </div>
                        );
                      },
                    },
                    {
                      get: (item) => {
                        return (
                          <div className="pl-4 font-semibold text-table-text">
                            {item?.toHuman()?.method?.args?.item
                              ? item?.toHuman()?.method?.args?.item
                              : "--"}
                          </div>
                        );
                      },
                    },
                    {
                      get: (item) => {
                        return (
                          <div className="pl-4 font-semibold text-table-text">
                            {item?.toHuman()?.method?.args?.collection
                              ? item?.toHuman()?.method?.args?.collection
                              : "--"}
                          </div>
                        );
                      },
                    },
                  ]}
                />
              )}
            </div>
          </div>
          <div className="p-5 pt-0">
            <p className="text-lg font-bold">Events</p>
            <div className="bg-[#D9D9D90A] p-5 rounded-2xl overflow-x-auto">
              <DataTable
                tableClassName="min-w-[450px]"
                data={blockDetails?.events}
                headers={["method", "section", "index "]}
                body={[
                  {
                    get: (item) => {
                      return (
                        <div className="pl-4 font-bold">
                          <div className=" text-primary font-medium">
                            {item.method}
                          </div>
                        </div>
                      );
                    },
                  },
                  {
                    get: (item) => {
                      return (
                        <div className="font-semibold pl-4 text-table-text">
                          {item.section}
                        </div>
                      );
                    },
                  },
                  {
                    get: (item) => {
                      return (
                        <div className="pl-4 flex items-center text-table-text gap-x-1 font-semibold">
                          <b>{item.index}</b>
                        </div>
                      );
                    },
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div>
          <TransactionDetails
            openModal={openTransactionModal}
            setOpenModal={setOpenTransactionModal}
            selectedTransaction={selectedTransaction}
            setSelectedTransaction={setSelectedTransaction}
            tokens={tokens}
          />
        </div>
      </Modal>
    </>
  );
};

export { BlockDetails };
