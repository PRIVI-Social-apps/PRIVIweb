import React from "react";
import { SearchMediaClaimableSongsAritstFilters } from "./initialFilters";
import {
  ClaimableSongsAppBar,
  ClaimableSongsSearchBar,
  ClaimableSongsSelectors,
  ClaimableSongsSliders,
} from "../elements";

type MediaClaimableSongsArtistsFiltersProps = {
  filters: SearchMediaClaimableSongsAritstFilters;
  onFiltersChange: (filters: SearchMediaClaimableSongsAritstFilters) => void;
};

const MediaClaimableSongsArtistsFilters: React.FunctionComponent<MediaClaimableSongsArtistsFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  return (
    <div>
      <ClaimableSongsSearchBar filters={filters} onFiltersChange={onFiltersChange} />
      <ClaimableSongsAppBar filters={filters} onFiltersChange={onFiltersChange} />
      <ClaimableSongsSelectors filters={filters} onFiltersChange={onFiltersChange} artistFilters={true} />
      <ClaimableSongsSliders filters={filters} onFiltersChange={onFiltersChange} />
    </div>
  );
};

export default MediaClaimableSongsArtistsFilters;
