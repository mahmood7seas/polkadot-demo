/** @format */

import { Keyring } from "@polkadot/api";
import { FC, FormEvent, useState } from "react";
import { InputField, Modal } from "../../components";
import { usePolkadot } from "../../context";
import { Loader } from "../../components/loader-boxes/Loader";
import { useAnnouncement } from "../../hooks";

interface Props {
  openModal: boolean;
  setOpenModal: any;
  tokensLength: number;
  setTokens: any;
}

const CreateToken: FC<Props> = ({
  openModal,
  setOpenModal,
  tokensLength,
  setTokens,
}) => {
  const { api, getTokens } = usePolkadot();
  const [formData, setFormData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { success, error: errorAnnouncement } = useAnnouncement();

  const handleInputChange = (event: any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setFormData({ ...formData, [name]: value });
  };

  const getAllTokes = async () => {
    setTokens(await getTokens());
  };

  const close = () => {
    setOpenModal(false);
  };

  const createToken = async (
    assetId: number,
    decimals: number
  ): Promise<"success" | "failed"> => {
    if (!api) {
      console.error("API not initialized.");
      return "failed";
    }

    const keyring = new Keyring({ type: "sr25519" });
    const adminAccount = keyring.addFromUri("//Alice");

    return new Promise(async (resolve) => {
      try {
        const createTx = api.tx.assets.create(
          assetId,
          adminAccount.address,
          decimals
        );
        await createTx
          .signAndSend(adminAccount, ({ status, dispatchError }) => {
            if (status.isInBlock) {
              console.log(`Token created in block: ${status.asInBlock}`);
              success("Token created in block");
              resolve("success");
            } else if (status.isFinalized) {
              console.log("Token creation transaction finalized.");
              success("Token creation transaction finalized.");
            }
            if (dispatchError) {
              handleDispatchError(dispatchError);
              resolve("failed");
            }
          })
          .catch((error) => {
            console.error("Token creation failed:", error);
            errorAnnouncement("Token creation failed");
            resolve("failed");
          });
      } catch (error) {
        errorAnnouncement("An unexpected error occurred:");

        console.error("An unexpected error occurred:", error);
        resolve("failed");
      }
    });
  };

  const setTokenMetadata = async (
    assetId: number,
    name: string,
    symbol: string,
    decimals: number
  ): Promise<"success" | "failed"> => {
    if (!api) {
      console.error("API not initialized.");
      return "failed";
    }

    const keyring = new Keyring({ type: "sr25519" });
    const adminAccount = keyring.addFromUri("//Alice");

    return new Promise(async (resolve) => {
      try {
        const metadataTx = api.tx.assets.setMetadata(
          assetId,
          name,
          symbol,
          decimals
        );
        await metadataTx
          .signAndSend(adminAccount, ({ status, dispatchError }) => {
            if (status.isInBlock) {
              console.log(`Metadata set in block: ${status.asInBlock}`);
              resolve("success");
            } else if (status.isFinalized) {
              console.log("Metadata transaction finalized.");
              success("Metadata transaction finalized.");
            }
            if (dispatchError) {
              handleDispatchError(dispatchError);
              resolve("failed");
            }
          })
          .catch((error) => {
            console.error("Metadata setting failed:", error);
            resolve("failed");
            errorAnnouncement("Metadata setting failed");
          });
      } catch (error) {
        errorAnnouncement("An unexpected error occurred");

        console.error("An unexpected error occurred:", error);
        resolve("failed");
      }
    });
  };

  const mintTokenSupply = async (
    assetId: number,
    supply: number
  ): Promise<"success" | "failed"> => {
    if (!api) {
      console.error("API not initialized.");
      return "failed";
    }

    const keyring = new Keyring({ type: "sr25519" });
    const adminAccount = keyring.addFromUri("//Alice");

    return new Promise(async (resolve) => {
      try {
        const mintTx = api.tx.assets.mint(
          assetId,
          adminAccount.address,
          supply
        );
        await mintTx
          .signAndSend(adminAccount, ({ status, dispatchError }) => {
            if (status.isInBlock) {
              console.log(
                `Minted ${supply} units in block: ${status.asInBlock}`
              );
              resolve("success");
            } else if (status.isFinalized) {
              console.log("Minting transaction finalized.");
              success("Minting transaction finalized.");
            }
            if (dispatchError) {
              handleDispatchError(dispatchError);
              resolve("failed");
            }
          })
          .catch((error) => {
            console.error("Minting failed:", error);
            errorAnnouncement("Minting failed");

            resolve("failed");
          });
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        errorAnnouncement("An unexpected error occurred");

        resolve("failed");
      }
    });
  };

  const createNewToken = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const assetId = 30 + tokensLength; // Unique asset ID
    const decimals = 10;
    const initialSupply = +formData.initialSupply;
    const tokenName = formData.name;
    const tokenSymbol = formData.tokenSymbol;

    const createResult = await createToken(assetId, decimals);
    if (createResult === "success") {
      const metadataResult = await setTokenMetadata(
        assetId,
        tokenName,
        tokenSymbol,
        decimals
      );
      if (metadataResult === "success") {
        const mintResult = await mintTokenSupply(assetId, initialSupply);
        if (mintResult === "success") {
          await getAllTokes();
          close();
        } else {
          errorAnnouncement("Failed to mint initial token supply.");
        }
      } else {
        errorAnnouncement("Failed to set token metadata.");
      }
    } else {
      errorAnnouncement("Failed to create token.");
    }

    setLoading(false);
  };

  // Utility function for handling dispatch errors
  const handleDispatchError = (dispatchError: any) => {
    if (!api) return;
    if (dispatchError.isModule) {
      const decoded = api.registry.findMetaError(dispatchError.asModule);
      const { docs, name, section } = decoded;
      console.error(`Error: ${section}.${name}: ${docs.join(" ")}`);
    } else {
      console.error(`Error: ${dispatchError.toString()}`);
    }
  };

  return (
    <>
      <Modal
        setOpen={close}
        open={openModal}
        className="!w-[30rem] border  !border-text-color !text-white !bg-black !p-0"
      >
        <div className="border-b border-text-color flex justify-between items-center p-5">
          <div className="flex items-center gap-x-4">
            <p>Create Token</p>
          </div>
          <button onClick={close}>X</button>
        </div>
        <form onSubmit={createNewToken} className="py-5 px-5 space-y-4">
          <InputField
            onChange={handleInputChange}
            name="name"
            label="Name"
            required
          />
          <InputField
            onChange={handleInputChange}
            name="initialSupply"
            label="Initial Supply"
            required
            type="number"
          />
          <InputField
            onChange={handleInputChange}
            name="tokenSymbol"
            label="Token Symbol"
            required
          />
          <div className="w-fit m-auto ">
            <button
              disabled={loading}
              type="submit"
              className=" px-5 py-2 rounded bg-white text-primary font-bold"
            >
              {loading ? <Loader /> : "Create Token"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export { CreateToken };
