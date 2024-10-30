/** @format */

import { Tab, Tabs } from "./components/tabs";
import { MainBox } from "./layout";
import {
  Events,
  ListOfCollections,
  ListOfNft,
  ListOfTokens,
  NewBlocks,
} from "./sections";
import { BlockSearch } from "./sections/blocks/BlockSearch";
import { TransferToken } from "./sections/transfer-token/TransferToken";

function App() {
  // useEffect(() => {
  //   const fetchTransactions = async () => {
  //     if (!api) return;

  //     const endBlock = await api.rpc.chain.getHeader();
  //     const startBlock = endBlock.number.toNumber() - 50;

  //     const allTransactions: any[] = [];

  //     for (let i = startBlock; i <= endBlock.number.toNumber(); i++) {
  //       const blockHash = await api.rpc.chain.getBlockHash(i);
  //       const signedBlock = await api.rpc.chain.getBlock(blockHash);

  //       signedBlock.block.extrinsics.forEach(async (extrinsic, index) => {
  //         const {
  //           method: { method, section },
  //           signer,
  //           args,
  //         } = extrinsic;

  //         const data = extrinsic;

  //         console.log(data.toHuman());

  //         allTransactions.push({
  //           id: extrinsic.toHex(),
  //           blockNumber: i,
  //           method: `${method}`,
  //           section: section,
  //           signer: signer.toString(),
  //           classId: args[0].toString(),
  //           instanceId: args[1]?.toString(),
  //           owner: args[1]?.toString() || args[2]?.toString(),
  //         });
  //       });
  //     }

  //     console.log(allTransactions);
  //   };

  //   fetchTransactions();
  // }, [api]);

  return (
    <div className="max-h-screen">
      <div className="h-[80vh] border-b overflow-y-auto">
        <MainBox>
          <div className="text-sm py-5">
            <Tabs
              isActiveClassName="bg-[#4b68cf] rounded px-5 w-[full] text-white"
              className="!w-fit m-auto"
            >
              <Tab className="rounded px-5 w-[full]" title="Tokens">
                <div className="px-5 py-5">
                  <ListOfTokens />
                </div>
              </Tab>
              <Tab className="rounded px-5 w-[full]" title="Blocks">
                <div className="px-5 py-5">
                  <NewBlocks />
                </div>
              </Tab>
              <Tab className="rounded px-5 w-[full]" title="Collections">
                <div className="px-5 py-5">
                  <ListOfCollections />
                </div>
              </Tab>
              <Tab className="rounded px-5 w-[full]" title="NFT'S">
                <div className="px-5 py-5">
                  <ListOfNft />
                </div>
              </Tab>
              <Tab className="rounded px-5 w-[full]" title="Block Details">
                <div className="px-5 py-5">
                  <BlockSearch />
                </div>
              </Tab>
              <Tab className="rounded px-5 w-[full]" title="Transfer Token">
                <div className="px-5 py-5">
                  <TransferToken />
                </div>
              </Tab>
            </Tabs>
          </div>
        </MainBox>
      </div>
      <div className="h-[20vh] text-sm overflow-y-auto">
        <MainBox className="">
          <div className="py-2 relative">
            <p className="text-center text-xs fixed top-[80vh] left-0 right-0 mx-auto py-2 w-fit bg-black">
              BlockChain Live Events
            </p>
            <div className="">
              <Events />
            </div>
          </div>
        </MainBox>
      </div>
    </div>
  );
}

export default App;
