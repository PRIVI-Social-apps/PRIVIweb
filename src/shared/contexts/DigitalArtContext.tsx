import React from "react";
import { BlockchainType, MediaStatus, MediaType } from "shared/services/API";
import { ARTWORK_MEDIA_TYPES } from "components/PriviDigitalArt/productUtils";
type ContextType = {
  openTab: { type: OpenType; id: string | undefined } | null;
  setOpenTab: (state: { type: OpenType; id: string | undefined } | null) => void;
  openFilters: boolean;
  setOpenFilters: (state: boolean) => void;
  showStatus: boolean;
  setShowStatus: (state: boolean) => void;
};

const DigitalArtContext: React.Context<ContextType> = React.createContext<ContextType>({
  openTab: null,
  setOpenTab: () => {},
  openFilters: false,
  setOpenFilters: () => {},
  showStatus: true,
  setShowStatus: () => {},
});

export enum OpenType {
  Home = "HOME",
  Explore = "EXPLORE",
  Liked = "LIKED",
  Search = "SEARCH",
  Marketplace = "MARKETPLACE",
}

export type SearchDigitalArtFilters = {
  blockChains: BlockchainType[];
  collection?: string;
  status?: MediaStatus;
  mediaTypes?: MediaType[];
};

export const initialDigitalArtFilters: SearchDigitalArtFilters = {
  mediaTypes: ARTWORK_MEDIA_TYPES,
  blockChains: [
    BlockchainType.Privi,
    BlockchainType.Eth,
    BlockchainType.Wax,
    BlockchainType.Zora,
    BlockchainType.OpenSea,
    BlockchainType.Mirror,
    BlockchainType.Foundation,
    BlockchainType.Topshot,
    // BlockchainType.Sorare,
    BlockchainType.Showtime,
    BlockchainType.Hicetnunc,
    BlockchainType.Binance,
  ],
  collection: undefined,
  status: undefined,
};

export default DigitalArtContext;
