/** @format */

// Type for the Asset Details
interface TokensDetails {
  owner: string;
  issuer: string;
  admin: string;
  freezer: string;
  supply: string;
  deposit: string;
  minBalance: string;
  isSufficient: boolean;
  accounts: string;
  sufficients: string;
  approvals: string;
  status: string;
}

// Type for the Metadata
interface Metadata {
  deposit: string;
  name: string;
  symbol: string;
  decimals: string;
  isFrozen: boolean;
}

interface ITokens {
  assetId: string;
  details: TokensDetails;
  metadata: Metadata;
}

export type { ITokens, Metadata, TokensDetails };
