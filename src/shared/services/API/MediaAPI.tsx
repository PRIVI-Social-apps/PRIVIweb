import axios, { CancelTokenSource } from "axios";
import URL from "shared/functions/getURL";
import { UserInfo } from "store/actions/UsersInfo";
import { getRandomAvatarForUserIdWithMemoization } from "../user/getUserAvatar";
import { removeUndef } from "shared/helpers/fp";
import { removeAllUnnecessaryZeros } from "shared/functions/commonFunctions";
import { stringify } from "querystring";

export enum MediaType {
  Video = "VIDEO_TYPE",
  LiveVideo = "LIVE_VIDEO_TYPE",
  Audio = "AUDIO_TYPE",
  LiveAudio = "LIVE_AUDIO_TYPE",
  Blog = "BLOG_TYPE",
  BlogSnap = "BLOG_SNAP_TYPE",
  DigitalArt = "DIGITAL_ART_TYPE",
}

export enum BlockchainType {
  Privi = "PRIVI",
  Eth = "eth",
  Wax = "WAX",
  Zora = "Zora",
  OpenSea = "Opensea",
  Mirror = "Mirror",
  Foundation = "Foundation",
  Topshot = "Topshot",
  Sorare = "Sorare",
  Showtime = "Showtime",
  Hicetnunc = "Hicetnunc",
  Binance = "Binance",
}

export enum MediaStatus {
  BuyNow = "buyNow",
  OnAuction = "auction",
  LiveNow = "liveNow",
  New = "new",
}

export enum PaymentType {
  Dynamic = "DYNAMIC",
  Fixed = "FIXED",
}

export enum MediaSource {
  Privi = "privi",
  Eth = "eth",
}

export type Media = PriviMedia | EthMedia;

export type PriviMedia = PriviMediaDTO & {
  source: MediaSource.Privi;
  eth: false;
  ImageUrl?: string;
  Artist?: {
    name: string;
    imageURL: string;
    urlSlug: string;
  };
  SavedCollabs?: Array<{
    id: string;
    name: string;
    imageURL: string;
    urlSlug: string;
    [key: string]: any;
  }>;
  usdPrice: string;
  price: string;
  Url: string;
  UrlMainPhoto: string;
};

export type EthMedia = EthMediaDTO & {
  source: MediaSource.Eth;
  eth: true;
  randomAvatar: string;
  usdPrice: string;
  dimensions: any;
};

const isPriviMediaDTO = (dto: PriviMediaDTO | EthMediaDTO): dto is PriviMediaDTO =>
  dto["blockchain"] === "PRIVI";

export type PriviMediaDTO = {
  blockchain: "PRIVI";
  Collabs: Record<string, string>;
  Creator: string;
  CreatorId: string;
  Copies: number;
  CountStreamers: number;
  CountWatchers: number;
  EditorPages?: Array<any>;
  EndedTime: number;
  EndingTime: number;
  ExpectedDuration: number;
  FundingToken: string;
  HasPhoto: boolean;
  id: string;
  IsRecord: boolean;
  Likes: string[];
  LimitedEdition: any[];
  MainStreamer: string;
  MediaDescription: string;
  MediaName: string;
  MediaSymbol: string;
  Moderators: any[];
  NumLikes: number;
  OnlineModerators: any[];
  OnlineStreamers: string[];
  PaymentType: PaymentType;
  PodAddress: string;
  Price: number;
  PricePerSecond: any;
  PriceType: string;
  RecordCopies: number;
  RecordPaymentType: string;
  RecordPrice: number;
  RecordPricePerSecond: number;
  RecordRoyalty: number;
  RecordToken: string;
  ReleaseDate: number;
  Requester: string;
  Rewards: string;
  RoomName: string;
  RoomState: string;
  Royalty: number;
  SavedCollabs?: Array<{
    id: string;
    [key: string]: any;
  }>;
  SessionId: Record<string, string>;
  SharingPct: number;
  StartedTime: any;
  StartingTime: number;
  Streamers: string[];
  StreamingToken: string;
  StreamingUrl: string;
  TotalWatchers: number;
  Type: MediaType;
  Video: boolean;
  Watchers: any[];
  ViewConditions: {
    ViewingToken: string;
    [key: string]: any;
  };
  QuickCreation: boolean;
  dimensions: {
    width: number;
    height: number;
  };
  Url: string;
  UrlMainPhoto: string;
};

type EthMediaDTO = {
  collectedAtBlock?: any;
  collection_address: string;
  collection: string;
  creator: string;
  description: string;
  id: string;
  likes: number;
  link: string;
  owner: string;
  price: string;
  status: string[];
  tag: string;
  title: string;
  token_id: string;
  type: MediaType;
  url: string;
  Url: string;
  mediaUrl?: string;
  dimensions: {
    width: number;
    height: number;
  };
};

export type SearchMediaFilters = {
  searchValue?: string;
  mediaTypes: MediaType[];
  blockChains: BlockchainType[];
  collection?: string;
  status?: MediaStatus;
};

export type SearchMediaResult = {
  lastId: string | null;
  lastIdBlockchain: string;
  hasMore: boolean;
  data: Media[];
};

type GetMediasFiltersDTO = {
  searchValue: "" | string; // empty string is used on the backend to encode no search value :O
  mediaTypes: MediaType[];
  blockChains: BlockchainType[];
  collection?: string;
  status?: MediaStatus;
};

type GetMediasResultDTO =
  | {
      success: true;
      lastId: string | "null"; // backend returns string "null" for empty value :O
      lastIdBlockchain: string;
      hasMore: boolean;
      data: Array<PriviMediaDTO | EthMediaDTO>;
    }
  | { success: false };

let source: CancelTokenSource;

export const successFunc = res => res.data;
export const failFunc = (e: Error) => {
  console.log(e.message);
  throw new Error(e.message);
};
export const searchMedia = async (
  {
    page,
    lastId,
    lastIdBlockchain,
    filters,
    allUsers,
  }: {
    page: number;
    lastId: string | null;
    lastIdBlockchain: string;
    filters: SearchMediaFilters;
    // TODO: Refactor, remove dependency to all users list
    allUsers: UserInfo[];
  },
  forceRefreshCache?: boolean
): Promise<SearchMediaResult> => {
  const filtersDto: GetMediasFiltersDTO = {
    ...filters,
    searchValue: filters.searchValue ?? "",
  };

  if (source) {
    source.cancel();
  }
  const body = {
    ...filtersDto,
    pagination: page,
    lastId: lastId,
    lastIdBlockchain,
  };
  const CancelToken = axios.CancelToken;
  source = CancelToken.source();

  try {
    const { data } = await axios.post<GetMediasResultDTO>(`${URL()}/media/getMedias`, body, {
      cancelToken: source.token,
      params: forceRefreshCache
        ? {
            forceRefreshCache: true,
          }
        : {},
    });

    if (!data.success) {
      throw new Error("getMedias error");
    }

    const changeRate = await rateOfChange();

    return {
      // TODO: Fix "null" issue on the backend
      lastId: data.lastId === "null" ? null : data.lastId,
      lastIdBlockchain: data.lastIdBlockchain,
      hasMore: data.hasMore,
      // TODO: Refactor data mapping to something simpler
      data: data.data.map(d => {
        if (isPriviMediaDTO(d)) {
          return processPriviMedia(d, { allUsers, changeRate });
        } else {
          const randomAvatar = getRandomAvatarForUserIdWithMemoization(d.creator);

          let usdPrice = "";
          if (d.price && d.price.includes("($")) {
            //separate price from usd price
            let price = d.price.split("(")[0];
            let usdPrice = "(" + d.price.split("(")[1];

            d.price = price;
            usdPrice = usdPrice;
          }

          return {
            ...d,
            source: MediaSource.Eth,
            eth: true,
            randomAvatar,
            usdPrice,
          };
        }
      }),
    };
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled");
    } else {
      console.log("cancel error");
    }
    // eslint-disable-next-line no-throw-literal
    throw error;
  }
};

type GetMediaResult =
  | {
      success: true;
      data: PriviMediaDTO;
    }
  | { success: false };

export const getPriviMedia = async ({
  mediaId,
  allUsers,
}: {
  mediaId: string;
  // TODO: Refactor, remove dependency to all users list
  allUsers: UserInfo[];
}) => {
  const { data } = await axios.get<GetMediaResult>(`${URL()}/media/getMedia/${mediaId}/privi`);

  if (!data.success) {
    throw new Error("getMedia error");
  }

  const changeRate = await rateOfChange();

  return processPriviMedia(data.data, { allUsers, changeRate });
};

export const getMedia = async (mediaSymbol, chain) => {
  try {
    const response = await axios.get(`${URL()}/media/getMedia/${mediaSymbol}/${chain}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};

type ShareMediaResult =
  | {
      success: true;
    }
  | { success: false };

export const shareMedia = async ({
  toUsersIds,
  byUserId,
  mediaId,
  mediaType,
}: {
  toUsersIds: string[];
  byUserId: string;
  mediaId: string;
  mediaType: MediaType;
}): Promise<ShareMediaResult> => {
  const mediaIdSlug = mediaId.replace(/\s/g, "");

  const params = {
    Users: toUsersIds,
    MediaSymbol: mediaId,
    userId: byUserId,
    mediaType: mediaType,
  };

  const response = await axios.post(`${URL()}/media/shareMedia/${mediaIdSlug}`, params);

  return response.data;
};

export const shareMediaToSocial = async ({
  id,
  type = "Media",
  subType = "",
}: {
  id: string;
  type?: string;
  subType?: string;
}): Promise<ShareMediaResult> => {
  const idSlug = id.replace(/\s/g, "");
  const params = {
    type,
    subType,
  };

  const response = await axios.post(`${URL()}/media/shareMediaToSocial/${idSlug}`, params);

  return response.data;
};

export const processPriviMedia = (
  d: PriviMediaDTO,
  { allUsers, changeRate }: { allUsers: UserInfo[]; changeRate: Record<string, number> }
): PriviMedia => {
  const ImageUrl =
    d.Type === "DIGITAL_ART_TYPE" && d.Url
      ? `${d.Url}`
      : d.Type !== "DIGITAL_ART_TYPE" && d.Url
      ? `${d.UrlMainPhoto}`
      : undefined;

  const artistUser = allUsers.find(
    user =>
      (d.Creator && d.Creator !== "" && user.id === d.Creator) ||
      (d.CreatorId && d.CreatorId !== "" && user.id === d.CreatorId) ||
      (d.Requester && d.Requester !== "" && user.id === d.Requester)
  );

  const Artist = artistUser
    ? {
        name: artistUser.name ?? "",
        imageURL: artistUser.imageURL ?? "",
        urlSlug: artistUser.urlSlug ?? "",
        id: artistUser.id ?? "",
      }
    : undefined;

  const SavedCollabs =
    d.SavedCollabs && d.SavedCollabs.length > 0
      ? d.SavedCollabs.map(collaborator => {
          const collaboratorUser = allUsers.find(user => user.id === collaborator.id);

          return collaboratorUser
            ? {
                ...collaborator,
                name: collaboratorUser.name ?? "",
                imageURL: collaboratorUser.imageURL ?? "",
                urlSlug: collaboratorUser.urlSlug ?? "",
                id: collaboratorUser.id ?? "",
              }
            : undefined;
        }).filter(removeUndef)
      : undefined;

  let usdPrice = "";
  let price = "";

  if (d.QuickCreation && d.ViewConditions && d.ViewConditions.Price > 0 && d.ViewConditions.ViewingToken) {
    const rate = changeRate[d.ViewConditions.ViewingToken.toUpperCase()] ?? 1;
    usdPrice = `${removeAllUnnecessaryZeros((rate * d.ViewConditions.Price).toFixed(6))}${
      d.ViewConditions.ViewingType === "STREAMING" ? "/per sec" : ""
    }`;
    price = `${d.ViewConditions.ViewingToken.toUpperCase()} ${d.ViewConditions.Price}${
      d.ViewConditions.ViewingType && d.ViewConditions.ViewingType === "STREAMING" ? "/per sec" : ""
    }`;
  } else {
    if (d.Price > 0 && d.FundingToken) {
      const rate = changeRate[d.FundingToken.toUpperCase()] ?? 1;
      usdPrice = removeAllUnnecessaryZeros((rate * d.Price).toFixed(6));
      price = `${d.FundingToken.toUpperCase()}${d.Price}`;
    } else if (d.PricePerSecond > 0 && d.FundingToken) {
      const rate = changeRate[d.FundingToken.toUpperCase()] ?? 1;
      usdPrice = `${removeAllUnnecessaryZeros((rate * d.PricePerSecond).toFixed(6))}/per sec`;
      price = `${d.FundingToken.toUpperCase()} ${d.PricePerSecond}/per sec`;
    }
  }

  return {
    ...d,
    source: MediaSource.Privi,
    eth: false,
    ImageUrl,
    Artist,
    SavedCollabs,
    usdPrice,
    price,
  };
};

export const rateOfChange = async (): Promise<Record<string, number>> => {
  let rate = {} as any;

  await axios.get(`${URL()}/wallet/getCryptosRateAsMap`).then(res => {
    const resp = res.data;
    if (resp.success) {
      rate = resp.data;
    }
  });

  return rate;
};

export const createMedia = async (data): Promise<any> => {
  return await axios.post(`${URL()}/media/createMedia/v2`, data).then(successFunc).catch(failFunc);
};

export const createHashtags = async (data): Promise<any> => {
  return await axios.post(`${URL()}/media/createHashtags`, data).then(successFunc).catch(failFunc);
};

export const openNFT = async (data): Promise<any> => {
  return await axios.post(`${URL()}/media/openNFT/v2`, data).then(successFunc).catch(failFunc);
};

export const closeNFT = async (data): Promise<any> => {
  return await axios.post(`${URL()}/media/closeNFT/v2`, data).then(successFunc).catch(failFunc);
};

export const getUserMedias = async (userAdrress): Promise<any> => {
  try {
    const config = {
      params: {
        userAddress: userAdrress,
      },
    };
    const res = await axios.get(`${URL()}/media/getUserMedias`, config);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};
