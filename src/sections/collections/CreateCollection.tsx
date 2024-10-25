/** @format */

import { Keyring } from "@polkadot/api";
import { FC, useState } from "react";
import { InputField, Modal } from "../../components";
import { Loader } from "../../components/loader-boxes/Loader";
import { usePolkadot } from "../../context";
import { useAnnouncement } from "../../hooks";

interface Props {
  openModal: boolean;
  setOpenModal: any;
  CollectionLength: number;
  getCollections: any;
}

const CreateCollection: FC<Props> = ({
  CollectionLength,
  getCollections,
  openModal,
  setOpenModal,
}) => {
  const { api } = usePolkadot();
  const [formData, setFormData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { success, error: errorAnnouncement } = useAnnouncement();

  const handleInputChange = (event: any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setFormData({ ...formData, [name]: value });
  };

  const close = () => {
    setOpenModal(false);
  };

  const getAllCollections = async () => {
    await getCollections();
  };

  const createCollection = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (!api) return;
    try {
      const keyring = new Keyring({ type: "sr25519" });
      const signer = keyring.addFromUri("//Alice");

      if (!api) return;

      await api.tx.uniques
        .create(CollectionLength + 150, signer.address)
        .signAndSend(signer, async ({ status }) => {
          if (status.isInBlock) {
            console.log("Collection created successfully.");
            success("Collection created successfully.");

            const name = formData.name;
            await api.tx.uniques
              .setCollectionMetadata(CollectionLength + 150, name, true)
              .signAndSend(signer, ({ status }) => {
                if (status.isInBlock) {
                  console.log("Collection metadata set successfully.");
                  success("Collection metadata set successfully.");
                } else if (status.isFinalized) {
                  console.log("Metadata transaction finalized.");
                }
              });
          } else if (status.isFinalized) {
            console.log("Transaction finalized.");
            success("Transaction finalized.");
            getAllCollections();
            setLoading(false);
            close();
          }
        });
    } catch (error) {
      console.error("Error creating collection or setting metadata:", error);
      errorAnnouncement("Error creating collection or setting metadata:");
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
            <p>Create Collection</p>
          </div>
          <button onClick={close}>X</button>
        </div>
        <form onSubmit={createCollection} className="py-5 px-5 space-y-4">
          <InputField
            onChange={handleInputChange}
            name="name"
            label="Name"
            required
          />

          <div className="w-fit m-auto ">
            <button
              disabled={loading}
              type="submit"
              className=" px-5 py-2 rounded bg-white text-primary font-bold"
            >
              {loading ? <Loader /> : "Create Collection"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export { CreateCollection };
