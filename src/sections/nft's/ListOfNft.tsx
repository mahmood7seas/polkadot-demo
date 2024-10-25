/** @format */

import { useEffect, useState } from "react";
import { truncateAddress } from "../../common";
import { DataTable, DataTableLoading } from "../../components";
import { usePolkadot } from "../../context";
import { INftData } from "../../types";
import CreateNft from "./CreateNft";
import DetailsModal from "./DetailsModal";

const ListOfNft = () => {
  const { api } = usePolkadot();
  const [allNft, setAllNft] = useState([]);
  const [loading, setLoading] = useState<any>(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedNft, setSelectedNft] = useState<INftData | null>(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  console.log({ selectedNft });

  const openDetails = (nft: INftData) => {
    setSelectedNft(nft);
    setOpenDetailsModal(true);
  };

  const getAllNft = async () => {
    if (!api) return;
    let nftAll: any = [];

    const accountNfts = await api.query.uniques.account.keys();
    await Promise.all(
      accountNfts.map(async (item) => {
        const info: any = item.toHuman();
        // const accountId = info[0];
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

    setAllNft(nftAll);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getAllNft();
  }, [api]);

  return (
    <div className="max-w-[700px] m-auto">
      <div className="bg-[#D9D9D90A] p-5 rounded-2xl overflow-x-auto">
        {loading && <DataTableLoading />}
        {!loading && (
          <DataTable
            tableClassName="min-w-[500px]"
            headers={["nftId", "collectionId", "Name", "owner", "image", ""]}
            data={allNft}
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
                    <span className="text-primary">{item?.attribute[0]}</span>
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
                      onClick={() => openDetails(item)}
                      className="font-bold text-primary hover:text-primary/80"
                    >
                      details
                    </button>
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
            Create NFT
          </button>
        </div>
      </div>
      <CreateNft
        getNfts={getAllNft}
        nftsLength={allNft.length}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
      <DetailsModal
        getAllNft={getAllNft}
        openModal={openDetailsModal}
        selectedNft={selectedNft}
        setOpenModal={setOpenDetailsModal}
        setSelectedNft={setSelectedNft}
      />
    </div>
  );
};

export { ListOfNft };
