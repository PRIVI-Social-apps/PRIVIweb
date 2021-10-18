export type SearchMediaClaimableSongsGenresFilters = {
  tabValue: number | undefined;
  artistValue: string | undefined;
  albumValue: string | undefined;
  bitRateValue: number | undefined;
  reproductionsNumber: number | undefined;
  priceRateNumber: number | undefined;
  likesNumber: number | undefined;
};

export const initialFilters: SearchMediaClaimableSongsGenresFilters = {
  tabValue: 0,
  artistValue: undefined,
  albumValue: undefined,
  bitRateValue: undefined,
  reproductionsNumber: 4500,
  priceRateNumber: 4500,
  likesNumber: 4500,
};
