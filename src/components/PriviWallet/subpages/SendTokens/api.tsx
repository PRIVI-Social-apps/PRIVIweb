import React from "react";
import { OptionsObject, SnackbarKey } from "notistack";
import Web3 from "web3";
import SocialTokenMock from "shared/contracts/PriviStreaming/SocialTokenMock.json";
import { ContractInstance } from "shared/connectors/polygon/functions";
import config from "shared/connectors/polygon/config";
import BN from "bn.js";

type StreamTokenPayload = {
  to: string;
  amount: BN;
  token: string;
  startSec: number;
  endSec: number;
};

type TransferTokenPayload = {
  to: string;
  amount: BN;
  token: string;
};

export const transferPolygonToken = (
  web3: Web3,
  account: string,
  payload: TransferTokenPayload,
  message?: (m: string | React.ReactNode, o?: OptionsObject) => SnackbarKey
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { to, amount, token } = payload;
      const contractAddress = config.CONTRACT_ADDRESSES[token];

      if (!contractAddress) {
        if (message) {
          message("Unregistered token", { variant: "error" });
        }
        reject({ success: false, error: "Unregistered token" });
        return;
      }

      const contract = ContractInstance(web3, SocialTokenMock.abi, contractAddress);
      const gas = await contract.methods.transfer(to, amount).estimateGas({ from: account });

      await contract.methods
        .transfer(to, amount)
        .send({ from: account, gas })
        .on("receipt", receipt => {
          if (message) {
            message("Transaction successful", { variant: "success" });
          }
        })
        .on("transactionHash", hash => {
          if (message) {
            message(
              <>
                <span>Transaction started</span>&nbsp;
                <a href={`https://explorer-mumbai.maticvigil.com/tx/${hash}`} target="_blank">
                  {hash}
                </a>
              </>,
              { variant: "info" }
            );
          }
        })
        .on("error", error => {
          console.log("error", error);
          if (message) {
            message("Transaction failed", { variant: "error" });
          }
        });

      resolve({ success: true });
    } catch (err) {
      reject({ success: false, error: err });
    }
  });
};

export const streamPolygonToken = (
  web3: Web3,
  account: string,
  payload: StreamTokenPayload,
  saveStreaming: (data: any) => unknown,
  message?: (m: string | React.ReactNode, o?: OptionsObject) => SnackbarKey
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { to, amount, token, startSec, endSec } = payload;
      const contractAddress = config.CONTRACT_ADDRESSES[token];

      if (!contractAddress) {
        if (message) {
          message("Unregistered token", { variant: "error" });
        }
        reject({ success: false, error: "Unregistered token" });
        return;
      }

      const contract = ContractInstance(web3, SocialTokenMock.abi, contractAddress);

      // TODO: Handle exception when endSec is behind the startSec
      const frequency = amount.div(web3.utils.toBN((endSec - startSec).toString()));

      const methodPayload = {
        stype: "classic",
        senderAddress: account,
        receiverAddress: to,
        amountPerSecond: frequency.toString(10),
        startingDate: startSec,
        endingDate: endSec,
      };

      // Contract: https://github.com/Privi-Protocol/Privi-Polygon/blob/master/privi-streaming/test/erc20streamable.test.js#L50

      const gas = await contract.methods.createStreaming(methodPayload).estimateGas({ from: account });

      await contract.events.StreamingCreated().on("data", event => {
        const { from, to, id, endingDate } = event.returnValues;

        saveStreaming({
          from,
          to,
          streamId: Number(id),
          startDate: Number(startSec),
          endDate: Number(endingDate),
          contractAddress,
          amountPerSecond: frequency.toString(10),
        });
        if (message) {
          message(`Streaming ${id} started`, { variant: "info" });
        }
      });

      await contract.methods
        .createStreaming(methodPayload)
        .send({ from: account, gas })
        .on("receipt", receipt => {
          if (message) {
            message("Transaction successful", { variant: "success" });
          }
        })
        .on("transactionHash", hash => {
          if (message) {
            message(
              <>
                <span>Transaction started</span>&nbsp;
                <a href={`https://explorer-mumbai.maticvigil.com/tx/${hash}`} target="_blank">
                  {hash}
                </a>
              </>,
              { variant: "info" }
            );
          }
        })
        .on("error", error => {
          if (message) {
            message("Transaction failed", { variant: "error" });
          }
        });

      resolve({ success: true });
    } catch (err) {
      console.log("streamPolygonToken", err);
      reject({ success: false, error: err });
    }
  });
};

export const stopStreamPolygonToken = (
  web3: Web3,
  payload: any,
  message?: (m: string | React.ReactNode, o?: OptionsObject) => SnackbarKey
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { streamId, token, account } = payload;
      const contractAddress = config.CONTRACT_ADDRESSES[token];

      if (!contractAddress) {
        if (message) {
          message("Unregistered token", { variant: "error" });
        }
        reject({ success: false, error: "Unregistered token" });
        return;
      }

      const contract = ContractInstance(web3, SocialTokenMock.abi, contractAddress);
      const gas = await contract.methods.stopStreaming(streamId).estimateGas({ from: account });

      await contract.events.StreamingStopped().on("data", event => {
        const { from, to } = event.returnValues;
        if (message) {
          message(`Streaming ${streamId} stopped`, { variant: "info" });
        }
      });

      await contract.methods
        .stopStreaming(streamId)
        .send({ from: account, gas })
        .on("receipt", receipt => {
          if (message) {
            message("Transaction successful", { variant: "success" });
          }
        })
        .on("transactionHash", hash => {
          if (message) {
            message(
              <>
                <span>Transaction started</span>&nbsp;
                <a href={`https://explorer-mumbai.maticvigil.com/tx/${hash}`} target="_blank">
                  {hash}
                </a>
              </>,
              { variant: "info" }
            );
          }
        })
        .on("error", error => {
          console.log("error", error);
          if (message) {
            message("Transaction failed", { variant: "error" });
          }
        });

      resolve({ success: true });
    } catch (err) {
      console.log("stopStreamPolygonToken", err);
      reject({ success: false, error: err });
    }
  });
};
