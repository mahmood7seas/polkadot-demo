/** @format */

import React, { FC, useState } from "react";
import { INftData } from "../../types";
import { Modal } from "../../components";
import { truncateAddress } from "../../common";
import { Keyring } from "@polkadot/api";
import { usePolkadot } from "../../context";
import { useAnnouncement } from "../../hooks";
import { Loader } from "../../components/loader-boxes/Loader";

interface Props {
  setSelectedNft: React.Dispatch<React.SetStateAction<INftData | null>>;
  selectedNft: INftData | null;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  getAllNft: any;
}

const DetailsModal: FC<Props> = ({
  openModal,
  selectedNft,
  setOpenModal,
  setSelectedNft,
  getAllNft,
}) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { api } = usePolkadot();
  const { success } = useAnnouncement();

  const close = () => {
    setOpenModal(false);
    setSelectedNft(null);
  };

  const burnNft = async (collectionId: number, nftID: number) => {
    if (!api) return;
    setDeleteLoading(true);
    try {
      const keyring = new Keyring({ type: "sr25519" });
      const signer = keyring.addFromUri("//Alice");

      const ownerMultiAddress = api.createType(
        "Option<MultiAddress>",
        signer.address
      );

      const tx = api.tx.uniques.burn(collectionId, nftID, ownerMultiAddress);
      const unsub = await tx.signAndSend(signer, ({ status }) => {
        if (status.isInBlock) {
          console.log(`Transaction included at blockHash ${status.asInBlock}`);
        } else if (status.isFinalized) {
          console.log(
            `Transaction finalized at blockHash ${status.asFinalized}`
          );
          getAllNft();
          setDeleteLoading(false);
          close();
          success("nft Deleted successfully!");
          unsub();
        }
      });
    } catch (error) {
      console.error("Error burning asset:", error);
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
            <p>Nft Details</p>
          </div>
          <button onClick={close}>X</button>
        </div>
        <div className="p-5">
          <img
            src={selectedNft?.metadata?.data}
            alt={selectedNft?.attribute[0]}
            className="rounded-base w-[20rem] h-[200px] m-auto object-cover object-center"
          />
          <div className="flex mt-5 flex-col gap-y-1">
            <span>Name: {selectedNft?.attribute[0]}</span>
            <span className="">
              Owner: {truncateAddress(selectedNft?.nftInfo?.owner!)}
            </span>
          </div>
          <div className="w-fit m-auto mt-10">
            {deleteLoading ? (
              <Loader className="w-10" />
            ) : (
              <button
                onClick={() =>
                  burnNft(+selectedNft?.collectionId!, +selectedNft?.nftId!)
                }
                className="px-6 py-1 bg-red-900 rounded text-lg hover:bg-red-700"
                type="button"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DetailsModal;
