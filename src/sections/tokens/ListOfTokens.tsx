/** @format */

import { useEffect, useState } from "react";
import { usePolkadot } from "../../context";
import { ITokens } from "../../types";
import { DataTable, DataTableLoading } from "../../components";
import { CreateToken } from "./CreateToken";
import { truncateAddress } from "../../common";

const ListOfTokens = () => {
  const { getTokens, api } = usePolkadot();
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<ITokens[]>([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getAllTokes = async () => {
      setTokens(await getTokens());
      setLoading(false);
    };
    if (!api) return;
    getAllTokes();
  }, [api]);

  return (
    <>
      <div className="max-w-[700px] m-auto">
        <div className="bg-[#D9D9D90A] p-5 rounded-2xl overflow-x-auto">
          {loading && <DataTableLoading />}
          {!loading && (
            <DataTable
              tableClassName="min-w-[500px]"
              headers={["#", "symbol", "Name", "deposit", "status", "owner"]}
              data={tokens}
              body={[
                {
                  get: (item) => {
                    return (
                      <div className="pl-6">
                        {truncateAddress(item.assetId)}
                      </div>
                    );
                  },
                },
                {
                  get: (item) => {
                    return (
                      <div className="flex items-center gap-x-2 w-fit">
                        <div className="w-7 h-7 uppercase rounded-full bg-black flex items-center justify-center">
                          {item.metadata.symbol[0]}
                        </div>
                      </div>
                    );
                  },
                },
                {
                  get: (item) => {
                    return <span>{item.metadata.name}</span>;
                  },
                },
                {
                  get: (item) => {
                    return (
                      <div className="text-[#4287C0]">
                        {item.metadata.deposit}
                      </div>
                    );
                  },
                },
                {
                  get: (item) => {
                    return <div>{item.details.status}</div>;
                  },
                },
                {
                  get: (item) => {
                    return <div>{truncateAddress(item.details.owner)}</div>;
                  },
                },
              ]}
            />
          )}
          <div className="w-fit m-auto">
            <button
              onClick={() => setOpenModal(true)}
              className="bg-primary px-5 py-2 rounded"
            >
              Create Token
            </button>
          </div>
        </div>
      </div>
      <CreateToken
        setTokens={setTokens}
        openModal={openModal}
        setOpenModal={setOpenModal}
        tokensLength={tokens.length}
      />
    </>
  );
};

export { ListOfTokens };
