import axios from "axios";
import URL from "shared/functions/getURL";
import { getPriviWallet } from "shared/helpers/wallet";
import { signPayload } from "../WalletSign";
import { IAPIRequestProps } from "shared/types/Media";


export interface ICreateAuction {
    "MediaSymbol": string,
    "TokenSymbol": string,
    "Owner": string,
    "BidIncrement": string,
    "StartTime": number,
    "EndTime": number,
    "ReservePrice": string,
    "IpfHash": string
  }
  
  export async function createAuction(
    payload: ICreateAuction,
    additionalData: Object,
    ): Promise<any> {
      try {
        const { address, privateKey } = await getPriviWallet();
        const { signature } = await signPayload('createAuction', address, payload, privateKey);
        const requestData: IAPIRequestProps = {
          Function: 'createAuction',
          Address: address,
          Signature: signature,
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/auction/createAuction/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export interface IPlaceBid {
    "MediaSymbol": string,
    "TokenSymbol": string,
    "Owner": string,
    "Address": string,
    "Amount": string
  }
  
  export async function placeBid(
    payload: IPlaceBid,
    additionalData: Object,
    ): Promise<any> {
      try {
        const { address, privateKey } = await getPriviWallet();
        const { signature } = await signPayload('placeBid', address, payload, privateKey);
        const requestData: IAPIRequestProps = {
          Function: 'placeBid',
          Address: address,
          Signature: signature,
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/auction/placeBid/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export interface ICancelAuction {
    "MediaSymbol": string,
    "TokenSymbol": string,
    "Owner": string,
  }
  
  export async function cancelAuction(
    payload: ICancelAuction,
    additionalData: Object,
    ): Promise<any> {
      try {
        const { address, privateKey } = await getPriviWallet();
        const { signature } = await signPayload('cancelAuction', address, payload, privateKey);
        const requestData: IAPIRequestProps = {
          Function: 'cancelAuction',
          Address: address,
          Signature: signature,
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/auction/cancelAuction/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export interface IWithdrawAuction {
    "MediaSymbol": string,
    "TokenSymbol": string,
    "Owner": string,
  }
  
  export async function withdrawAuction(
    payload: IWithdrawAuction,
    additionalData: Object,
    ): Promise<any> {
      try {
        const { address, privateKey } = await getPriviWallet();
        const { signature } = await signPayload('withdrawAuction', address, payload, privateKey);
        const requestData: IAPIRequestProps = {
          Function: 'withdrawAuction',
          Address: address,
          Signature: signature,
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/auction/withdrawAuction/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export interface IResetAuction {
    "MediaSymbol": string,
    "TokenSymbol": string,
    "Owner": string,
    "BidIncrement": string,
    "EndTime": number,
    "ReservePrice": string,
    "IpfHash": string
  }
  
  export async function resetAuction(
    payload: IWithdrawAuction,
    additionalData: Object,
    ): Promise<any> {
      try {
        const { address, privateKey } = await getPriviWallet();
        const { signature } = await signPayload('resetAuction', address, payload, privateKey);
        const requestData: IAPIRequestProps = {
          Function: 'resetAuction',
          Address: address,
          Signature: signature,
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/auction/resetAuction/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }