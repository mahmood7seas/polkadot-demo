/** @format */

import { Keyring } from "@polkadot/api";

const truncateAddress = (address: string) => {
  if (!address) return "";
  if (address.length < 8) return address;
  const start = address.slice(0, 8);
  return `${start}...`;
};

const getAccountDetails = async (name: "Alice" | "Bob") => {
  const keyring = new Keyring({ type: "sr25519" });
  const account = keyring.addFromUri(`//${name}`);
  return account.address;
};

export { truncateAddress, getAccountDetails };
