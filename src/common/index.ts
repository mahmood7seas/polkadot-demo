/** @format */

const truncateAddress = (address: string) => {
  if (!address) return "";
  if (address.length < 8) return address;
  const start = address.slice(0, 8);
  return `${start}...`;
};

export { truncateAddress };
