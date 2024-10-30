/** @format */

import { Keyring } from "@polkadot/api";
import { usePolkadot } from "../../context";
import { useAnnouncement } from "../../hooks";
import { InputField } from "../../components";
import { FormEvent, useEffect, useState } from "react";
import { ITokens } from "../../types";
import { Loader } from "../../components/loader-boxes/Loader";

const TransferToken = () => {
  const { api, getTokens } = usePolkadot();
  const { error: errorAnnouncement, success } = useAnnouncement();
  const [tokens, setTokens] = useState<ITokens[]>([]);
  const [formData, setFormData] = useState<any>();
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const getAllTokes = async () => {
      setTokens(await getTokens());
    };
    if (!api) return;
    getAllTokes();
  }, [api]);

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
    console.log(`Transfer included in block number: ${blockNumber}`);
    copyToClipboard(blockNumber);
  };

  const transferToken = async (): Promise<"success" | "failed"> => {
    if (!api) {
      console.error("API not initialized.");
      return "failed";
    }

    try {
      const keyring = new Keyring({ type: "sr25519" });
      const fromAccount = keyring.addFromUri("//Alice");
      const toAccount = keyring.addFromUri("//Pop");
      const assetId = formData.token ? +formData.token : +tokens[0].assetId;
      const amount = +formData.amount;

      if (!fromAccount || !toAccount) {
        console.error("Failed to create accounts from URI.");
        return "failed";
      }

      const toAddress = api.createType("MultiAddress", toAccount.address);

      console.log("Amount before conversion:", amount);

      let compactAmount;
      if (typeof amount === "number" || typeof amount === "string") {
        if (Number(amount) <= 0) {
          console.error("Amount should be greater than zero.");
          return "failed";
        }
        compactAmount = api.createType("Compact<u128>", String(amount));
      } else {
        console.error("Invalid amount type:", typeof amount);
        return "failed";
      }

      console.log("Compact Amount:", compactAmount.toString());

      return new Promise(async (resolve) => {
        try {
          await api.tx.assets
            .transfer(assetId, toAddress, compactAmount)
            .signAndSend(fromAccount, ({ status, dispatchError }) => {
              if (status.isInBlock) {
                const blockHash = status.asInBlock.toString();
                console.log(`Transfer included in block: ${blockHash}`);
                getBlockNumber(blockHash);
                success("Token transfer successful.");
                resolve("success");
              } else if (status.isFinalized) {
                console.log("Transaction finalized.");
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
      console.error("An error occurred:", error);
      return "failed";
    }
  };

  const submitTransfer = async (e: FormEvent) => {
    e.preventDefault();
    if (formData) {
      setLoading(true);
      const res = await transferToken();
      if (res == "success") {
        setLoading(false);
      } else {
        errorAnnouncement("some thing went wrong while transfer Token");
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-[700px] m-auto">
      <div className="bg-[#D9D9D90A] p-5 rounded-2xl overflow-x-auto">
        <form onSubmit={submitTransfer} className="p-5 space-y-3">
          <div>
            <p className="font-semibold w-[100px] inline-block">From</p>
            <p className="inline-block">Alice</p>
          </div>
          <div>
            <p className="font-semibold w-[100px] inline-block">To</p>
            <p className="inline-block">Pop</p>
          </div>
          <div className="flex flex-col">
            <label className="text-white font-semibold text-xs" htmlFor="token">
              Select Token
            </label>
            <select
              onChange={handleInputChange}
              aria-placeholder=""
              required
              className="w-full bg-[#151515] py-2 rounded outline-none"
              name="token"
              id="token"
            >
              {tokens.map((item, i: number) => {
                return (
                  <option key={i} value={+item.assetId}>
                    {item.metadata.name}
                  </option>
                );
              })}
            </select>
          </div>
          <InputField
            onChange={handleInputChange}
            type="number"
            required
            name="amount"
            placeholder="add amount"
            label="amount"
          />
          <div className="w-fit p-5 m-auto">
            <button
              type="submit"
              disabled={loading}
              className=" px-5 py-2 rounded bg-white text-primary font-bold"
            >
              {loading ? <Loader /> : "Transfer Token"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { TransferToken };
