/**
 * https://www.covalenthq.com/docs/api/#get-/v1/{chain_id}/address/{address}/balances_v2/
 * 
 * @param address string
 * @param chainId string
 * @returns 
 */
export const getPolygonWalletBalances = async (address: string, chainId: number) => {
  try {
    const response = await fetch(`https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`, {
      headers: {
        Authorization: "Basic Y2tleV8zYzJkMzZlZGRhYTI0Y2FmYTY0ZDRiYWEyOWI6",
      },
    });
    const json = response.json();

    return json;
  } catch (err) {
    console.log("fetching balance error: " + err.message);
  }
  return [];
};
