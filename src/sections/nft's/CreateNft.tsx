/** @format */

import { Keyring } from "@polkadot/api";
import { FC, FormEvent, useEffect, useState } from "react";
import { FileUploadField, InputField, Modal } from "../../components";
import { Loader } from "../../components/loader-boxes/Loader";
import { usePolkadot } from "../../context";
import { useAnnouncement } from "../../hooks";
import axios from "axios";

interface Props {
  openModal: boolean;
  setOpenModal: any;
  nftsLength: number;
  getNfts: any;
}

const CreateNft: FC<Props> = ({
  getNfts,
  nftsLength,
  openModal,
  setOpenModal,
}) => {
  const { api } = usePolkadot();
  const [formData, setFormData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [collections, setCollection] = useState<any>([]);
  const { success, error: errorAnnouncement } = useAnnouncement();
  const [nftImageUrl, setNftImageUrl] = useState<string | null>(null);
  const [nftImageFile, setNftImageFile] = useState<File | null>(null);
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const copyToClipboard = async (blockNumber: number) => {
    try {
      await navigator.clipboard.writeText(`${blockNumber}`);
      success("Block Number Copied successfully!");
    } catch (err) {
      errorAnnouncement("Failed to copy!");
    }
  };

  const getBlockNumber = async (blockHash: string) => {
    if (!api) return;
    const signedBlock = await api.rpc.chain.getBlock(blockHash);
    const blockNumber = signedBlock.block.header.number.toNumber();
    console.log(`NFT minted successfully in block number: ${blockNumber}`);
    copyToClipboard(blockNumber);
  };

  const createNft = async (
    collectionId: number,
    nftId: number
  ): Promise<"success" | "failed"> => {
    try {
      if (!api) {
        console.error("API not initialized.");
        return "failed";
      }

      const keyring = new Keyring({ type: "sr25519" });
      const aliceAccount = keyring.addFromUri("//Alice");
      console.log("Creating NFT...");

      return new Promise(async (resolve) => {
        try {
          await api.tx.uniques
            .mint(collectionId, nftId, aliceAccount.address)
            .signAndSend(aliceAccount, ({ status, dispatchError }) => {
              if (status.isInBlock) {
                const blockHash = status.asInBlock.toString();
                console.log(`NFT minted successfully in block: ${blockHash}`);
                getBlockNumber(blockHash);
                success("NFT minted successfully in block.");
                resolve("success");
              } else if (status.isFinalized) {
                console.log("NFT transaction finalized.");
              } else {
                console.log(`Current status: ${status.type}`);
              }

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
            })
            .catch((error) => {
              console.error("Transaction failed:", error);
              resolve("failed");
            });
        } catch (error) {
          console.error("An unexpected error occurred:", error);
          resolve("failed");
        }
      });
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      return "failed";
    }
  };

  const setNftMetadata = async (
    collectionId: number,
    nftId: number,
    image: string
  ): Promise<"success" | "failed"> => {
    try {
      if (!api) {
        console.error("API not initialized.");
        return "failed";
      }

      const keyring = new Keyring({ type: "sr25519" });
      const aliceAccount = keyring.addFromUri("//Alice");

      return new Promise(async (resolve) => {
        try {
          await api.tx.uniques
            .setMetadata(collectionId, nftId, image, false)
            .signAndSend(aliceAccount, ({ status, dispatchError }) => {
              if (status.isInBlock) {
                success("Metadata added to NFT.");
                resolve("success");
              } else if (status.isFinalized) {
                console.log("Metadata transaction finalized.");
              } else {
                console.log(`Current status: ${status.type}`);
              }

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
            })
            .catch((error) => {
              console.error("Transaction failed:", error);
              resolve("failed");
            });
        } catch (error) {
          console.error("An unexpected error occurred:", error);
          resolve("failed");
        }
      });
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      return "failed";
    }
  };

  const setNftAttribute = async (
    collectionId: number,
    nftId: number,
    name: string
  ): Promise<"success" | "failed"> => {
    try {
      if (!api) {
        console.error("API not initialized.");
        return "failed";
      }

      const keyring = new Keyring({ type: "sr25519" });
      const aliceAccount = keyring.addFromUri("//Alice");

      return new Promise(async (resolve) => {
        try {
          await api.tx.uniques
            .setAttribute(collectionId, nftId, "name", name)
            .signAndSend(aliceAccount, ({ status, dispatchError }) => {
              if (status.isInBlock) {
                success("Name attribute added to NFT.");
                resolve("success");
              } else if (status.isFinalized) {
                console.log("Attribute transaction finalized.");
              } else {
                console.log(`Current status: ${status.type}`);
              }

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
            })
            .catch((error) => {
              console.error("Transaction failed:", error);
              resolve("failed");
            });
        } catch (error) {
          console.error("An unexpected error occurred:", error);
          resolve("failed");
        }
      });
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      return "failed";
    }
  };

  const handleInputChange = (event: any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setFormData({ ...formData, [name]: value });
  };

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
  };

  const close = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    getAllCollections();
  }, [api]);

  const CreateNewNft = async (e: FormEvent) => {
    e.preventDefault();
    if (!ipfsUrl) {
      errorAnnouncement("upload image please!");
      return;
    }
    setLoading(true);
    const collectionId = +formData.collection
      ? +formData.collection
      : collections[0].id;
    const nftId = nftsLength + 350;

    const createResult = await createNft(collectionId, nftId);
    if (createResult === "success") {
      const metadataResult = await setNftMetadata(
        collectionId,
        nftId,
        ipfsUrl!
      );
      if (metadataResult === "success") {
        const attributeResult = await setNftAttribute(
          collectionId,
          nftId,
          formData.name
        );
        if (attributeResult === "success") {
          await getNfts();
          close();
        } else {
          errorAnnouncement("Failed to set NFT attribute.");
        }
      } else {
        errorAnnouncement("Failed to set NFT metadata.");
      }
    } else {
      errorAnnouncement("Failed to create NFT.");
    }
    setLoading(false);
    setIpfsUrl(null);
    setNftImageFile(null);
    setNftImageUrl(null);
  };

  const handleImageUpload = (files: File[]) => {
    const file = files[0];
    const url = URL.createObjectURL(file);
    setNftImageUrl(url);
    setNftImageFile(file);
  };

  const handleUpload = async () => {
    if (!nftImageFile) {
      errorAnnouncement("Please select a file first.");
      return;
    }

    setUploadLoading(true);

    const apiKey = "3b7c3583d0707a78bd46";
    const apiSecret =
      "17b99fa91a935f2646d7b1c626652989f61356eb7e2a8c740342e806b489d3cd";

    const formData = new FormData();
    formData.append("file", nftImageFile);

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    try {
      const res = await axios.post(url, formData, {
        maxBodyLength: Infinity, // Pinata has a file size limit, this ensures larger files can be uploaded
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      });

      setIpfsUrl(`https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`);
    } catch (err) {
      errorAnnouncement("Failed to upload image to IPFS.");
      console.error(err);
    } finally {
      setUploadLoading(false);
    }
  };

  useEffect(() => {
    if (!nftImageFile) return;
    handleUpload();
  }, [nftImageFile]);

  return (
    <>
      <Modal
        setOpen={close}
        open={openModal}
        className="!w-[30rem] border  !border-text-color !text-white !bg-black !p-0"
      >
        <div className="border-b border-text-color flex justify-between items-center p-5">
          <div className="flex items-center gap-x-4">
            <p>Create Nft</p>
          </div>
          <button onClick={close}>X</button>
        </div>
        <form onSubmit={CreateNewNft} className="py-5 px-5 space-y-4">
          <InputField
            onChange={handleInputChange}
            name="name"
            label="NFT Name"
            required
          />
          <div className="flex flex-col">
            <label className="text-white" htmlFor="collection">
              Choose a Collection:
            </label>
            <select
              onChange={handleInputChange}
              required
              className="w-full bg-[#151515] py-2 rounded outline-none"
              name="collection"
              id="collection"
            >
              {collections.map((item: any, i: number) => {
                return (
                  <option key={i} value={+item.id}>
                    {item.metadata.data}
                  </option>
                );
              })}
            </select>
          </div>
          {nftImageUrl ? (
            <div className="flex items-center gap-x-6">
              <picture>
                <img
                  src={nftImageUrl}
                  alt={nftImageFile?.name}
                  className="rounded-base h-20 w-20 object-cover object-center"
                />
              </picture>
              <div className="flex flex-col gap-y-1">
                <span className="inter-small-regular">
                  {nftImageFile?.name}
                </span>
                <div>
                  {uploadLoading && <span>Uploading ....</span>}
                  {!ipfsUrl && !uploadLoading && (
                    <button
                      className="font-bold text-xl text-primary"
                      type="button"
                      onClick={() => handleUpload()}
                    >
                      upload
                    </button>
                  )}
                  {ipfsUrl && !uploadLoading && (
                    <span>image has been uploaded</span>
                  )}
                </div>
                <div>
                  <button
                    className="font-bold text-red-900"
                    type="button"
                    onClick={() => setNftImageUrl(null)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <FileUploadField
              className="!rounded-2xl "
              text={
                <div className="py-10 flex flex-col items-center gap-y-3">
                  <p className="font-bold">Drag and drop media</p>
                  <p className="text-sm font-bold gradient-text-4">
                    Browse files
                  </p>
                  <p>Max size: 50M</p>
                  <p>BJPG, PNG, GIF, SVG, MP4</p>
                </div>
              }
              filetypes={["image/gif", "image/jpeg", "image/png", "image/webp"]}
              onFileChosen={(files) => handleImageUpload(files)}
            />
          )}

          <div className="w-fit m-auto ">
            <button
              disabled={loading}
              type="submit"
              className=" px-5 py-2 rounded bg-white text-primary font-bold"
            >
              {loading || uploadLoading ? <Loader /> : "Create NFT"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreateNft;
