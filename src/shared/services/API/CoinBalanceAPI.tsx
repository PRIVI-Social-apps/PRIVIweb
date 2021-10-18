import axios from "axios";
import { getBlockchainNode2URL } from "shared/functions/getBlockchainURLs";

// PROVISIONAL: get streaming balance of an address
export async function getStreamingBalanceInfo(address: string): Promise<any> {
  try {
    const res = await axios.get(`${getBlockchainNode2URL()}/api/CoinBalance/getTokensOfAddress`, {
      params: { Address: address },
    });
    const resp = res.data;
    if (resp.success) {
      const output = resp.output;
      let type: string = "";
      let tokenArray: any = [];
      const tokenTypeMap = {};
      const promises: any = [];

      const listToken: string[] = [];
      for ([type, tokenArray] of Object.entries(output)) {
        tokenArray.forEach(token => {
          tokenTypeMap[token] = type;
          const config = {
            params: {
              Address: address,
              Token: token,
            },
          };
          listToken.push(token);
          promises.push(
            axios.get(`${getBlockchainNode2URL()}/api/CoinBalance/getStreamingUpdateInfo`, config)
          );
        });
      }
      const newUserBalances: any = {};
      const responses = await Promise.all(promises);
      for (let i = 0; i < responses.length; i++) {
        const token = listToken[i];
        const response: any = responses[i];
        const resp = response.data;
        const output = resp.output;
        if (output) {
          const balanceObj = {
            Token: token,
            InitialBalance: output.Balance,
            Type: tokenTypeMap[token],
            ...output,
          };
          newUserBalances[token] = balanceObj;
        }
      }
      return newUserBalances;
    }
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
