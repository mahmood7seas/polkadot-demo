/** @format */

import { Keyring } from "@polkadot/api";
import { useEffect, useState } from "react";
import { truncateAddress } from "../../common";
import { DataTable, DataTableLoading } from "../../components";
import { usePolkadot } from "../../context";
import { CreateCollection } from "./CreateCollection";

const ListOfCollections = () => {
  const { api } = usePolkadot();
  const [collections, setCollection] = useState([]);
  const [loading, setLoading] = useState<any>(false);
  const [openModal, setOpenModal] = useState(false);

  const getCollections = async () => {
    if (!api) return;
    const collectionIds = await api.query.uniques.class.keys();
    const collections: any = await Promise.all(
      collectionIds.map(async ({ args: [collectionId] }) => {
        const collection: any = await api.query.uniques.class(collectionId);
        const collectionMetaData = await api.query.uniques.classMetadataOf(
          collectionId
        );

        return {
          id: collectionId.toString(),
          details: collection.toJSON(),
          metadata: collectionMetaData.toHuman(),
        };
      })
    );
    setCollection(collections);
  };
  const getAllCollections = async () => {
    await getCollections();
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getAllCollections();
  }, [api]);

  const freezeCollection = async (id: number) => {
    setLoading(true);
    if (!api) return;
    try {
      const keyring = new Keyring({ type: "sr25519" });
      const signer = keyring.addFromUri("//Alice");

      const tx = api.tx.uniques.freezeCollection(+id);
      const unsub = await tx.signAndSend(signer, ({ status }) => {
        if (status.isInBlock) {
          console.log(`Transaction included at blockHash ${status.asInBlock}`);
        } else if (status.isFinalized) {
          console.log(
            `Transaction finalized at blockHash ${status.asFinalized}`
          );
          getAllCollections();
          unsub();
        }
      });
    } catch (error) {
      console.error("Error freezing collection:", error);
    }
  };

  const destroyCollection = async (id: number) => {
    if (!api) return;
    setLoading(true);
    const keyring = new Keyring({ type: "sr25519" });
    const account = keyring.addFromUri("//Alice");
    try {
      const witness = getWitness(+id);
      const tx = api.tx.uniques.destroy(+id, witness);

      const unsub = await tx.signAndSend(
        account,
        ({ status, dispatchError }) => {
          if (status.isInBlock) {
            console.log(
              `Transaction included at blockHash ${status.asInBlock}`
            );
          } else if (status.isFinalized) {
            console.log(
              `Transaction finalized at blockHash ${status.asFinalized}`
            );
            getAllCollections();
            unsub();
          } else if (dispatchError) {
            if (dispatchError.isModule) {
              const decoded = api.registry.findMetaError(
                dispatchError.asModule
              );
              const { documentation, name, section }: any = decoded;
              console.error(`${section}.${name}: ${documentation.join(" ")}`);
            } else {
              console.error(dispatchError.toString());
            }
            unsub();
          }
        }
      );
    } catch (error) {
      console.error("Failed to destroy collection", error);
    }
  };

  const getWitness = async (id: number) => {
    if (!api) return;

    try {
      const items: any = await api.query.uniques.class(id);
      const itemCount = items.toHuman().itemMetadatas;

      const witness = {
        items: itemCount,
        itemMetadatas: itemCount,
        attributes: 0,
      };

      return witness;
    } catch (err: any) {
      console.log("Failed to get witness: " + err.message);
    }
  };

  return (
    <div className="max-w-[700px] m-auto">
      <div className="bg-[#D9D9D90A] p-5 rounded-2xl overflow-x-auto">
        {loading && <DataTableLoading />}
        {!loading && (
          <DataTable
            tableClassName="min-w-[500px]"
            headers={[
              "#",
              "Name",
              "owner",
              "isFrozen",
              "items",
              "items Metadata",
              "",
            ]}
            data={collections}
            body={[
              {
                get: (item) => {
                  return <div className="pl-6">{item.id}</div>;
                },
              },
              {
                get: (item) => {
                  return <div>{item.metadata?.data}</div>;
                },
              },
              {
                get: (item) => {
                  return (
                    <span className="text-primary">
                      {truncateAddress(item.details.owner)}
                    </span>
                  );
                },
              },
              {
                get: (item) => {
                  return (
                    <div className="space-x-3">
                      <span>{item.details.isFrozen.toString()}</span>
                      {!item.details.isFrozen &&
                        item.details.itemMetadatas == 0 && (
                          <button
                            onClick={() => freezeCollection(item.id)}
                            className="text-primary font-bold hover:text-primary/70"
                          >
                            Freeze
                          </button>
                        )}
                    </div>
                  );
                },
              },
              {
                get: (item) => {
                  return <div>{item.details.items}</div>;
                },
              },
              {
                get: (item) => {
                  return <div>{item.details.itemMetadatas}</div>;
                },
              },
              {
                get: (item) => {
                  return (
                    <div>
                      {item.details.items == 0 &&
                        item.details.itemMetadatas == 0 && (
                          <button
                            onClick={() => destroyCollection(item.id)}
                            className="text-primary font-bold hover:text-primary/70"
                          >
                            destroy
                          </button>
                        )}
                    </div>
                  );
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
            Create Collection
          </button>
        </div>
      </div>
      <CreateCollection
        CollectionLength={collections.length}
        getCollections={getCollections}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </div>
  );
};

export { ListOfCollections };
