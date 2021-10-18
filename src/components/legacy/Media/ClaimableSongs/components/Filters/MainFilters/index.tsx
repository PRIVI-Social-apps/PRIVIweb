import React from "react";
import { SearchMediaClaimableSongsFilters } from "./initialFilters";
import { ClaimableSongsSearchBar } from "../elements";

type MediaClaimableSongsFiltersProps = {
  filters: SearchMediaClaimableSongsFilters;
  onFiltersChange: (filters: SearchMediaClaimableSongsFilters) => void;
};

const MediaClaimableSongsFilters: React.FunctionComponent<MediaClaimableSongsFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  return <ClaimableSongsSearchBar filters={filters} onFiltersChange={onFiltersChange} />;
};

export default MediaClaimableSongsFilters;
