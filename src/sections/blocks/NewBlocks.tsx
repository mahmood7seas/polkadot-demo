/** @format */

import moment from "moment";
import { useEffect, useState } from "react";
import { DataTable, DataTableLoading } from "../../components";
import { usePolkadot } from "../../context";
import { truncateAddress } from "../../common";
import { BlockDetails } from "./BlockDetails";

interface Iblocks {
  blockHash: string;
  blockNumber: number;
  timestamp: string;
  totalFee: string;
  totalValue: string;
}

const NewBlocks = () => {
  const { api } = usePolkadot();
  const [blocks, setBlocks] = useState<Iblocks[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getLatestBlock = async () => {
      if (!api) return;
      try {
        let latestBlockHash = await api.rpc.chain.getFinalizedHead();
        const blocks = [];

        for (let i = 0; i < 10; i++) {
          const block = await api.rpc.chain.getBlock(latestBlockHash);
          const blockNumber = block.block.header.number.toNumber();
          const blockHash = latestBlockHash.toString();

          const timestampNow: any = await api.query.timestamp.now.at(
            latestBlockHash
          );
          const timestamp = new Date(timestampNow.toNumber()).toISOString();

          const extrinsics: any = block.block.extrinsics;
          let totalValue = 0;
          let totalFee = 0;

          for (const [index, extrinsic] of extrinsics.entries()) {
            if (
              extrinsic.method.section === "balances" &&
              extrinsic.method.method === "transfer"
            ) {
              const { args } = extrinsic.method;
              const value = args[1].toString();
              totalValue += Number(value);
            }

            const blockEvents: any = await api.query.system.events.at(
              latestBlockHash
            );
            blockEvents.forEach(({ phase, event }: any) => {
              if (phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index)) {
                if (
                  event.section === "transactionPayment" &&
                  event.method === "TransactionFeePaid"
                ) {
                  const feePaid = event.data[1].toString();
                  totalFee += Number(feePaid);
                }
              }
            });
          }

          blocks.push({
            blockNumber,
            blockHash,
            timestamp,
            totalValue: totalValue.toString(),
            totalFee: totalFee.toString(),
          });

          latestBlockHash = block.block.header.parentHash;
        }
        setBlocks(blocks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the latest blocks:", error);
      }
    };
    getLatestBlock();
  }, [api]);

  const selectBlock = (block: number) => {
    setSelectedBlock(block);
    setOpenModal(true);
  };

  return (
    <div className="max-w-[700px] m-auto">
      <div className="bg-[#D9D9D90A] p-5 rounded-2xl overflow-x-auto">
        {loading && <DataTableLoading />}
        {!loading && (
          <DataTable
            tableClassName="min-w-[600px]"
            data={blocks}
            headers={["#Block", "Time", "blockHash ", "Value"]}
            body={[
              {
                get: (item) => {
                  return (
                    <div className="pl-4 font-bold">
                      <button
                        onClick={() => selectBlock(item.blockNumber)}
                        className=" text-primary font-medium"
                      >
                        {item.blockNumber}
                      </button>
                    </div>
                  );
                },
              },
              {
                get: (item) => {
                  const pastTime = moment(item.timestamp);
                  const currentTime = moment();
                  const duration = moment.duration(currentTime.diff(pastTime));

                  const sec = Math.floor(duration.asSeconds());
                  return (
                    <div className="font-semibold pl-4 text-table-text">
                      {sec} sec ago
                    </div>
                  );
                },
              },
              {
                get: (item) => {
                  return (
                    <div className="pl-4 flex items-center text-table-text gap-x-1 font-semibold">
                      <b>{truncateAddress(item.blockHash)}</b>
                    </div>
                  );
                },
              },
              {
                get: (item) => {
                  return (
                    <div className="pl-4 font-semibold text-table-text">
                      {item.totalValue}
                    </div>
                  );
                },
              },
            ]}
          />
        )}
      </div>
      <BlockDetails
        openModal={openModal}
        selectedBlock={selectedBlock}
        setOpenModal={setOpenModal}
        setSelectedBlock={setSelectedBlock}
      />
    </div>
  );
};

export { NewBlocks };
