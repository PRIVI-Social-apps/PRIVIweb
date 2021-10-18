import { Box, Grid, CircularProgress } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Web3 from "web3";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { swapPageStyles } from "./index.styles";
import URL from "shared/functions/getURL";
import { Color, PrimaryButton, SecondaryButton, StyledDivider } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { signTransaction } from "shared/functions/signTransaction";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { ReactComponent as SwapIcon } from "assets/icons/wallet_white.svg";
import { ReactComponent as EditAddressIcon } from "assets/icons/edit_icon.svg";
import { ReactComponent as CopyIcon } from "assets/icons/copy-regular.svg";
import { BlockchainNets } from "shared/constants/constants";
import { SupportedNetworkCoin } from "shared/connectors/bridge/classes/supportedNetwork";
import { useTypedSelector } from "store/reducers/Reducer";
import { waitTransaction } from "shared/connectors/bridge/classes/transactionStatus";
import { setEthAccount } from "store/actions/User";
import SwapHistory from "components/PriviWallet/components/SwapHistory";
import AtomicSwapAbs from "shared/contracts/AtomicSwapERC20.json";
import swapManager from "shared/contracts/ABI_V5/SwapManager.json";
import ERC20ABI from "shared/contracts/ERC20ABI.json";
import IERC20ContractJson from "shared/contracts/ABI_V5/IERC20.json";
import IERC721ContractJson from "shared/contracts/ABI_V5/PRIVIPodERC721Token.json";
import UpdateBalance from "shared/connectors/bridge/classes/UpdateBalance";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import atomicSwapAbs from "shared/contracts/AtomicSwapERC20.json";
import fakeDAIAbs from "shared/contracts/FakeDAI.json";
import { LoadingWrapper } from "shared/ui-kit/Hocs/LoadingWrapper";
import { PRIVI_ETH_ACCOUNT } from "shared/constants/constants";
import AssetModal from "components/PriviWallet/components/Modals/AssetModal";
import { NetworkTokenSelect } from "components/PriviWallet/components/NetworkSelect";

function getUnixEpochTimeStamp(value) {
  return Math.floor(value.getTime() / 1000);
}

const basicBalanceList = [
  { id: 0, name: "Ethereum", symbol: "ETH", amount: 0, address: "0x" },
  { id: 0, name: "Dai Token", symbol: "DAI", amount: 0, address: "0x" },
  { id: 0, name: "USD Tether", symbol: "USDT", amount: 0, address: "0x" },
];

const Action = {
  SWAP_TRANSFER_ETH: "SWAP_TRANSFER_ETH",
  SWAP_TRANSFER_ERC20: "SWAP_TRANSFER_ERC20",
  SWAP_APPROVE_ERC20: "SWAP_APPROVE_ERC20",
  WITHDRAW_ETH: "WITHDRAW_ETH",
  WITHDRAW_ERC20: "WITHDRAW_ERC20",
  SWAP_APPROVE_ERC721: "SWAP_APPROVE_ERC721",
  SWAP_TRANSFER_ERC721: "SWAP_TRANSFER_ERC721",
  WITHDRAW_ERC721: "WITHDRAW_ERC721",
};

declare let window: any;

export default function SwapPage() {
  const classes = swapPageStyles();
  const user = useTypedSelector(state => state.user);

  const { showAlertMessage } = useAlertMessage();

  const [tokenList, setTokenList] = useState<any[]>(basicBalanceList);
  const [token, setToken] = useState<string>("USDT");
  const [amount, setAmount] = useState<any>();
  const [chainId, setChainId] = useState<any>(undefined);

  const [originNetwork, setOriginNetwork] = useState<any>(BlockchainNets[0]);
  const [targetNetwork, setTargetNetwork] = useState<any>(BlockchainNets[2]);
  const [originWallet, setOriginWallet] = useState<any>({ balance: 0 });
  const [targetWallet, setTargetWallet] = useState<any>();
  const [isAllowanceRequired, setIsAllowanceRequired] = React.useState<boolean>(false);
  const [isApproved, setIsApproved] = React.useState<boolean>(false);
  const [allowanceAmount, setAllowanceAmount] = React.useState<Number>(0);
  const [isApprovedLoading, setIsApprovedLoading] = React.useState<boolean>(false);
  const [status, setStatusBase] = React.useState<any>(0);
  const [isHandlingTransfer, setIsHandlingTransfer] = useState<boolean>(false);
  const [recentSwaps, setRecentSwaps] = React.useState<any>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [web3, setWeb3] = useState<any>(undefined);
  const [ethProposalId, setEthProposalId] = useState<any>();
  const [secret, setSecret] = useState<any>();
  const [contractHash, setContractHash] = useState<any>();

  const [openAssetModal, setOpenAssetModal] = useState<boolean>(false);

  const [isDirect, setIsDirect] = useState<boolean>(true);
  const [page, setPage] = useState(1);

  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const dispatch = useDispatch();
  const updateBalance = new UpdateBalance();

  useEffect(() => {
    if (user.address) {
      updateBalance.retrieveFabricBalance();
    }
  }, []);

  useEffect(() => {
    if (typeof user.ethBalance !== "undefined" && user.ethBalance !== null) {
      setTokenList(user.ethBalance);
    }
  }, [user.ethBalance]);

  useEffect(() => {
    if (typeof user.fabBalance !== "undefined" && user.fabBalance !== null) {
      setTokenList(user.fabBalance);
    }
  }, [user.fabBalance]);

  useEffect(() => {
    handleAmountChange(amount);
  }, [token]);

  useEffect(() => {
    getRecentSwaps();
  }, []);

  useEffect(() => {
    if (originNetwork.name === "ETH") {
      setTargetNetwork(BlockchainNets[0]);
      let ethToken = user && user.ethBalance.find(eth => eth.symbol === token);
      if (user.ethAccount) {
        setOriginWallet({ address: user.ethAccount, balance: ethToken && ethToken.amount });
      } else {
        setOriginWallet({ ...originWallet, address: "" });
      }
    } else if (originNetwork.name === "SUBSTRATE") {
      setTargetNetwork(BlockchainNets[2]);
      let fabToken = user && user.fabBalance.find(eth => eth.symbol === token);
      if (user.address) {
        setOriginWallet({ balance: fabToken && fabToken.amount, address: user.address });
      }
    }
    if (targetNetwork.name === "ETH") {
      if (user.ethAccount) {
        setTargetWallet({ ...targetWallet, address: user.ethAccount });
      } else {
        setTargetWallet({ ...targetWallet, address: "" });
      }
    }
    if (targetNetwork.name === "SUBSTRATE") {
      if (user.address) {
        setTargetWallet({ ...targetWallet, address: user.address });
      }
    }
  }, [token, originNetwork, targetNetwork]);

  useEffect(() => {
    if (typeof web3 !== "undefined" && typeof user.ethAccount !== undefined && user.ethAccount !== "") {
      const load = async () => {
        try {
          const chainId = await web3.eth.net.getId();
          setChainId(chainId);
          updateBalance.updateAccount(web3, user.ethAccount);
        } catch (error) {
          showAlertMessage(error.message || "Ethereum network connection failed");
        }
      };
      load();
    }
  }, [web3, user.ethAccount]);

  useEffect(() => {
    if (status === 1 || status === 2) setPage(2);
    if (status === 3) setPage(3);
    if (status === 4) setPage(4);
  }, [status]);

  const handleOpenAssetModal = () => {
    setOpenAssetModal(true);
  };
  const handleCloseAssetModal = () => {
    setOpenAssetModal(false);
  };

  const updateBalances = () => {
    if (user.address.includes("0x") && (typeof web3 !== "undefined" || web3 !== null)) {
      updateBalance.updateAccount(web3, user.ethAccount);
    }
  };

  const showAmount = (amnt: number): number => {
    return Math.round(amnt * 100000) / 100000;
  };

  const getRecentSwaps = async () => {
    setIsDataLoading(true);
    axios
      .get(`${URL()}/ethereum/getRecentSwaps?userId=${user.id}&userAddress=${user.address}`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          let data = resp.data;
          setRecentSwaps(data);
          updateBalances();
        }
        setIsDataLoading(false);
      })
      .catch(() => {
        setIsDataLoading(false);
      });
  };

  async function getTokenAllowance(tokenAddress) {
    try {
      const chainId = await web3.eth.net.getId();
      const fromAccount = originWallet && originWallet.address;
      const swapManagerAddress = swapManager.networks[String(chainId)]["address"];
      const contract = new web3.eth.Contract(IERC20ContractJson.abi, tokenAddress);

      const allowanceRes = await contract.methods
        .allowance(fromAccount, swapManagerAddress)
        .call({ from: fromAccount });
      const allawanceAmountInEth = Number(await web3.utils.fromWei(allowanceRes, "ether"));
      setAllowanceAmount(allawanceAmountInEth);
    } catch (e) {
      showAlertMessage(e.meesage || "Allowance error", { variant: "error" });
    }
  }

  const handleSwap = () => {
    setOriginNetwork(targetNetwork);
    setTargetNetwork(originNetwork);
    setOriginWallet(targetWallet);
    setTargetWallet(originWallet);
  };

  const handleAmountChange = amount => {
    const amountEth = user.ethBalance.find(e => e.symbol === token)?.amount || 0;
    const amountFab = user.fabBalance.find(e => e.symbol === token)?.amount || 0;
    if (isAllowanceRequired) {
      if (Number(amount) <= allowanceAmount) {
        setIsApproved(true);
      } else {
        setIsApproved(false);
      }
    } else {
      setIsApproved(true);
    }
    setAmount(amount);
  };

  const handleChangeToken = value => {
    setToken(value);
    const selectedTokenObj = tokenList.find(e => e.symbol === value);
    if (originNetwork.name === "ETH") {
      //console.log(SupportedNetworkCoin[chainId].symbol);
      if (SupportedNetworkCoin[chainId] && value !== SupportedNetworkCoin[chainId].symbol) {
        setIsAllowanceRequired(true);
        const tokenAddress = user.ethBalance.find(e => e.symbol === value)?.address || null;
        getTokenAllowance(tokenAddress);
      } else {
        setIsAllowanceRequired(false);
        setIsApproved(true);
      }
    }
  };

  const handleOriginWalletConnect = () => {
    if (originNetwork.name === "ETH") connectMetaMask(setOriginWallet);
    else if (originNetwork.name === "PRIVI") connectPriviWallet(setOriginWallet);
    else if (originNetwork.name === "SUBSTRATE") connectPriviWallet(setOriginWallet);
  };

  const handleTargetWalletConnect = () => {
    if (targetNetwork.name === "ETH") connectMetaMask(setTargetWallet);
    else if (originNetwork.name === "PRIVI") connectPriviWallet(setTargetWallet);
    else if (targetNetwork.name === "SUBSTRATE") connectPriviWallet(setTargetWallet);
  };

  const connectMetaMask = async setWallet => {
    let account = "";
    try {
      let web3: any;
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" }).then(newAccounts => {
          dispatch(setEthAccount(newAccounts[0], "injected"));
          account = newAccounts[0];
        });
      } else if (web3) {
        web3 = new Web3(window.ethereum);
      } else {
        window.alert("Non-Ethereum browser detected. Please install MetaMask extension in your browser");
        return;
      }

      // Save web3 in state
      await web3.eth.getChainId().then(id => {
        //console.log({ id });
        setChainId(id);
      });

      setWeb3(web3);

      // Update account balance
      updateBalance.updateAccount(web3, account);

      // Listen for account change in Ethereum browser
      window.ethereum.on("accountsChanged", (addr: string) => {
        if (addr.length > 0) {
          dispatch(setEthAccount(addr[0], "injected"));
          updateBalance.updateAccount(web3, addr[0]);
          // updateTask(user.id, "Connect Metamask wallet");
        } else {
          // User disconnects from the PRIVI web in Metamask
          updateBalance.removeAccount();
        }
      });

      // Listen for chain change in Ethereum browser
      window.ethereum.on("chainChanged", async (chainId: string) => {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" }).then(newAccounts => {
          dispatch(setEthAccount(newAccounts[0], "injected"));
          account = newAccounts[0];
        });
        setWeb3(web3);
        setChainId(chainId);
        updateBalance.updateAccount(web3, account);
      });
      setWallet({ address: account });

      // register user eth address in db
    } catch (err) {
      console.log("Error in Connect.tsx -> handleConnect(): ", err);
      showAlertMessage(err.message || "Error in Connect.tsx");
    }
  };

  const connectPriviWallet = setWallet => {
    setWallet({ address: user.address });
  };

  const canSwap = () => {
    if (amount <= 0) {
      showAlertMessage("Amount not available!", { variant: "error" });
      return false;
    }
    return true;
  };

  const initiateDirectSwap = async () => {
    const tokenName = user.ethBalance.find(e => e.symbol === token)?.symbol || "UNKNOWN";

    if (originNetwork.name === "ETH") {
      if (tokenName === SupportedNetworkCoin[chainId].symbol) {
        await Swap(Action.SWAP_TRANSFER_ETH, originWallet.address, tokenName, chainId, amount, user.id);
      } else if (!isApproved) {
        await Swap(Action.SWAP_APPROVE_ERC20, originWallet.address, tokenName, chainId, amount, user.id);
      } else {
        if (tokenName === SupportedNetworkCoin[chainId].symbol) {
          await Withdraw(
            Action.WITHDRAW_ETH,
            targetWallet.address, // suposed to be eth address
            tokenName,
            chainId,
            amount,
            user.id,
            originWallet.address
          );
        } else {
          await Withdraw(
            Action.WITHDRAW_ERC20,
            targetWallet.address,
            tokenName,
            chainId,
            amount,
            user.id,
            originWallet.address
          );
        }
      }
    } else {
      if (originNetwork.name === BlockchainNets[0].name) {
        fromPriviToEth();
      } else {
        fromEthToPrivi();
      }
    }
  };

  const fromEthToPrivi = async () => {
    let tokenAddress = user.ethBalance.find(e => e.symbol === token)?.address || "UNKNOWN";
    const tokenName = user.ethBalance.find(e => e.symbol === token)?.symbol || "UNKNOWN";
    // const priviEthAccount = process.env.PRIVI_ETH_ACCOUNT
    const priviEthAccount = "0x7d994063E2C98b2F49b13418Fc3FE58c45DdcC0D";
    const erc20 = new web3.eth.Contract(ERC20ABI, tokenAddress);
    const atomicSwapERC20 = new web3.eth.Contract(AtomicSwapAbs.abi, AtomicSwapAbs.networks[chainId].address);
    const amountToSwap = web3.utils.toWei(String(amount), "ether");
    // const amountToSwap = Number(amount);
    //console.log({ amountToSwap });
    let tx;
    if (tokenName !== SupportedNetworkCoin[chainId].symbol) {
      try {
        tx = await erc20.methods
          .approve(AtomicSwapAbs.networks[chainId].address, amountToSwap)
          .send({ from: originWallet.address });
      } catch (err) {
        throw new Error(err);
      }

      if (Object.keys(tx.events).length === 0) {
        throw new Error("Approve didn't work");
      }

      //console.log("Approval done");
    }
    const htlcId = web3.utils.randomHex(32);
    const secret = web3.utils.randomHex(32);
    const secretHashed = Web3.utils.soliditySha3(secret);
    let date = new Date();
    date.setSeconds(date.getSeconds() + 600);
    const endOfHTLC = getUnixEpochTimeStamp(date);
    /*console.log({
      htlcId,
      amountToSwap,
      tokenAddress,
      priviEthAccount,
      secretHashed,
      endOfHTLC,
    });*/
    try {
      setStatusBase(1);
      const gas = await atomicSwapERC20.methods
        .createProposal(htlcId, amountToSwap, tokenAddress, priviEthAccount, secretHashed, endOfHTLC)
        .estimateGas({ from: originWallet.address });
      //console.log({ gas });
      tx = await atomicSwapERC20.methods
        .createProposal(htlcId, amountToSwap, tokenAddress, priviEthAccount, secretHashed, endOfHTLC)
        .send({ from: originWallet.address, gas });
    } catch (err) {
      throw new Error(err);
    }

    if (Object.keys(tx.events).length === 0) {
      throw new Error("CreateProposal didn't work");
    }

    setStatusBase(2);
  };

  const fromPriviToEth = async () => {
    try {
      const tokenToSwapSymbol = user.ethBalance.find(e => e.symbol === token)?.symbol || "UNKNOWN";
      let temp_secret = web3.utils.randomHex(32);
      setSecret(temp_secret);
      const secretHashed = Web3.utils.soliditySha3(temp_secret);
      const sigBody = {
        UserAddress: user.id,
        Token: tokenToSwapSymbol,
        Amount: amount,
      };
      const [hash, signature] = await signTransaction(user.mnemonic, sigBody);
      let date = new Date();
      date.setSeconds(date.getSeconds() + 600);
      const endOfHTLC = getUnixEpochTimeStamp(date);
      let res;
      try {
        setStatusBase(1);
        res = await axios.post("http://159.65.123.98:4000/api/HTLC/initialiseHTLC", {
          Data: {
            Function: "initialiseHTLC",
            Address: user.address,
            Signature: signature,
            Payload: {
              From: originWallet.address,
              To: "",
              Token: tokenToSwapSymbol,
              Amount: amount,
              TimeLock: endOfHTLC,
              SecretHash: secretHashed,
            },
          },
          Caller: "PRIVI",
        });
      } catch (err) {
        throw new Error(err);
      }
      if (!res.data.success) {
        throw new Error("Proposal creation on Privi failed");
      }
      setStatusBase(2);
      const priviContractId = res.data.hash;
      let priviProposal;
      try {
        priviProposal = await axios.post("http://localhost:3000/ethereum/launchPriviEthSwap", {
          priviProposalId: priviContractId,
          userAccountOnEth: targetWallet.address,
        });
        setEthProposalId(priviProposal.data);
        setStatusBase(3);
      } catch (err) {
        throw new Error(err);
      }
    } catch (e) {
      showAlertMessage(e.message || "Error", { variant: "error" });
    }
  };

  const onClaim = async () => {
    try {
      let claimRequest;
      claimRequest = await axios.post("http://159.65.123.98:4000/api/HTLC/claimFunds", {
        Data: {
          Function: "claimFunds",
          Address: "",
          Signature: "",
          Payload: {
            Address: targetWallet.address,
            ContractHash: contractHash,
            Secret: secret,
          },
        },
        Caller: "PRIVI",
      });
      if (!claimRequest.data.success) {
        throw new Error("Couldn't withdraw funds on Privi");
      }
      showAlertMessage("ClaimFunds succeed!", { variant: "success" });
      setPage(4);
    } catch (e) {
      showAlertMessage(e.message || "claimFunds error", { variant: "error" });
    }
  };

  const initiateSecureSwap = async () => {};

  const Swap = async (
    action: string,
    fromAccount: string,
    tokenName: string,
    chainId: string,
    amount: string,
    id: string
  ) => {
    // set loading
    setIsHandlingTransfer(true);

    const swapManagerAddress = swapManager.networks[String(chainId)]["address"];

    // Destination account: Original ERC20 contract if approving transfer / SwapManager otherwise
    let toAccount;
    if (
      action === Action.SWAP_TRANSFER_ERC20 ||
      action === Action.SWAP_TRANSFER_ERC721 ||
      action === Action.SWAP_TRANSFER_ETH
    ) {
      toAccount = swapManagerAddress;
    } else if (action === Action.SWAP_APPROVE_ERC20 || action === Action.SWAP_APPROVE_ERC721) {
      const tokenAddress = user.ethBalance.find(e => e.symbol === tokenName)?.address || "0x";
      toAccount = tokenAddress;
    } else {
      toAccount = "0x";
    }

    // Amount conversion or erc721 id
    let value: any = undefined;
    value = web3.utils.toHex(web3.utils.toWei(amount, "ether"));
    // If ERC20 contract is not ready, exit swap
    if (toAccount === "0x") {
      setIsHandlingTransfer(false);
      return;
    }

    // Get SwapManager contract code
    const SwapManagerontract = new web3.eth.Contract(swapManager.abi, swapManagerAddress);

    // Contract code: Original ERC20 contract if approving transfer / SwapManager otherwise
    const contract =
      action === Action.SWAP_APPROVE_ERC20
        ? new web3.eth.Contract(IERC20ContractJson.abi, toAccount)
        : action === Action.SWAP_APPROVE_ERC721
        ? new web3.eth.Contract(IERC721ContractJson.abi, toAccount)
        : SwapManagerontract;

    // Smart contract function
    let encodedData;
    switch (action) {
      case Action.SWAP_APPROVE_ERC721:
        encodedData = contract.methods.approve(swapManagerAddress, value).encodeABI();
        break;
      case Action.SWAP_TRANSFER_ERC721:
        encodedData = contract.methods.depositERC721Token(tokenName, value).encodeABI();
        break;
      case Action.SWAP_APPROVE_ERC20:
        encodedData = contract.methods.approve(swapManagerAddress, value).encodeABI();
        break;
      case Action.SWAP_TRANSFER_ERC20:
        encodedData = contract.methods.depositERC20Token(tokenName, value).encodeABI();
        break;
      case Action.SWAP_TRANSFER_ETH:
        encodedData = contract.methods.depositEther().encodeABI();
        break;
      default:
        encodedData = null;
        break;
    }

    // Transaction parameters
    const txParams = {
      from: fromAccount,
      to: toAccount,
      data: encodedData,
      value: action === Action.SWAP_TRANSFER_ETH ? value : 0,
      chainId: chainId,
    };

    // Transaction execution in Ethereum (Swap only)
    await window.ethereum
      .request({
        method: "eth_sendTransaction",
        params: [txParams],
      })
      .then(async (tx: string) => {
        if (action === Action.SWAP_APPROVE_ERC20 || action === Action.SWAP_APPROVE_ERC721) {
          setIsApprovedLoading(true);
          const waitRes = await waitTransaction(web3, tx, {
            interval: 1000,
            blocksToWait: 1,
          });
          setIsApproved(true);
          setIsApprovedLoading(false);
        }
        updateBalances();

        const txMessage = () => {
          switch (action) {
            case Action.SWAP_TRANSFER_ETH:
              return `Swap ${amount} ${SupportedNetworkCoin[chainId].symbol}`;
            case Action.SWAP_APPROVE_ERC721:
              return `Approve ${amount} ${tokenName}`;
            case Action.SWAP_TRANSFER_ERC721:
              return `Swap ${amount} ${tokenName}`;
            case Action.SWAP_APPROVE_ERC20:
              return `Approve ${amount} ${tokenName}`;
            case Action.SWAP_TRANSFER_ERC20:
              return `Swap ${amount} ${tokenName}`;
            default:
              return `Unrecognized option`;
          }
        };

        // Build tx fields to be shown in front-end
        const newTx = {
          txHash: tx,
          random: "0",
          action: action,
          token: tokenName,
          amount: amount,
          description: txMessage(),
        };

        const params = {
          publicId: id,
          // from: user.ethAccount,
          userAddress: user.address, // new param
          from: fromAccount,
          to: toAccount,
          txHash: tx,
          random: 0,
          chainId: chainId,
          action: action,
          token: tokenName,
          amount: parseFloat(amount),
          description: txMessage(),
          status: "pending",
          lastUpdate: new Date().getTime() / 1000,
        };

        //console.log({ params });

        // Swap in Fabric
        await axios
          .post(`${URL()}/ethereum/send`, params)
          .then(res => {
            getRecentSwaps();
            setIsHandlingTransfer(false);
          })
          .catch(err => {
            setStatusBase({
              msg: "Error while swaping with PRIVI blockchain",
              key: Math.random(),
              variant: "error",
            });
          });
      })
      .catch(err => {
        console.log("Error in Swap->swapEthereum(): ", err);
        setIsHandlingTransfer(false);
      });
  };

  const Withdraw = async (
    action: string,
    toAccount: string,
    tokenName: string,
    chainId: string,
    amount: string,
    id: string,
    address: string
  ) => {
    // set loading
    setIsHandlingTransfer(true);

    const swapManagerAddress = swapManager.networks[String(chainId)]["address"];

    // Build TX message to front-end
    const txMessage = () => {
      switch (action) {
        case Action.WITHDRAW_ERC20:
          return `Withdraw ${amount} ${tokenName}`;
        case Action.WITHDRAW_ETH:
          return `Withdraw ${amount} ${SupportedNetworkCoin[chainId].symbol}`;
        case Action.WITHDRAW_ERC721:
          return `Withdraw token id ${amount} of ${tokenName}`;
        default:
          return `Unrecognized option`;
      }
    };

    // // Ask for confirmation
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Please confirm the following operation: ${txMessage()}`)) {
      // Generates a random number to be used in the back-end as identifier of this TX
      const random = uuidv4();

      const params = {
        publicId: id,
        userAddress: address,
        from: swapManagerAddress,
        to: toAccount,
        txHash: 0,
        random: random,
        chainId: chainId,
        action: action,
        token: tokenName,
        amount: parseFloat(amount),
        description: txMessage(),
        status: "pending",
        lastUpdate: new Date().getTime() / 1000,
      };

      // Swap in Fabric
      await axios
        .post(`${URL()}/ethereum/send`, params)
        .then(res => {
          getRecentSwaps();
          setIsHandlingTransfer(false);
        })
        .catch(err => {
          setIsHandlingTransfer(false);
        });
    } else {
      setIsHandlingTransfer(false);
      return;
    }
  };

  const swapEthToPrivi = async () => {
    try {
      setIsConfirming(true);
      const userEthAccount = originWallet.address;
      const userAccountOnHlf = user.address;
      const ROPSTEN_NET_ID = "3";
      const fakeDAIAddress = fakeDAIAbs.networks[ROPSTEN_NET_ID].address;
      const erc20 = new web3.eth.Contract(fakeDAIAbs.abi, fakeDAIAddress);
      const atomicContractAddress = atomicSwapAbs.networks[ROPSTEN_NET_ID].address;
      const atomicSwapERC20 = new web3.eth.Contract(atomicSwapAbs.abi, atomicContractAddress);
      const amountToSwap = Web3.utils.toWei(amount, "ether");
      let tx;
      try {
        tx = await erc20.methods.approve(atomicContractAddress, amountToSwap).send({ from: userEthAccount });
      } catch (err) {
        throw new Error(err);
      }
      if (Object.keys(tx.events).length === 0) {
        throw new Error("Approve didn't work");
      }

      const htlcId = Web3.utils.randomHex(32);
      const secret = Web3.utils.randomHex(32);
      const secretHashed = Web3.utils.soliditySha3(secret);
      let date = new Date();
      date.setSeconds(date.getDate() + 100);
      const endOfHTLC = getUnixEpochTimeStamp(date);
      try {
        tx = await atomicSwapERC20.methods
          .createProposal(htlcId, amountToSwap, fakeDAIAddress, PRIVI_ETH_ACCOUNT, secretHashed, endOfHTLC)
          .send({ from: userEthAccount });
      } catch (err) {
        console.log("createProposal issue", err.message);
        throw new Error(err);
      }

      if (Object.keys(tx.events).length === 0) {
        throw new Error("CreateProposal didn't work");
      }
      showAlertMessage("Proposal has been created on Ethereum", { variant: "success" });

      // Then we trigger the backend process
      let priviProposal;
      priviProposal = await axios.post(`${URL()}/ethereum/launchEthPriviSwap`, {
        ethProposalId: htlcId,
        userAccountOnHlf: userAccountOnHlf,
      });
      if (priviProposal.status !== 201) {
        throw new Error("Privi proposal request failed");
      }
      setIsConfirming(false);
      setContractHash(priviProposal.data);
      setSecret(secret);
      setPage(3);
      showAlertMessage("Proposal has been created on PRIVI", { variant: "success" });
    } catch (e) {
      showAlertMessage(e.message || "Swap failed", { variant: "error" });
      setIsConfirming(false);
    }
  };

  const swapPriviToEth = async () => {
    try {
      setIsConfirming(true);
      const userAccountOnEth = targetWallet.address;
      const userAccountOnHlf = originWallet.address;
      const ROPSTEN_NET_ID = "3";
      const atomicSwapERC20 = new web3.eth.Contract(
        atomicSwapAbs.abi,
        atomicSwapAbs.networks[ROPSTEN_NET_ID].address
      );

      const tokenToSwapSymbol = "DAI";
      const secret = Web3.utils.randomHex(32);
      const secretHashed = Web3.utils.soliditySha3(secret);

      // First we create a proposal on HLF
      let date = new Date();
      date.setSeconds(date.getSeconds() + 600);
      const endOfHTLC = getUnixEpochTimeStamp(date);

      let res;
      try {
        res = await axios.post("http://159.65.123.98:4000/api/HTLC/initialiseHTLC", {
          Data: {
            Function: "initialiseHTLC",
            Address: "",
            Signature: "",
            Payload: {
              From: userAccountOnHlf,
              To: "",
              Token: tokenToSwapSymbol,
              Amount: amount,
              TimeLock: endOfHTLC,
              SecretHash: secretHashed,
            },
          },
          Caller: "PRIVI",
        });
      } catch (err) {
        throw new Error(err);
      }

      if (!res.data.success) {
        throw new Error("Proposal creation on Privi failed");
      }

      const priviContractId = res.data.hash;
      let priviProposal;
      try {
        priviProposal = await axios.post("http://localhost:3000/ethereum/launchPriviEthSwap", {
          priviProposalId: priviContractId,
          userAccountOnEth,
        });
      } catch (err) {
        throw new Error(err);
      }
      const ethProposalId = priviProposal.data;
      // Once the backend successfully created its proposal on Ethereum we claim the funds on Ethereum
      try {
        setPage(3);
        await atomicSwapERC20.methods.claimFunds(ethProposalId, secret).send({ from: userAccountOnEth });
        showAlertMessage(`${amount} ${tokenToSwapSymbol} has been transfered!`, { variant: "success" });
        setIsConfirming(false);
        setPage(4);
      } catch (err) {
        throw new Error(err);
      }
    } catch (e) {
      showAlertMessage(e.message || "Swap failed", { variant: "error" });
      setIsConfirming(false);
    }
  };

  const handleInitiateSwap = async () => {
    if (!canSwap()) return;
    if (isDirect) {
      initiateDirectSwap();
    } else {
      setPage(2);
    }
  };

  const handleConfirmSecureSwap = () => {
    if (originNetwork.name === "ETH" && targetNetwork.name === "PRIVI") swapEthToPrivi();
    else if (originNetwork.name === "PRIVI" && targetNetwork.name === "ETH") swapPriviToEth();
    else {
      showAlertMessage("The swap you've seen is not valid yet. It is coming soon!");
    }
  };

  const getAssetBox = () => {
    return (
      <Box className={classes.blueBox} padding="34px 35px 34px 32px">
        <h3>Asset</h3>
        <Box onClick={handleOpenAssetModal} style={{ cursor: "pointer" }}>
          <TokenSelect
            value={token}
            disabled
            onChange={e => handleChangeToken(e.target.value)}
            tokens={tokenList.map(obj => ({ token: obj.symbol, name: obj.name }))}
          />
        </Box>
        <InputWithLabelAndTooltip
          type="text"
          inputValue={amount}
          onInputValueChange={e => handleAmountChange(e.target.value)}
        />
        <Box className={classes.flexBox} mt={2}>
          <Box width={1}>
            <Box mb={"6px"} fontFamily={"Montserrat"} fontSize="12px" style={{ opacity: "0.6px" }}>
              Available
            </Box>
            <Box color={Color.White} fontSize="14px" fontWeight="bold">
              {originWallet && originWallet.balance} {token}
            </Box>
          </Box>
          <Box width={1} display="flex" alignItems="flex-end" flexDirection="column">
            <Box mb={"6px"} fontFamily={"Montserrat"} fontSize="12px" style={{ opacity: "0.6px" }}>
              Fee
            </Box>
            <Box color={Color.White} fontSize="14px" fontWeight="bold">
              0.045 PRIVI
            </Box>
          </Box>
        </Box>
        <AssetModal
          open={openAssetModal}
          onClose={handleCloseAssetModal}
          asset={token}
          tokens={tokenList.map(obj => ({ token: obj.symbol, name: obj.name }))}
          onChange={e => handleChangeToken(e)}
          chain={originNetwork?.value?.split(` `)[0]}
        />
      </Box>
    );
  };

  const getSwapBox = () => {
    return (
      <Box className={classes.blueBox} padding="34px 35px 34px 32px" style={{ height: "auto" }}>
        <h3>My swap</h3>
        <Box className={classes.flexBox} mb="14px" mt="11px" fontSize={"20px"}>
          <img className={classes.tokenImage} src={require(`assets/tokenImages/${token}.png`)} alt={token} />
          <Box mr="8px">{amount || 0}</Box>
          <b>{token}</b>
        </Box>

        <div className={classes.dividerWhite} />

        <Box display="flex" flexDirection="column" alignItems="center">
          <Box className={classes.networkBox}>
            <img src={require(`assets/tokenImages/${originNetwork.name}.png`)} alt={originNetwork.name} />
            {originNetwork.value}
          </Box>
          <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0.831177 1.54731L6.33118 7L11.8312 1.54731L10.2699 -6.82444e-08L6.33118 3.90487L2.39243 -4.12581e-07L0.831177 1.54731Z"
              fill="#AA99D9"
            />
          </svg>
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.732 -1.06516e-07L8.58442 6.15L2.43682 -6.43956e-07L2.08744e-05 2.436L8.58442 11.0204L17.1688 2.436L14.732 -1.06516e-07Z"
              fill="#AA99D9"
            />
          </svg>
          <Box className={classes.networkBox}>
            <img src={require(`assets/tokenImages/${targetNetwork.name}.png`)} alt={targetNetwork.name} />
            {targetNetwork.value} Chain
          </Box>
        </Box>
      </Box>
    );
  };

  const getInitSwapBox = () => {
    return (
      <Box className={classes.flexBox} flexGrow={1} flexDirection="column">
        <Box className={classes.swapBox}>
          <Box
            flexGrow={1}
            flexWrap={"wrap"}
            style={{ background: "#F9F7FF", borderTopLeftRadius: "12px", borderBottomLeftRadius: "12px" }}
            padding="38px 30px 46px"
          >
            <Box className={classes.header1} style={{ fontSize: "18px" }} mb={2}>
              From
            </Box>
            <NetworkTokenSelect
              token={originNetwork.name}
              setToken={v => setOriginNetwork(v)}
              BlockchainNets={BlockchainNets}
            />
            <div className={classes.divider} />
            <Box className={classes.flexBox}>
              <Box width={1}>
                <Box mb={"12px"} className={classes.walletLabel}>
                  Origin Wallet
                </Box>
                {originWallet && originWallet.address ? (
                  <Box className={classes.flexBox}>
                    <Box mr="6px">{originWallet.address}</Box>
                    <EditAddressIcon />
                  </Box>
                ) : (
                  <Box className={classes.walletButton} onClick={handleOriginWalletConnect}>
                    <SwapIcon />
                    <span>Connect Wallet</span>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
          <button onClick={handleSwap} className={classes.buttonSwap}>
            <img src={require("assets/icons/arrow_white.png")} alt="_white" />
            <img src={require("assets/icons/arrow_white.png")} alt="arrow" />
          </button>
          <Box flexGrow={1} flexWrap={"wrap"} padding="38px 30px 46px">
            <Box className={classes.header1} style={{ fontSize: "18px" }} mb={2}>
              To
            </Box>
            <NetworkTokenSelect
              token={targetNetwork.name}
              setToken={v => setTargetNetwork(v)}
              BlockchainNets={BlockchainNets}
            />
            <div className={classes.divider} />

            <Box className={classes.flexBox}>
              <Box width={1}>
                <Box mb={"12px"} className={classes.walletLabel}>
                  Destination Wallet
                </Box>
                {targetWallet && targetWallet.address ? (
                  <Box className={classes.flexBox}>
                    <Box mr="6px">{targetWallet.address}</Box>
                    <EditAddressIcon />
                  </Box>
                ) : (
                  <Box className={classes.walletButton} onClick={handleTargetWalletConnect}>
                    <SwapIcon />
                    <span>Connect Wallet</span>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        <button onClick={handleInitiateSwap} className={classes.initButton} disabled={!isApproved}>
          <div />
          <Box>Initiate Swap</Box>
          <img src={require("assets/icons/arrow_white.png")} alt="arrow" />
        </button>
      </Box>
    );
  };

  const getBackUpLinkBox = () => {
    return (
      <Box className={`${classes.borderBox}`} justifyContent="space-between">
        <Box>
          <Box mb={"12px"} font-size="30.5186px" line-height="64px">
            ⚠️
          </Box>
          <Box className={classes.header1} style={{ fontSize: "18px" }} mb={1}>
            Copy backup link
          </Box>
          <Box className={classes.header2} lineHeight="140%">
            If your browser closes <b>you will need this link to claim your funds.</b>
            <br />
            Save it where you can retrieve it if the browser closes. <br />
            Additionally, <b>you can bookmark this page.</b>
          </Box>
        </Box>
        <Box className={`${classes.flexBox} ${classes.buttons}`} mt={2}>
          <PrimaryButton size="small" onClick={handleConfirmSecureSwap}>
            Continue
          </PrimaryButton>
          <SecondaryButton size="small" onClick={() => {}}>
            <Box className={classes.flexBox} alignItems="center" justifyContent="center">
              <CopyIcon style={{ width: "16px", marginRight: "8px" }} /> <span>Copy Link</span>
            </Box>
          </SecondaryButton>
        </Box>
      </Box>
    );
  };

  const getConfirmingBox = () => {
    return (
      <Box className={`${classes.borderBox}`}>
        <Box className={classes.flexBox} style={{ justifyContent: "space-between" }}>
          <Box className={classes.header1} style={{ fontSize: "18px" }} mb={1}>
            Confirming terms
          </Box>
          <Box className={classes.flexBox} style={{ cursor: "pointer" }} onClick={() => {}}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.5 12H17C18.1046 12 19 11.1046 19 10V3C19 1.89543 18.1046 1 17 1H10C8.89543 1 8 1.89543 8 3V4.5M3 19H10C11.1046 19 12 18.1046 12 17V10C12 8.89543 11.1046 8 10 8H3C1.89543 8 1 8.89543 1 10V17C1 18.1046 1.89543 19 3 19Z"
                stroke="#4218B5"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <Box color="#4218B5" ml={"10px"}>
              Swap Link
            </Box>
          </Box>
        </Box>
        <Box className={classes.shadowBox} padding="24px 22px 27px" mb="6px">
          <Box mr={2}>
            <LoadingWrapper loading={isConfirming}>Confirmed</LoadingWrapper>
          </Box>
          <Box fontFamily="Montserrat">
            <Box color={Color.Black} fontSize="16px" lineHeight="104.5%" fontWeight={600} mb="5px">
              Confirming your {token} transaction
            </Box>
            <Box className={classes.header2} style={{ fontSize: "14px" }}>
              This will take approximately few minutes
            </Box>
          </Box>
        </Box>
        {status === 2 ? (
          <Box className={classes.shadowBox} padding={"16px 20px 20px"}>
            <Box mr={2}>
              <CircularProgress />
            </Box>
            <Box display="flex" alignItems="center">
              <Box color={Color.Black} fontSize="16px" lineHeight="104.5%" fontWeight={600} mb="5px">
                Waiting for chain confirmation
              </Box>
              <Box
                height="24px"
                width="1px"
                style={{
                  opacity: 0.05,
                  background: "#00000",
                  margin: "0px 17px",
                }}
              />
              <Box className={classes.header2} style={{ fontSize: "14px" }}>
                this will take approximately 2 minutes
              </Box>
            </Box>
          </Box>
        ) : null}
        <Box className={classes.flexBox} style={{ fontSize: "14px", alignItems: "flex-start" }}>
          <Box mr="54px">
            <Box className={classes.header2} style={{ color: Color.Black }} mr={1}>
              DAI Transaction has
            </Box>
            <Box color="#3AD5CC" mt="4px">
              2 confirmations
            </Box>
          </Box>
          <Box mr="54px">
            <Box className={classes.header2} style={{ color: Color.Black }} mr={1}>
              Privi Chain Transaction has
            </Box>
            <Box color="#3AD5CC" mt="4px">
              2 confirmations
            </Box>
          </Box>
          <Box className={classes.header2} color={Color.MusicDAOLightBlue}>
            🕑 Swap Expires in <b>5:29hr.</b>
          </Box>
        </Box>
      </Box>
    );
  };

  const getClaimingBox = () => {
    return (
      <Box className={`${classes.borderBox}`} justifyContent="space-between">
        <Box className={classes.flexBox} style={{ justifyContent: "space-between" }}>
          <Box className={classes.header1} style={{ fontSize: "18px" }} mb={1}>
            Claiming
          </Box>
          <Box className={classes.flexBox} style={{ cursor: "pointer" }} onClick={() => {}}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.5 12H17C18.1046 12 19 11.1046 19 10V3C19 1.89543 18.1046 1 17 1H10C8.89543 1 8 1.89543 8 3V4.5M3 19H10C11.1046 19 12 18.1046 12 17V10C12 8.89543 11.1046 8 10 8H3C1.89543 8 1 8.89543 1 10V17C1 18.1046 1.89543 19 3 19Z"
                stroke="#4218B5"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <Box color="#4218B5" ml={"10px"}>
              Swap Link
            </Box>
          </Box>
        </Box>
        <Box className={classes.flexBox} mt="16px">
          <Box mr={2} fontSize="30.5186px" lineHeight="64px">
            ⚠️
          </Box>
          <Box fontFamily="Montserrat">
            <Box mb="4px" color={Color.Black} fontSize="15px" fontWeight={600} lineHeight="134.5%">
              Before you claim
            </Box>
            <Box color={"#707582"} fontSize="14px" fontWeight={500} lineHeight="140%">
              Connect the account that you provided as DAI receiving address.
            </Box>
          </Box>
        </Box>
        <Box className={`${classes.flexBox} ${classes.buttons}`} mt={2}>
          <PrimaryButton size="small" onClick={onClaim}>
            Claim Your DAI
          </PrimaryButton>
        </Box>
        <Box width="100%">
          <StyledDivider color={Color.Black} type="dashed" mt={4} mb={2} />
        </Box>
        <Box className={classes.flexBox} style={{ fontSize: "14px", alignItems: "flex-start" }}>
          <Box mr="54px">
            <Box className={classes.header2} style={{ color: Color.Black }} mr={1}>
              DAI Transaction has
            </Box>
            <Box color="#3AD5CC" mt="4px">
              2 confirmations
            </Box>
          </Box>
          <Box mr="54px">
            <Box className={classes.header2} style={{ color: Color.Black }} mr={1}>
              Privi Chain Transaction has
            </Box>
            <Box color="#3AD5CC" mt="4px">
              2 confirmations
            </Box>
          </Box>
          <Box className={classes.header2} color={Color.MusicDAOLightBlue}>
            🕑 Swap Expires in <b>5:29hr.</b>
          </Box>
        </Box>
      </Box>
    );
  };

  const getSettlementBox = () => {
    return (
      <Box
        className={`${classes.borderBox}`}
        justifyContent="space-between"
        flexDirection="column"
        alignItems="center"
      >
        <Box className={`${classes.flexBox}`} flexDirection="column" alignItems="center">
          <img src={require("assets/icons/rewards.png")} alt="" className={classes.completeImg} />
          <Box
            className={classes.header1}
            mb={"8px"}
            style={{
              fontSize: "20px",
            }}
          >
            Completed!
          </Box>
          <Box className={classes.flexBox}>
            <Box className={classes.header2}>Go to your wallet to confirm your balance</Box>
          </Box>
        </Box>
        <Box className={classes.flexBox} mt={3}>
          <PrimaryButton
            size="small"
            onClick={() => {
              setPage(1);
            }}
          >
            Initiate New Swap
          </PrimaryButton>
        </Box>
      </Box>
    );
  };

  return (
    <div className={classes.container}>
      <Box className={classes.types}>
        <Box
          className={`${classes.type} ${isDirect ? classes.typeSelected : ""}`}
          onClick={() => setIsDirect(true)}
        >
          <img src={require("assets/icons/swap_direct.png")} />
          <Box>
            <Box className={classes.header1}>Direct</Box>
            <Box className={classes.header2}>If you’re looking for a fast method</Box>
          </Box>
        </Box>
        <Box
          className={`${classes.type} ${!isDirect ? classes.typeSelected : ""}`}
          ml={2}
          onClick={() => setIsDirect(false)}
        >
          <img src={require("assets/icons/swap_secure.png")} />
          <Box>
            <Box className={classes.header1}>Super Secure</Box>
            <Box className={classes.header2}>If security is your top priority</Box>
          </Box>
        </Box>
      </Box>
      {!isDirect && (
        <Box mt={"30px"}>
          <Box className={classes.stepsBorder} />
          <Box className={classes.steps}>
            {["Swap Initiation", "Terms Confirmation", "Claiming", "Settlement"].map((tab, index) => (
              <Box className={index + 1 <= page ? classes.selectedStep : undefined} key={`tab-${index}`}>
                <button onClick={() => setPage(index + 1)}>{index + 1}</button>
                <span>{tab}</span>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      <Box mt={isDirect ? "48px" : "44px"}>
        <Grid container spacing={2}>
          <Grid item sm={12} md={4} xs={12} style={{ display: "flex", height: "auto" }}>
            {page === 1 || isDirect ? getAssetBox() : getSwapBox()}
          </Grid>
          <Grid item sm={12} md={8} xs={12} style={{ display: "flex", height: "auto" }}>
            {page === 1 || isDirect
              ? getInitSwapBox()
              : page === 2
              ? isConfirming
                ? getConfirmingBox()
                : getBackUpLinkBox()
              : page === 3
              ? getClaimingBox()
              : getSettlementBox()}
          </Grid>
        </Grid>
      </Box>
      <Box style={{ marginTop: "32px" }}>
        <SwapHistory history={recentSwaps} />
      </Box>
    </div>
  );
}
