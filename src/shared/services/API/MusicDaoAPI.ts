import axios from "axios";
import URL from "shared/functions/getURL";
import { getPriviWallet } from "shared/helpers/wallet";
import { signPayload } from "../WalletSign";
import { IAPIRequestProps } from "shared/types/Media";
import { IInitiatePod, IInvestPod, IBuySellPodTokens } from "shared/services/API";

// posts
export async function musicDAOInitiatePod(payload: IInitiatePod, additionalData: Object): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("initiatePod", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "initiatePod",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/musicDao/pod/initiatePod`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoFollowPod(userId: string, podAddress: string): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/musicDao/pod/followPod`, { userId, podAddress });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoUnfollowPod(userId: string, podAddress: string): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/musicDao/pod/unfollowPod`, { userId, podAddress });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoInvestPod(payload: IInvestPod, additionalData: Object): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("investPod", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "investPod",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/musicDao/pod/investPod`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoBuyPodTokens(payload: IBuySellPodTokens, additionalData: Object): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("buyPodTokens", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "buyPodTokens",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/musicDao/pod/buyPodTokens`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoSellPodTokens(
  payload: IBuySellPodTokens,
  additionalData: Object
): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload("sellPodTokens", address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: "sellPodTokens",
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
      Data: requestData,
      AdditionalData: additionalData,
    };
    const response = await axios.post(`${URL()}/musicDao/pod/sellPodTokens`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

// gets
export async function musicDaoGetTrendingPods(): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicDao/pod/getTrendingPods`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetPods(lastId: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicDao/pod/getPods?lastId=${lastId}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaogGetPodPriceHistory(podAddress: string, numPoints: number): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress,
        numPoints,
      },
    };
    const response = await axios.get(`${URL()}/musicDao/pod/getPriceHistory`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetPod(podAddress: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicDao/pod/getPod?podAddress=${podAddress}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetBuyingPodFundingTokenAmount(
  podAddress: string,
  amount: number
): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress,
        Amount: amount,
      },
    };
    const response = await axios.get(`${URL()}/musicDao/pod/getBuyingPodFundingTokenAmount`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoGetSellingPodFundingTokenAmount(
  podAddress: string,
  amount: number
): Promise<any> {
  try {
    const config = {
      params: {
        PodAddress: podAddress,
        Amount: amount,
      },
    };
    const response = await axios.get(`${URL()}/musicDao/pod/getSellingPodFundingTokenAmount`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function musicDaoFruitPod(userId: string, podAddress: string, fruitId: number): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/musicDao/pod/fruit`, { userId, podAddress, fruitId });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
