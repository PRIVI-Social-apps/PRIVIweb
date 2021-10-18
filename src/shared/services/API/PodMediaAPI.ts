import axios from "axios";
import URL from "shared/functions/getURL";
import {getWalletInfo } from "shared/helpers/wallet";
import { signPayload } from "../WalletSign";
import { IAPIRequestProps } from "shared/types/Media";

export interface IInitiatePodPodInfo {
    "TokenName": string,
    "TokenSymbol": string,
    "IsInvesting": boolean,
    "AMM": string,
    "Spread": number,
    "FundingTokenPrice": number,
    "FundingToken": string,
    "FundingDate": number,
    "FundingTarget": number,
    "InvestorDividend": number,
    "MaxSupply": number,
    "MaxPrice": number,
    "DateExpiration": number
}

export interface IInitiatePodMedias {
    "MediaName": string,
    "MediaSymbol": string,
    "Type": string,
    "ReleaseDate": number,
    "Collabs": { [key: string]: number; }
}

export interface IInitiatePod {
    "PodInfo": IInitiatePodPodInfo,
    "Medias": IInitiatePodMedias[]
}

export async function initiatePod(
  func: string,
  payload: IInitiatePod,
  additionalData: Object,
  mnemonic:string = '',
): Promise<any> {
  try {
    const { address, privateKey } = await getWalletInfo(mnemonic);
    const { signature } = await signPayload(func, address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: func,
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
        Data: requestData,
        AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/mediaPod/initiatePod_v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IRegisterMedia {
  "PodAddress": string,
  "MediaName": string,
  "MediaSymbol": string,
  "Type": string,
  "PaymentType": string,
  "Copies": number,
  "Royalty": number
  "FundingToken": string,
  "ReleaseDate": number,
  "Collabs": { [key: string]: number; },
  "PricePerSecond": number,
  "Price": number,
  "IsRecord": true,
  "RecordToken": string,
  "RecordPaymentType": string,
  "RecordPrice": number,
  "RecordPricePerSecond": number,
  "RecordCopies": number,
  "RecordRoyalty": number
}

export async function registerMedia(
  func: string,
  payload: IRegisterMedia,
  additionalData: Object,
  mnemonic:string = '',
): Promise<any> {
  try {
    const { address, privateKey } = await getWalletInfo(mnemonic);
    const { signature } = await signPayload(func, address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: func,
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
        Data: requestData,
        AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/mediaPod/registerMedia_v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IUploadMedia {
  "PodAddress": string,
  "MediaSymbol": string,
}

export async function uploadMedia(
  func: string,
  payload: IUploadMedia,
  additionalData: Object,
  mnemonic:string = '',
): Promise<any> {
  try {
    const { address, privateKey } = await getWalletInfo(mnemonic);
    const { signature } = await signPayload(func, address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: func,
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
        Data: requestData,
        AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/mediaPod/uploadMedia_v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IInvestPod {
  "Investor": string,
  "PodAddress": string,
  "Amount": number,
}

export async function investPod(
  func: string,
  payload: IInvestPod,
  additionalData: Object,
  mnemonic:string = '',
): Promise<any> {
  try {
    const { address, privateKey } = await getWalletInfo(mnemonic);
    const { signature } = await signPayload(func, address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: func,
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
        Data: requestData,
        AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/mediaPod/investPod_v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IBuySellPodTokens {
  "PodAddress": string,
  "Amount": number,
}

export async function buyPodTokens(
  func: string,
  payload: IBuySellPodTokens,
  additionalData: Object,
  mnemonic:string = '',
): Promise<any> {
  try {
    const { address, privateKey } = await getWalletInfo(mnemonic);
    const { signature } = await signPayload(func, address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: func,
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
        Data: requestData,
        AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/mediaPod/buyPodTokens_v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function sellPodTokens(
  func: string,
  payload: IBuySellPodTokens,
  additionalData: Object,
  mnemonic:string = '',
): Promise<any> {
  try {
    const { address, privateKey } = await getWalletInfo(mnemonic);
    const { signature } = await signPayload(func, address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: func,
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
        Data: requestData,
        AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/mediaPod/sellPodTokens_v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}