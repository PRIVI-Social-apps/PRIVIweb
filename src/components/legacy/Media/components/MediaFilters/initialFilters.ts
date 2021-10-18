import { BlockchainType, SearchMediaFilters } from "shared/services/API/MediaAPI";

enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

export const initialFilters: SearchMediaFilters = {
  searchValue: undefined,
  mediaTypes: [
    MediaType.DigitalArt,
    MediaType.Video,
    MediaType.LiveVideo,
    MediaType.Audio,
    MediaType.LiveAudio,
    MediaType.Blog,
    MediaType.BlogSnap,
  ],
  blockChains: [
    BlockchainType.Privi,
    BlockchainType.Eth,
    BlockchainType.Wax,
    BlockchainType.Zora,
    BlockchainType.OpenSea,
    BlockchainType.Mirror,
    BlockchainType.Foundation,
    BlockchainType.Topshot,
    BlockchainType.Sorare,
    BlockchainType.Showtime,
  ],
  collection: undefined,
  status: undefined,
};
