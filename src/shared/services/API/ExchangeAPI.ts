import axios from "axios";
import URL from "shared/functions/getURL";
import { getPriviWallet } from "shared/helpers/wallet";
import { signPayload } from "../WalletSign";
import { IAPIRequestProps } from "shared/types/Media";


export interface ICreateExchange {
    "Address": string,
    "ExchangeToken": string,
    "InitialAmount": number,
    "OfferToken": string,
    "Price": string
  }
  
  export async function createExchange(
    payload: ICreateExchange,
    additionalData: Object,
    ): Promise<any> {
      try {
        const { address, privateKey } = await getPriviWallet();
        const { signature } = await signPayload('createExchange', address, payload, privateKey);
        const requestData: IAPIRequestProps = {
          Function: 'createExchange',
          Address: address,
          Signature: signature,
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/exchange/createExchange/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export interface IPlaceOffer {
    "ExchangeId": string,
    "Address": string,
    "OfferToken": string,
    "Amount": string,
    "Price": string
  }
  
  export async function placeBuyingOffer(
    payload: IPlaceOffer,
    additionalData: Object,
    ): Promise<any> {
      try {
        const { address, privateKey } = await getPriviWallet();
        const { signature } = await signPayload('placeBuyingOffer', address, payload, privateKey);
        const requestData: IAPIRequestProps = {
          Function: 'placeBuyingOffer',
          Address: address,
          Signature: signature,
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/exchange/placeBuyingOffer/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export interface IPlaceOffer {
    "ExchangeId": string,
    "Address": string,
    "OfferToken": string,
    "Amount": string,
    "Price": string
  }
  
  export async function placeSellingOffer(
    payload: IPlaceOffer,
    additionalData: Object,
    ): Promise<any> {
      try {
        const { address, privateKey } = await getPriviWallet();
        const { signature } = await signPayload('placeSellingOffer', address, payload, privateKey);
        const requestData: IAPIRequestProps = {
          Function: 'placeSellingOffer',
          Address: address,
          Signature: signature,
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/exchange/placeSellingOffer/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export interface IBuySellFromOffer {
    "ExchangeId": string,
    "OfferId": string,
    "Address": string,
    "Amount": string
  }
  
  export async function buyFromOffer(
    payload: IBuySellFromOffer,
    additionalData: Object,
    ): Promise<any> {
      try {
        const { address, privateKey } = await getPriviWallet();
        const { signature } = await signPayload('buyFromOffer', address, payload, privateKey);
        const requestData: IAPIRequestProps = {
          Function: 'buyFromOffer',
          Address: address,
          Signature: signature,
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/exchange/buyFromOffer/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export async function sellFromOffer(
    payload: IBuySellFromOffer,
    additionalData: Object,
    ): Promise<any> {
      try {
        const { address, privateKey } = await getPriviWallet();
        const { signature } = await signPayload('sellFromOffer', address, payload, privateKey);
        const requestData: IAPIRequestProps = {
          Function: 'sellFromOffer',
          Address: address,
          Signature: signature,
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/exchange/sellFromOffer/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export interface ICancelOffer {
    "ExchangeId": string,
    "OfferId": string
  }
  
  export async function cancelBuyingOffer(
    payload: ICancelOffer,
    additionalData: Object,
    ): Promise<any> {
      try {
        const { address, privateKey } = await getPriviWallet();
        const { signature } = await signPayload('cancelBuyingOffer', address, payload, privateKey);
        const requestData: IAPIRequestProps = {
          Function: 'cancelBuyingOffer',
          Address: address,
          Signature: signature,
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/exchange/cancelBuyingOffer/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export async function cancelSellingOffer(
    payload: ICancelOffer,
    additionalData: Object,
    ): Promise<any> {
      try {
        const { address, privateKey } = await getPriviWallet();
        const { signature } = await signPayload('cancelSellingOffer', address, payload, privateKey);
        const requestData: IAPIRequestProps = {
          Function: 'cancelSellingOffer',
          Address: address,
          Signature: signature,
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/exchange/cancelSellingOffer/v2`, body);
        return response.data;
      } 
      catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export async function getExchange(
    exchangeId: string,
    ): Promise<any> {
      try {
        const response = await axios.get(`${URL()}/exchange/getExchange/${exchangeId}`);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }