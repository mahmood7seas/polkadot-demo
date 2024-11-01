/** @format */

import { useEffect } from "react";
import { getAccountDetails } from "./common";
import { Tab, Tabs } from "./components/tabs";
import { usePolkadot } from "./context";
import { MainBox } from "./layout";
import {
  Events,
  ListOfCollections,
  ListOfNft,
  ListOfTokens,
  NewBlocks,
} from "./sections";
import { BlockSearch } from "./sections/blocks/BlockSearch";
import { TransferNFT } from "./sections/transfer-NFT/TransferNFT";
import { TransferToken } from "./sections/transfer-token/TransferToken";

function App() {
  const { api } = usePolkadot();

  // const accountDetails = async (accountId: string) => {
  //   if (!api) return;
  //   const accountData = await api.query.system.account(accountId);
  //   console.log(accountData.toHuman());
  //   const accountAssets = await api.query.assets.account(38, accountId);
  //   console.log(accountAssets.toHuman());
  //   const accountInfo = await api.query.identity.identityOf(accountId);
  //   console.log(accountInfo.toHuman());
  // };

  const getAccountToken = async (accountId: string) => {
    if (!api) return;
    const assetIds = await api.query.assets.asset.entries();
    await Promise.all(
      assetIds.map(async ([key, _]) => {
        const info: any = key.args.map((k) => k.toHuman());
        const tok = await api.query.assets.account(info[0], accountId);
        console.log(tok.toHuman(), `token id ${info[0]}`);
      })
    );
  };

  useEffect(() => {
    const getData = async () => {
      getAccountToken(await getAccountDetails("Alice"));
    };
    getData();
  }, [api]);

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
              <Tab className="rounded px-5 w-[full]" title="Transfer NFT">
                <div className="px-5 py-5">
                  <TransferNFT />
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
