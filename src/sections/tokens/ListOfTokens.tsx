/** @format */

import { useEffect, useState } from "react";
import { truncateAddress } from "../../common";
import { DataTable, DataTableLoading } from "../../components";
import { usePolkadot } from "../../context";
import { ITokens } from "../../types";
import { CreateToken } from "./CreateToken";

const ListOfTokens = () => {
  const { getTokens, api } = usePolkadot();
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<ITokens[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const getAllTokes = async () => {
    setTokens(await getTokens());
    setLoading(false);
  };
  useEffect(() => {
    setLoading(true);
    if (!api) return;
    getAllTokes();
  }, [api]);

  // const burnToken = async (token: ITokens) => {
  //   setLoading(true);

  //   if (!api) {
  //     console.log("API is not initialized.");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const keyring = new Keyring({ type: "sr25519" });
  //     const adminAccount = keyring.addFromUri("//Alice");

  //     const assetId = +token.assetId;
  //     const burnAddress = adminAccount;
  //     const burnAmount = +token.details.deposit.replace(/,/g, "");
  //     console.log({ assetId });
  //     console.log({ burnAmount });

  //     if (burnAmount <= 0) {
  //       throw new Error("Burn amount should be greater than zero.");
  //     }

  //     const ownerMultiAddress = api.createType(
  //       "Option<MultiAddress>",
  //       burnAddress.address
  //     );
  //     const compactAmount = api.createType("Compact<u128>", String(burnAmount));

  //     const burnTx = api.tx.assets.burn(
  //       assetId,
  //       burnAddress.address,
  //       compactAmount
  //     );

  //     const unsub = await burnTx.signAndSend(
  //       adminAccount,
  //       ({ status, dispatchError }) => {
  //         if (status.isInBlock) {
  //           console.log(
  //             `Burned ${burnAmount} units of token ${assetId}. Included in block: ${status.asInBlock}`
  //           );
  //         } else if (status.isFinalized) {
  //           console.log(`Burning transaction finalized: ${status.asFinalized}`);
  //           unsub();
  //         } else {
  //           console.log(`Transaction status: ${status.type}`);
  //         }

  //         if (dispatchError) {
  //           console.log(`Error: ${dispatchError.toString()}`);
  //         }
  //       }
  //     );

  //     await getAllTokes();
  //   } catch (error) {
  //     console.error("Error burning token:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const destroyToken = async (token: ITokens) => {
  //   if (!api) {
  //     console.log("API is not initialized.");
  //     return;
  //   }

  //   try {
  //     const keyring = new Keyring({ type: "sr25519" });
  //     const adminAccount = keyring.addFromUri("//Alice");

  //     // Destroy the token asset
  //     const destroyTx = api.tx.assets.destroyAccounts(token.assetId);

  //     const unsub = await destroyTx.signAndSend(
  //       adminAccount,
  //       ({ status, dispatchError }) => {
  //         if (status.isInBlock) {
  //           console.log(
  //             `Token ${token.assetId} is scheduled for deletion. Included in block: ${status.asInBlock}`
  //           );
  //         } else if (status.isFinalized) {
  //           console.log(
  //             `Token ${token.assetId} deletion finalized: ${status.asFinalized}`
  //           );
  //           unsub();
  //         } else {
  //           console.log(`Transaction status: ${status.type}`);
  //         }

  //         if (dispatchError) {
  //           console.error(`Error deleting token: ${dispatchError.toString()}`);
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error deleting token:", error);
  //   }
  // };

  return (
    <>
      <div className="max-w-[700px] m-auto">
        <div className="bg-[#D9D9D90A] p-5 rounded-2xl overflow-x-auto">
          {loading && <DataTableLoading />}
          {!loading && (
            <DataTable
              tableClassName="min-w-[500px]"
              headers={[
                "#",
                "symbol",
                "Name",
                "deposit",
                "status",
                "owner",
                "",
              ]}
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
                        {item.details.deposit}
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
                // {
                //   get: (item) => {
                //     return (
                //       <button
                //         // onClick={() => destroyToken(item)}
                //         className="text-primary font-semibold"
                //       >
                //         burn token
                //       </button>
                //     );
                //   },
                // },
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
