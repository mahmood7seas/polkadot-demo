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

function App() {
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
