export interface NFTItem {
  itemId: number;
  name: string;
  nftContract: string;
  tokenId: number;
  owner: string;
  creator: string;
  price: string;
  royalityFee: number;
  isSelling: boolean;
  uri: string;
}

export interface CreateObj {
  media?: File | null;
  caption?: string;
  isUploading?: boolean;
}
