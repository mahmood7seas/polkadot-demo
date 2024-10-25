/** @format */

import { ApiPromise, WsProvider } from "@polkadot/api";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

// const NAME = "EPOSUS";

interface IPolkadotActions {
  api: ApiPromise | undefined;
  // handleConnectWallet: any;
  accounts: InjectedAccountWithMeta[];
  selectedAccount: InjectedAccountWithMeta | undefined;
  getTokens: any;
}

export const PolkadotContext = createContext<IPolkadotActions | undefined>(
  undefined
);

interface IPolkadotProviderProps {
  children: ReactNode;
}

export const PolkadotProvider: FC<IPolkadotProviderProps> = ({ children }) => {
  const [api, setApi] = useState<ApiPromise | undefined>();
  const [accounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount] = useState<InjectedAccountWithMeta | undefined>();

  useEffect(() => {
    const setup = async () => {
      const provider = new WsProvider("wss://chain.dev.siriux.ai");
      const api = await ApiPromise.create({ provider });
      setApi(api);
    };
    setup();
  }, []);

  const getTokens = async () => {
    if (!api) return;
    const assetIds = await api.query.assets.asset.keys();

    const tokens = await Promise.all(
      assetIds.map(async (key) => {
        const assetId = key.args[0].toString();
        const assetInfo = await api.query.assets.asset(assetId);
        const assetMetadata = await api.query.assets.metadata(assetId);
        return {
          assetId,
          details: assetInfo.toHuman(),
          metadata: assetMetadata.toHuman(),
        };
      })
    );

    return tokens;
  };

  // const listenToNewBlocks = async () => {
  //   let count = 0;
  //   if (!api) return;

  //   const [chain, nodeName, nodeVersion] = await Promise.all([
  //     api.rpc.system.chain(),
  //     api.rpc.system.name(),
  //     api.rpc.system.version(),
  //   ]);

  //   console.log(
  //     `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
  //   );

  //   const unsubscribe = await api.rpc.chain.subscribeNewHeads(
  //     async (header) => {
  //       console.log(`\nNew block detected at height: #${header.number}`);

  //       const blockHash = header.hash.toHex();
  //       const parentHash = header.parentHash.toHex();
  //       const stateRoot = header.stateRoot.toHex();
  //       const extrinsicsRoot = header.extrinsicsRoot.toHex();

  //       console.log(`
  //     Block Hash: ${blockHash}
  //     Parent Hash: ${parentHash}
  //     State Root: ${stateRoot}
  //     Extrinsics Root: ${extrinsicsRoot}
  //   `);

  //       const signedBlock = await api.rpc.chain.getBlock(header.hash);
  //       console.log(
  //         `Extrinsics in block #${header.number}:`,
  //         signedBlock.block.extrinsics.map(
  //           (ext, i) =>
  //             `Extrinsic ${i}: ${ext.method.section}.${ext.method.method}`
  //         )
  //       );

  //       // Stop after 256 blocks
  //       if (++count === 256) {
  //         unsubscribe();
  //         process.exit(0);
  //       }
  //     }
  //   );
  // };

  // const createNft = async () => {
  //   if (!api) return;
  //   try {
  //     const keyring = new Keyring({ type: "sr25519" });
  //     const aliceAccount = keyring.addFromUri("//Alice");
  //     console.log("Creating NFT...");
  //     // Mint the NFT
  //     const collectionId = 4;
  //     const nftId = 6;
  //     await api.tx.uniques
  //       .mint(collectionId, nftId, aliceAccount.address)
  //       .signAndSend(aliceAccount, ({ status }) => {
  //         console.log("minting ...");
  //         if (status.isInBlock) {
  //           console.log("NFT minted successfully.");
  //         }
  //       });
  //     console.log("NFT Minting complete.");
  //   } catch (error) {
  //     console.log("Error minting NFT:", error);
  //   }
  // };

  // const setNftMetadata = async () => {
  //   if (!api) return;
  //   const collectionId = 6;
  //   const nftId = 12;
  //   const keyring = new Keyring({ type: "sr25519" });
  //   const aliceAccount = keyring.addFromUri("//Alice");
  //   await api.tx.uniques
  //     .setMetadata(
  //       collectionId,
  //       nftId,
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4uMwnANnimXgn2qGsKDvn9WEMJrussJSDaA&s",
  //       false
  //     )
  //     .signAndSend(aliceAccount, ({ status }) => {
  //       if (status.isInBlock) {
  //         console.log("Metadata added to NFT.");
  //       }
  //     });
  // };

  // const setNftAttribute = async () => {
  //   if (!api) return;
  //   const collectionId = 6;
  //   const nftId = 12;
  //   const keyring = new Keyring({ type: "sr25519" });
  //   const aliceAccount = keyring.addFromUri("//Alice");
  //   await api.tx.uniques
  //     .setAttribute(collectionId, nftId, "name", "mahmoods-nft")
  //     .signAndSend(aliceAccount, ({ status }) => {
  //       if (status.isInBlock) {
  //         console.log("Name attribute added to NFT.");
  //       }
  //     });
  // };

  // const getCollections = async () => {
  //   if (!api) return;
  //   const collectionIds = await api.query.uniques.class.keys();
  //   const collections = await Promise.all(
  //     collectionIds.map(async ({ args: [collectionId] }) => {
  //       const collection = await api.query.uniques.class(collectionId);
  //       return { id: collectionId.toString(), details: collection.toJSON() };
  //     })
  //   );

  //   console.log("NFT Collections:", collections);
  //   return collections;
  // };

  // const createCollection = async () => {
  //   try {
  //     const keyring = new Keyring({ type: "sr25519" });
  //     const signer = keyring.addFromUri("//Alice");

  //     if (!api) return;

  //     await api.tx.uniques
  //       .create(2, signer.address)
  //       .signAndSend(signer, async ({ status }) => {
  //         if (status.isInBlock) {
  //           console.log("Collection created successfully.");

  //           const name = "Collection-5";
  //           await api.tx.uniques
  //             .setCollectionMetadata(2, name, true)
  //             .signAndSend(signer, ({ status }) => {
  //               if (status.isInBlock) {
  //                 console.log("Collection metadata set successfully.");
  //               } else if (status.isFinalized) {
  //                 console.log("Metadata transaction finalized.");
  //               }
  //             });
  //         } else if (status.isFinalized) {
  //           console.log("Transaction finalized.");
  //         }
  //       });
  //   } catch (error) {
  //     console.error("Error creating collection or setting metadata:", error);
  //   }
  // };

  // const getAccount = async () => {
  //   const extensions = await web3Enable(NAME);
  //   if (!extensions || extensions.length === 0) {
  //     console.log("No extensions found");
  //     return;
  //   }

  //   const allAccounts = await web3Accounts();
  //   setAccounts(allAccounts);

  //   if (allAccounts.length === 0) {
  //     console.log("No accounts found");
  //     return;
  //   }
  //   const selectedAccounts = allAccounts[0];
  //   return selectedAccounts;
  // };

  // const test = async () => {
  //   const selectedAccount = await getAccount();
  //   console.log({ selectedAccount });
  //   const keyring = new Keyring({ type: "sr25519" });
  //   const adminAccount = keyring.addFromUri("//Alice");
  //   console.log(adminAccount);
  // };

  // const createToken = async () => {
  //   if (!api) return;
  //   console.log({ selectedAccount });

  //   const keyring = new Keyring({ type: "sr25519" });
  //   // const adminAccount = keyring.addFromUri(
  //   //   "//5FFWJxFZ967DdCnU5ufWGsTsm8abwvTZWAxDKSeUYZJzWhTF",
  //   //   { name: "mahmood" }
  //   // );
  //   const adminAccount = keyring.addFromUri("//Alice");

  //   console.log({ adminAccount });

  //   const assetId = 5;
  //   const initialSupply = 1000000000000;
  //   const decimals = 19;
  //   const tokenName = "test_token";
  //   const tokenSymbol = "https://dex-khaki.vercel.app/assets/E-logo.svg";
  //   // const account = selectedAccount.address;

  //   // Create the new token
  //   await api.tx.assets
  //     .create(assetId, adminAccount.address, initialSupply)
  //     .signAndSend(adminAccount, ({ status }) => {
  //       if (status.isInBlock) {
  //         console.log(
  //           `Token created successfully. Included in block: ${status.asInBlock}`
  //         );
  //       } else if (status.isFinalized) {
  //         console.log(`Transaction finalized: ${status.asFinalized}`);
  //       }
  //     });

  //   // Set the token metadata (name, symbol, and decimals)
  //   await api.tx.assets
  //     .setMetadata(assetId, tokenName, tokenSymbol, decimals)
  //     .signAndSend(adminAccount, ({ status }) => {
  //       if (status.isInBlock) {
  //         console.log(
  //           `Metadata set successfully. Included in block: ${status.asInBlock}`
  //         );
  //       } else if (status.isFinalized) {
  //         console.log(`Metadata transaction finalized: ${status.asFinalized}`);
  //       }
  //     });
  // };

  // const transferToken = async () => {
  //   if (!api) return;
  //   try {
  //     const keyring = new Keyring({ type: "sr25519" });
  //     const fromAccount = keyring.addFromUri("//Alice");
  //     const toAccount = keyring.addFromUri("//Pop");
  //     const assetId = 3;
  //     const amount = 1000;

  //     if (!fromAccount || !toAccount) {
  //       console.error("Failed to create accounts from URI.");
  //       return;
  //     }

  //     const toAddress = api.createType("MultiAddress", toAccount.address);

  //     console.log("Amount before conversion:", amount);

  //     let compactAmount;
  //     if (typeof amount === "number" || typeof amount === "string") {
  //       if (Number(amount) <= 0) {
  //         console.error("Amount should be greater than zero.");
  //         return;
  //       }
  //       compactAmount = api.createType("Compact<u128>", String(amount));
  //     } else {
  //       console.log("Invalid amount type:", typeof amount);
  //       return;
  //     }

  //     console.log("Compact Amount:", compactAmount.toString());

  //     await api.tx.assets
  //       .transfer(assetId, toAddress, compactAmount)
  //       .signAndSend(fromAccount, ({ status, txHash }) => {
  //         console.log("Transaction hash:", txHash.toHex());

  //         if (status.isInBlock) {
  //           console.log(
  //             `Transfer successful. Included in block: ${status.asInBlock}`
  //           );
  //         } else if (status.isFinalized) {
  //           console.log(`Transaction finalized: ${status.asFinalized}`);
  //         } else {
  //           console.log(`Current status: ${status.type}`);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Transaction failed:", error);
  //       });
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }
  // };

  // const getCollectionDetails = async () => {
  //   const collectionId: number = 1;
  //   if (!api) return;
  //   const collection = await api.query.uniques.class(collectionId);
  //   console.log(collection.toJSON());
  // };

  // const destroyCollection = async () => {
  //   if (!api) return;
  //   const keyring = new Keyring({ type: "sr25519" });
  //   const account = keyring.addFromUri("//Alice");
  //   console.log(Object.keys(api.tx.uniques));
  //   try {
  //     const collectionId = 3;

  //     const witness = getWitness();

  //     const tx = api.tx.uniques.destroy(collectionId, witness);

  //     const unsub = await tx.signAndSend(
  //       account,
  //       ({ status, dispatchError }) => {
  //         if (status.isInBlock) {
  //           console.log(
  //             `Transaction included at blockHash ${status.asInBlock}`
  //           );
  //         } else if (status.isFinalized) {
  //           console.log(
  //             `Transaction finalized at blockHash ${status.asFinalized}`
  //           );
  //           unsub();
  //         } else if (dispatchError) {
  //           if (dispatchError.isModule) {
  //             const decoded = api.registry.findMetaError(
  //               dispatchError.asModule
  //             );
  //             const { documentation, name, section }: any = decoded;
  //             console.error(`${section}.${name}: ${documentation.join(" ")}`);
  //           } else {
  //             console.error(dispatchError.toString());
  //           }
  //           unsub();
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Failed to destroy collection", error);
  //   }
  // };

  // const getWitness = async () => {
  //   if (!api) return;

  //   try {
  //     // Get the number of items in the collection
  //     console.log(Object.keys(api.query.uniques));

  //     const items: any = await api.query.uniques.class(3);
  //     const itemCount = items.toHuman().itemMetadatas;

  //     const witness = {
  //       items: itemCount,
  //       itemMetadatas: itemCount, // Assuming each item has metadata
  //       attributes: 0, // You may need to adjust this based on your use case
  //     };

  //     return witness;
  //   } catch (err: any) {
  //     console.log("Failed to get witness: " + err.message);
  //   }
  // };

  // const burnCollection = async () => {
  //   if (!api) return;

  //   try {
  //     const keyring = new Keyring({ type: "sr25519" });
  //     const signer = keyring.addFromUri("//Alice");

  //     const ownerMultiAddress = api.createType(
  //       "Option<MultiAddress>",
  //       signer.address
  //     );

  //     const tx = api.tx.uniques.burn(6, 10, ownerMultiAddress);
  //     const unsub = await tx.signAndSend(signer, ({ status }) => {
  //       if (status.isInBlock) {
  //         console.log(status.toHuman());
  //         console.log(`Transaction included at blockHash ${status.asInBlock}`);
  //       } else if (status.isFinalized) {
  //         console.log(
  //           `Transaction finalized at blockHash ${status.asFinalized}`
  //         );
  //         unsub(); // Unsubscribe only after finalization
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error burning asset:", error);
  //   }
  // };

  // const freezeCollection = async () => {
  //   if (!api) return;
  //   try {
  //     const keyring = new Keyring({ type: "sr25519" });
  //     const signer = keyring.addFromUri("//Alice");

  //     const tx = api.tx.uniques.freezeCollection(10);
  //     const unsub = await tx.signAndSend(signer, ({ status }) => {
  //       if (status.isInBlock) {
  //         console.log(status.toHuman());
  //         console.log(`Transaction included at blockHash ${status.asInBlock}`);
  //       } else if (status.isFinalized) {
  //         console.log(
  //           `Transaction finalized at blockHash ${status.asFinalized}`
  //         );
  //         unsub(); // Unsubscribe only after finalization
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error freezing collection:", error);
  //   }
  // };

  // const clearCollectionMetadata = async () => {
  //   if (!api) return;
  //   try {
  //     const keyring = new Keyring({ type: "sr25519" });
  //     const signer = keyring.addFromUri("//Alice");

  //     const tx = api.tx.uniques.clearCollectionMetadata(6);
  //     const unsub = await tx.signAndSend(signer, ({ status }) => {
  //       if (status.isInBlock) {
  //         console.log(status.toHuman());
  //         console.log(`Transaction included at blockHash ${status.asInBlock}`);
  //       } else if (status.isFinalized) {
  //         console.log(
  //           `Transaction finalized at blockHash ${status.asFinalized}`
  //         );
  //         unsub();
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error clearing collection metadata:", error);
  //   }
  // };

  // const clearMetadata = async () => {
  //   if (!api) return;
  //   try {
  //     const keyring = new Keyring({ type: "sr25519" });
  //     const signer = keyring.addFromUri("//Alice");

  //     const tx = api.tx.uniques.clearMetadata(6, 10);
  //     const unsub = await tx.signAndSend(signer, ({ status }) => {
  //       if (status.isInBlock) {
  //         console.log(status.toHuman());
  //         console.log(`Transaction included at blockHash ${status.asInBlock}`);
  //       } else if (status.isFinalized) {
  //         console.log(
  //           `Transaction finalized at blockHash ${status.asFinalized}`
  //         );
  //         unsub();
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error clearing collection metadata:", error);
  //   }
  // };

  // const getAllNft = async () => {
  //   if (!api) return;
  //   let nftAll: any = [];

  //   const accountNfts = await api.query.uniques.account.keys();
  //   await Promise.all(
  //     accountNfts.map(async (item) => {
  //       const info: any = item.toHuman();
  //       // const accountId = info[0];
  //       const collectionId = info[1];
  //       const nftId = info[2];

  //       const nfts = await api.query.uniques.asset(collectionId, nftId);
  //       const metadata = await api.query.uniques.instanceMetadataOf(
  //         collectionId,
  //         nftId
  //       );
  //       const nameAttribute = await api.query.uniques.attribute(
  //         collectionId,
  //         nftId,
  //         "name"
  //       );

  //       const humanReadableNft = nfts.toHuman();
  //       const humanReadableMetadata = metadata.toHuman();
  //       const humanReadableName = nameAttribute.toHuman();

  //       const nftInfo = {
  //         collectionId: collectionId,
  //         nftId: nftId,
  //         nftInfo: humanReadableNft,
  //         metadata: humanReadableMetadata,
  //         attribute: humanReadableName
  //           ? humanReadableName
  //           : "No name attribute set",
  //       };

  //       nftAll.push(nftInfo);
  //     })
  //   );

  //   console.log(nftAll);
  // };

  // const getPastTokenTransfers = async () => {
  //   if (!api || !(await api.isReady)) {
  //     console.error("API is not ready");
  //     return;
  //   }

  //   const currentBlock = await api.rpc.chain.getHeader();

  //   // Loop through the past 10 blocks
  //   for (let i = 0; i < 10; i++) {
  //     const blockHash = await api.rpc.chain.getBlockHash(
  //       currentBlock.number.toNumber() - i
  //     );
  //     const blockEvents: any = await api.query.system.events.at(blockHash);
  //     console.log(blockEvents.toHuman());

  //     blockEvents.forEach((record: any) => {
  //       const { event } = record;

  //       // Filter for transfer events
  //       if (event.section === "balances" && event.method === "Transfer") {
  //         const [from, to, amount] = event.data;
  //         console.log(
  //           `Transfer from ${from} to ${to} of amount ${amount.toString()}`
  //         );
  //       }

  //       if (event.section === "assets" && event.method === "Transferred") {
  //         const [assetId, from, to, amount] = event.data;
  //         console.log(
  //           `Asset ID ${assetId} transfer from ${from} to ${to} of amount ${amount.toString()}`
  //         );
  //       }
  //     });
  //   }
  // };

  // const monitorEvents = async () => {
  //   if (!api) return;

  //   api.query.system.events((events: any) => {
  //     console.log(`\nReceived ${events.length} new events:`);

  //     events.forEach((record: any, index: any) => {
  //       const { event, phase } = record;
  //       const types = event.typeDef;

  //       console.log(`\nEvent ${index + 1}:`);
  //       console.log(`Section: ${event.section}`);
  //       console.log(`Method: ${event.method}`);

  //       event.data.forEach((data: any, i: any) => {
  //         console.log(`${types[i].type}: ${data.toString()}`);
  //       });

  //       console.log(`Phase: ${phase.toString()}`);
  //     });
  //   });
  // };

  const PolkadotContextValue: IPolkadotActions = {
    api: api,
    // handleConnectWallet: getTokens,
    accounts: accounts,
    selectedAccount: selectedAccount,
    getTokens: getTokens,
  };

  return (
    <PolkadotContext.Provider value={PolkadotContextValue}>
      {children}
    </PolkadotContext.Provider>
  );
};

export const usePolkadot = (): IPolkadotActions => {
  const context = useContext(PolkadotContext);
  if (!context) {
    throw new Error("usePolkadot must be used within a PolkadotProvider");
  }
  return context;
};
