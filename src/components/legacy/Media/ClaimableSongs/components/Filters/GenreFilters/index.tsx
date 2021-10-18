import React from "react";
import { SearchMediaClaimableSongsGenresFilters } from "./initialFilters";
import {
  ClaimableSongsAppBar,
  ClaimableSongsSearchBar,
  ClaimableSongsSelectors,
  ClaimableSongsSliders,
} from "../elements";

type MediaClaimableSongsGenresFiltersProps = {
  filters: SearchMediaClaimableSongsGenresFilters;
  onFiltersChange: (filters: SearchMediaClaimableSongsGenresFilters) => void;
};

const MediaClaimableSongsGenresFilters: React.FunctionComponent<MediaClaimableSongsGenresFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  return (
    <div>
      <ClaimableSongsSearchBar filters={filters} onFiltersChange={onFiltersChange} />
      <ClaimableSongsAppBar filters={filters} onFiltersChange={onFiltersChange} />
      <ClaimableSongsSelectors filters={filters} onFiltersChange={onFiltersChange} artistFilters={false} />
      <ClaimableSongsSliders filters={filters} onFiltersChange={onFiltersChange} />
    </div>
  );
};

export default MediaClaimableSongsGenresFilters;
