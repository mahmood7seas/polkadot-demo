/** @format */

import { FC } from "react";
import { Modal } from "../../components";
import { ITokens } from "../../types";
import { truncateAddress } from "../../common";

interface Props {
  openModal: boolean;
  setOpenModal: any;
  setSelectedTransaction: any;
  selectedTransaction: any;
  tokens: ITokens[];
}

const TransactionDetails: FC<Props> = ({
  openModal,
  setOpenModal,
  selectedTransaction,
  setSelectedTransaction,
  tokens,
}) => {
  const close = () => {
    setOpenModal(false);
    setSelectedTransaction(null);
  };

  console.log({ selectedTransaction });

  const getToken = (tokenId: string) => {
    const selectedToken = tokens.find((item) => item.assetId == tokenId);
    return selectedToken?.metadata.name;
  };

  return (
    <>
      <Modal
        setOpen={close}
        open={openModal}
        className="!w-[35rem] border overflow-y-auto !border-text-color !text-white !bg-black !p-0"
      >
        <div className="border-b border-text-color flex justify-between items-center p-5">
          <div className="flex items-center gap-x-4">
            <p>Transaction Details</p>
          </div>
          <button onClick={() => close()}>X</button>
        </div>
        <div className="p-5 space-y-3">
          <div className="">
            <p className="w-[150px] font-semibold inline-block">signature</p>
            <p className="text-primary inline-block">
              {truncateAddress(selectedTransaction?.signature)}
            </p>
          </div>
          <div className="">
            <p className="w-[150px] font-semibold inline-block">method</p>
            <p className="text-primary inline-block">
              {selectedTransaction?.method?.method}
            </p>
          </div>
          <div className="">
            <p className="w-[150px] font-semibold inline-block">section</p>
            <p className="text-primary inline-block">
              {selectedTransaction?.method?.section}
            </p>
          </div>
          <div className="">
            <p className="w-[150px] font-semibold inline-block">From</p>
            <p className="text-primary inline-block">
              {truncateAddress(selectedTransaction?.signer?.Id)}
            </p>
          </div>

          <div className="">
            <p className="w-[150px] font-semibold inline-block">To</p>
            <p className="text-primary inline-block">
              {selectedTransaction?.method?.args?.target?.Id
                ? truncateAddress(selectedTransaction?.method?.args?.target?.Id)
                : "--"}
            </p>
          </div>
          <div className="">
            <p className="w-[150px] font-semibold inline-block">Token</p>
            <p className="text-primary inline-block">
              {selectedTransaction?.method?.args?.id
                ? getToken(selectedTransaction?.method?.args?.id)
                : "--"}
            </p>
          </div>
          <div className="">
            <p className="w-[150px] font-semibold inline-block">Token</p>
            <p className="text-primary inline-block">
              {selectedTransaction?.method?.args?.amount
                ? selectedTransaction?.method?.args?.amount
                : "--"}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export { TransactionDetails };
