/** @format */

import { Keyring } from "@polkadot/api";
import { FC, useState } from "react";
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
  const { success, error: tokenError } = useAnnouncement();

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

  const createToken = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (!api) return;

    try {
      const keyring = new Keyring({ type: "sr25519" });
      const adminAccount = keyring.addFromUri("//Alice");

      const assetId = 30 + tokensLength; // Generate a unique asset ID
      const initialSupply = +formData.initialSupply;
      const decimals = 10;
      const tokenName = formData.name;
      const tokenSymbol = formData.tokenSymbol;

      // Step 1: Create the token
      const createTx = api.tx.assets.create(
        assetId,
        adminAccount.address,
        decimals
      );

      await createTx.signAndSend(adminAccount, async ({ status }) => {
        if (status.isInBlock) {
          console.log(
            `Token created successfully. Included in block: ${status.asInBlock}`
          );
          success("Token created successfully.");
        } else if (status.isFinalized) {
          console.log(`Transaction finalized: ${status.asFinalized}`);
          success("Token creation finalized");

          // Step 2: Set the metadata (after token creation)
          const metadataTx = api.tx.assets.setMetadata(
            assetId,
            tokenName,
            tokenSymbol,
            decimals
          );
          await metadataTx.signAndSend(adminAccount, async ({ status }) => {
            if (status.isInBlock) {
              console.log(
                `Metadata set successfully. Included in block: ${status.asInBlock}`
              );
            } else if (status.isFinalized) {
              console.log(
                `Metadata transaction finalized: ${status.asFinalized}`
              );
              success("Token metadata set successfully");
            }
          });

          // Step 3: Mint the initial supply (after setting metadata)
          const mintTx = api.tx.assets.mint(
            assetId,
            adminAccount.address,
            initialSupply
          );
          await mintTx.signAndSend(adminAccount, ({ status }) => {
            if (status.isInBlock) {
              console.log(`Minted ${initialSupply} units of the token.`);
              success("Initial supply minted successfully.");
            } else if (status.isFinalized) {
              console.log(
                `Minting transaction finalized: ${status.asFinalized}`
              );
            }
          });

          getAllTokes();
          setLoading(false);
          close();
        }
      });
    } catch (error) {
      console.error("Error creating token:", error);
      tokenError("Failed to create token.");
    } finally {
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
        <form onSubmit={createToken} className="py-5 px-5 space-y-4">
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
