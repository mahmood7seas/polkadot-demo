/** @format */

interface NftInfo {
  owner: string;
  approved: string | null;
  isFrozen: boolean;
  deposit: string;
}

interface Metadata {
  deposit: string;
  data: string;
  isFrozen: boolean;
}

interface INftData {
  collectionId: string;
  nftId: string;
  nftInfo: NftInfo;
  metadata: Metadata;
  attribute: [string, string];
}

export type { INftData };
