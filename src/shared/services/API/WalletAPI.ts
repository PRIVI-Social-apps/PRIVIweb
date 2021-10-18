import axios, { AxiosRequestConfig } from "axios";
import URL from "shared/functions/getURL";
import { successFunc, failFunc } from "shared/services/API/utils";
import { IAPIRequestProps } from "shared/services/API/interfaces";
import { getPriviWallet } from "shared/helpers/wallet";
import { signPayload } from "../WalletSign";
import { getBlockchainNode2URL } from "shared/functions/getBlockchainURLs";
import { type } from "os";

export const getUserRegisteredWallets = async () => {
  return axios
    .get(`${URL()}/wallet/getUserRegisteredWallets`)
    .then(successFunc)
    .catch(failFunc)
    .finally(() => {
      // show alert message
    });
};

export const toggleUserRegisteredWallet = async payload => {
  return axios
    .post(`${URL()}/wallet/toggleUserRegisteredWallet`, payload)
    .then(successFunc)
    .catch(failFunc)
    .finally(() => {
      // show alert message
    });
};

export const removeUserRegisteredWallet = async payload => {
  return axios
    .post(`${URL()}/wallet/removeUserRegisteredWallet`, payload)
    .then(successFunc)
    .catch(failFunc)
    .finally(() => {
      // show alert message
    });
};

export const connectPriviWallet = async payload => {
  return axios
    .post(`${URL()}/wallet/connectPriviWallet`, payload)
    .then(successFunc)
    .catch(failFunc)
    .finally(() => {
      // show alert message
    });
};

export async function getTransactions(address?: string) {
  const config = {
    params: {
      userAddress: address,
    },
  };
  return axios.get(`${URL()}/wallet/getTransactions`, config).then(successFunc).catch(failFunc);
}

export async function getTokensRateChange(): Promise<any> {
  return axios.get(`${URL()}/wallet/getTokensRateChange`).then(successFunc).catch(failFunc);
}

export async function getCryptosRateAsList(): Promise<any> {
  return axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(successFunc).catch(failFunc);
}

export async function getCryptosRateAsMap(): Promise<any> {
  return axios.get(`${URL()}/wallet/getCryptosRateAsMap`).then(successFunc).catch(failFunc);
}

export async function registerPolkadotWallet(request): Promise<any> {
  return axios.post(`${URL()}/wallet/registerPolkadotWallet`, request).then(successFunc).catch(failFunc);
}

export async function registerUserEthAccount(request): Promise<any> {
  return axios.post(`${URL()}/wallet/registerUserEthAccount`, request).then(successFunc).catch(failFunc);
}

export async function recordStartedStreaming(request): Promise<any> {
  return axios.post(`${URL()}/matic/transfer/recordStreaming`, request).then(successFunc).catch(failFunc);
}

//////////////////////////////// hlf v2 //////////////////////////////
// post
export interface ITransfer {
  Type: string;
  Token: string;
  From: string;
  To: string;
  Amount: string;
}
export async function transfer(payload: ITransfer, additionalData: Object): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("transfer", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "transfer",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/wallet/transfer/v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface ICreateStreaming {
  Type: string;
  SenderAddress: string;
  ReceiverAddress: string;
  Token: string;
  Frequency: string;
  Amount: string;
  StartingDate: string;
  EndingDate: string;
}
export async function createStreaming(payload: ICreateStreaming, additionalData: Object): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("createStreaming", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "createStreaming",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/wallet/createStreaming/v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

// get
export async function getTokenHolders(token): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/wallet/getTokenHolders/v2/${token}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getBalancesOfAddressHLF(address, bookmark, pageSize): Promise<any> {
  try {
    const config = {
      params: {
        Address: address,
        Bookmark: bookmark,
        PageSize: pageSize,
        Caller: "PRIVI",
      },
    };
    const response = await axios.get(getBlockchainNode2URL() + "/api/Coinb/getBalancesOfAddress", config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getTokenOfAddressByTypeHLF(address, tokenType, bookmark, pageSize): Promise<any> {
  try {
    const config: AxiosRequestConfig = {
      method: "get",
      headers: { "Content-Type": "application/json" },
      url: getBlockchainNode2URL() + "/api/Coinb/getBalancesOfAddress",
      data: JSON.stringify({
        Address: address,
        TokenType: tokenType,
        Bookmark: bookmark,
        PageSize: pageSize,
        Caller: "PRIVI",
      }),
    };
    const response = await axios.get(getBlockchainNode2URL() + "/api/Coinb/getTokenOfAddressByType", config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

// getter for a list of token types
export async function getTokenOfAddressByTypesHLF(address, tokenTypes, bookmark, pageSize): Promise<any> {
  try {
    const promises: any[] = [];
    tokenTypes.forEach(tokenType => {
      const config = {
        params: {
          Address: address,
          TokenType: tokenType,
          Bookmark: bookmark,
          PageSize: pageSize,
          Caller: "PRIVI",
        },
      };
      promises.push(axios.get(getBlockchainNode2URL() + "/api/Coinb/getTokenOfAddressByType", config));
    });
    const responses = await Promise.all(promises);
    return responses.map(resp => resp.data);
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getBalanceHLF(address, token): Promise<any> {
  try {
    const config = {
      params: {
        Address: address,
        Token: token,
        Caller: "PRIVI",
      },
    };
    const response = await axios.get(getBlockchainNode2URL() + "/api/Coinb/getBalance", config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

// getter for a list of tokens
export async function getBalancesHLF(address, tokens): Promise<any> {
  try {
    const promises: any[] = [];
    tokens.forEach(token => {
      const config = {
        params: {
          Address: address,
          Token: token,
          Caller: "PRIVI",
        },
      };
      promises.push(axios.get(getBlockchainNode2URL() + "/api/Coinb/getBalance", config));
    });
    const responses = await Promise.all(promises);
    return responses.map(resp => resp.data);
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getAddressStreamingsHLF(address, token): Promise<any> {
  try {
    const config = {
      params: {
        Address: address,
        Token: token,
        Caller: "PRIVI",
      },
    };
    const response = await axios.get(getBlockchainNode2URL() + "/api/Coinb/getAddressStreamings", config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

// getter for a list of tokens
export async function getAddressStreamingsOfTokensHLF(address, tokens): Promise<any> {
  try {
    const promises: any[] = [];
    tokens.forEach(token => {
      const config = {
        params: {
          Address: address,
          Token: token,
          Caller: "PRIVI",
        },
      };
      promises.push(axios.get(getBlockchainNode2URL() + "/api/Coinb/getAddressStreamings", config));
    });
    const responses = await Promise.all(promises);
    return responses.map(resp => resp.data);
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getStreamingInfoHLF(id): Promise<any> {
  try {
    const config = {
      params: {
        Id: id,
        Caller: "PRIVI",
      },
    };
    const response = await axios.get(getBlockchainNode2URL() + "/api/Coinb/getStreamingInfo", config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getLastTxid(address: string): Promise<any> {
  return (
    axios
      // .get(`${URL()}/wallet/getLastTxid/v2`, { params: { address } })
      .get("http://159.65.123.98:4000/api/CoinBalance/getTxid", { params: { Address: address } })
      .then(res => {
        if (res.data && res.data.success) return res.data.output;
        throw new Error((res.data && res.data.message) || "API request error");
      })
      .catch(failFunc)
  );
}
// getter for a list of ids
export async function getStreamingsInfoHLF(ids): Promise<any> {
  try {
    const promises: any[] = [];
    ids.forEach(id => {
      const config = {
        params: {
          Id: id,
          Caller: "PRIVI",
        },
      };
      promises.push(axios.get(getBlockchainNode2URL() + "/api/Coinb/getStreamingInfo", config));
    });
    const responses = await Promise.all(promises);
    return responses.map(resp => resp.data);
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
