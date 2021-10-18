export enum FILTER_TYPE {
  Auction = "AUCTION_TYPE",
  Sale = "SALE_TYPE",
  Media = "MEDIA_TYPE",
  Crypto = "CRYPTO_TYPE",
  PhysicalNFT = "PHYSICAL_NFT_TYPE",
  FT = "FT_TYPE",
}

export type SearchMediaMarketplaceFilters = {
  searchValue: string | undefined;
  filterTypes: FILTER_TYPE[];
  overpriced: number;
  underpriced: number;
};

export const initialFilters: SearchMediaMarketplaceFilters = {
  searchValue: undefined,
  filterTypes: [
    FILTER_TYPE.Auction,
    FILTER_TYPE.Sale,
    FILTER_TYPE.Media,
    FILTER_TYPE.Crypto,
    FILTER_TYPE.PhysicalNFT,
    FILTER_TYPE.FT,
  ],
  overpriced: 0.8,
  underpriced: 0.6,
};
