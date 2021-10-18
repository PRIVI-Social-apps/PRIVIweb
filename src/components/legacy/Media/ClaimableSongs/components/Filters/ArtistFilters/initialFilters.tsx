export type SearchMediaClaimableSongsAritstFilters = {
  tabValue: number | undefined;
  genreValue: string | undefined;
  bitRateValue: number | undefined;
  reproductionsNumber: number | undefined;
  priceRateNumber: number | undefined;
  likesNumber: number | undefined;
};

export const initialFilters: SearchMediaClaimableSongsAritstFilters = {
  tabValue: 0,
  genreValue: undefined,
  bitRateValue: undefined,
  reproductionsNumber: 4500,
  priceRateNumber: 4500,
  likesNumber: 4500,
};
