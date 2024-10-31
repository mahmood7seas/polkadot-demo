/** @format */

import { Keyring } from "@polkadot/api";
import { usePolkadot } from "../../context";
import { useAnnouncement } from "../../hooks";
import { useEffect, useState } from "react";
import { getAccountDetails, truncateAddress } from "../../common";
import { DataTable, DataTableLoading } from "../../components";

const TransferNFT = () => {
  const { api } = usePolkadot();
  const { error: errorAnnouncement, success } = useAnnouncement();
  const [aliceNft, setAliceNft] = useState();
  const [bobNft, setBobNft] = useState();
  const [loading, setLoading] = useState<any>(false);

  const getBlockNumber = async (blockHash: string) => {
    if (!api) return;
    const signedBlock = await api.rpc.chain.getBlock(blockHash);
    const blockNumber = signedBlock.block.header.number.toNumber();
    console.log(`Transfer included in block number: ${blockNumber}`);
    copyToClipboard(blockNumber);
  };

  const copyToClipboard = async (blockNumber: number) => {
    try {
      await navigator.clipboard.writeText(`${blockNumber}`);
      success("Block Number Copied successfully!");
    } catch (err) {
      errorAnnouncement("Failed to copy!");
    }
  };

  const transferNFT = async (
    theNftId: number,
    nftCollectionId: number,
    from: "Alice" | "Bob",
    to: "Alice" | "Bob"
  ): Promise<"success" | "failed"> => {
    if (!api) {
      console.error("API not initialized.");
      return "failed";
    }
    setLoading(true);
    try {
      const keyring = new Keyring({ type: "sr25519" });
      const fromAccount = keyring.addFromUri(`//${from}`);
      const toAccount = keyring.addFromUri(`//${to}`);
      const collectionId = nftCollectionId;
      const nftId = theNftId;

      if (!fromAccount || !toAccount) {
        console.error("Failed to create accounts from URI.");
        return "failed";
      }

      const toAddress = api.createType("MultiAddress", toAccount.address);

      return new Promise(async (resolve) => {
        try {
          await api.tx.uniques
            .transfer(collectionId, nftId, toAddress)
            .signAndSend(fromAccount, ({ status, dispatchError }) => {
              if (status.isInBlock) {
                const blockHash = status.asInBlock.toString();
                console.log(`NFT transfer included in block: ${blockHash}`);
                getBlockNumber(blockHash); // Retrieve the block number
                console.log("NFT transfer successful.");
                resolve("success");
              } else if (status.isFinalized) {
                console.log("Transaction finalized.");
              } else {
                console.log(`Current status: ${status.type}`);
              }
              getNfts();
              setLoading(false);

              // Handle dispatch errors
              if (dispatchError) {
                if (dispatchError.isModule) {
                  const decoded = api.registry.findMetaError(
                    dispatchError.asModule
                  );
                  const { docs, name, section } = decoded;
                  console.error(`Error: ${section}.${name}: ${docs.join(" ")}`);
                } else {
                  console.error(`Error: ${dispatchError.toString()}`);
                }
                resolve("failed");
              }
              setLoading(false);
            })
            .catch((error) => {
              console.error("Transaction failed:", error);
              resolve("failed");
              setLoading(false);
            });
        } catch (error) {
          console.error("An unexpected error occurred:", error);
          resolve("failed");
        }
      });
    } catch (error) {
      console.error("An error occurred:", error);
      setLoading(false);
      return "failed";
    }
  };

  const getNftsForAccount = async (accountId: string) => {
    if (!api) return;
    let nftAll: any = [];

    const accountNfts = await api.query.uniques.account.entries(accountId);

    await Promise.all(
      accountNfts.map(async ([key, _]) => {
        const info: any = key.args.map((k) => k.toHuman());
        const collectionId = info[1];
        const nftId = info[2];

        const nfts = await api.query.uniques.asset(collectionId, nftId);
        const metadata = await api.query.uniques.instanceMetadataOf(
          collectionId,
          nftId
        );
        const nameAttribute = await api.query.uniques.attribute(
          collectionId,
          nftId,
          "name"
        );

        const humanReadableNft = nfts.toHuman();
        const humanReadableMetadata = metadata.toHuman();
        const humanReadableName = nameAttribute.toHuman();

        const nftInfo = {
          collectionId: collectionId,
          nftId: nftId,
          nftInfo: humanReadableNft,
          metadata: humanReadableMetadata,
          attribute: humanReadableName
            ? humanReadableName
            : "No name attribute set",
        };

        nftAll.push(nftInfo);
      })
    );
    return nftAll;
  };

  const getNfts = async () => {
    setLoading(true);
    const aliceNft = await getNftsForAccount(await getAccountDetails("Alice"));

    setAliceNft(aliceNft);

    const bobNft = await getNftsForAccount(await getAccountDetails("Bob"));
    setBobNft(bobNft);
    setLoading(false);
  };
  useEffect(() => {
    getNfts();
  }, [api]);

  return (
    <div className="max-w-[700px] m-auto">
      <div className="bg-[#D9D9D90A] p-5 rounded-2xl overflow-x-auto">
        <div>
          <h3 className="font-semibold">Alice NFT'S</h3>
          <div className="p-1 rounded-2xl overflow-x-auto">
            {loading && <DataTableLoading />}
            {!loading && (
              <DataTable
                tableClassName="min-w-[500px]"
                headers={[
                  "nftId",
                  "collectionId",
                  "Name",
                  "owner",
                  "image",
                  "",
                ]}
                data={aliceNft}
                body={[
                  {
                    get: (item) => {
                      return <div className="pl-6">{item?.nftId}</div>;
                    },
                  },
                  {
                    get: (item) => {
                      return <div>{item?.collectionId}</div>;
                    },
                  },
                  {
                    get: (item) => {
                      return (
                        <span className="text-primary">
                          {item?.attribute[0]}
                        </span>
                      );
                    },
                  },
                  {
                    get: (item) => {
                      return (
                        <div className="space-x-3">
                          <span>{truncateAddress(item?.nftInfo?.owner)}</span>
                        </div>
                      );
                    },
                  },
                  {
                    get: (item) => {
                      return (
                        <div>
                          <img
                            className="w-7 h-7 object-cover"
                            src={item?.metadata?.data}
                            alt="nft-image"
                          />
                        </div>
                      );
                    },
                  },
                  {
                    get: (item) => {
                      return (
                        <button
                          onClick={() =>
                            transferNFT(
                              +item?.nftId,
                              +item?.collectionId,
                              "Alice",
                              "Bob"
                            )
                          }
                          className="text-primary font-semibold"
                        >
                          Transfer To Bob
                        </button>
                      );
                    },
                  },
                ]}
              />
            )}
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Bob NFT'S</h3>
          <div className="p-1 rounded-2xl overflow-x-auto">
            {loading && <DataTableLoading />}
            {!loading && (
              <DataTable
                tableClassName="min-w-[500px]"
                headers={[
                  "nftId",
                  "collectionId",
                  "Name",
                  "owner",
                  "image",
                  "",
                ]}
                data={bobNft}
                body={[
                  {
                    get: (item) => {
                      return <div className="pl-6">{item?.nftId}</div>;
                    },
                  },
                  {
                    get: (item) => {
                      return <div>{item?.collectionId}</div>;
                    },
                  },
                  {
                    get: (item) => {
                      return (
                        <span className="text-primary">
                          {item?.attribute[0]}
                        </span>
                      );
                    },
                  },
                  {
                    get: (item) => {
                      return (
                        <div className="space-x-3">
                          <span>{truncateAddress(item?.nftInfo?.owner)}</span>
                        </div>
                      );
                    },
                  },
                  {
                    get: (item) => {
                      return (
                        <div>
                          <img
                            className="w-7 h-7 object-cover"
                            src={item?.metadata?.data}
                            alt="nft-image"
                          />
                        </div>
                      );
                    },
                  },
                  {
                    get: (item) => {
                      return (
                        <button
                          onClick={() =>
                            transferNFT(
                              +item?.nftId,
                              +item?.collectionId,
                              "Bob",
                              "Alice"
                            )
                          }
                          className="text-primary font-semibold"
                        >
                          Transfer To Alice
                        </button>
                      );
                    },
                  },
                ]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { TransferNFT };
