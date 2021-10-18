import { AbstractConnector } from "@web3-react/abstract-connector";
import { BscConnector, UserRejectedRequestError } from "@binance-chain/bsc-connector";
import { ConnectionRejectedError } from "use-wallet";
import { InjectedConnector } from '@web3-react/injected-connector';

import { injected, walletconnect, bscConnect } from "shared/connectors";

import MetaMaskLogo from "assets/walletImages/metamask.svg";
import WalletConnectLogo from "assets/walletImages/wallet_connect.svg";
import BinanceExtensionLogo from "assets/walletImages/Binance.svg";
import PriviWalletLogo from "assets/tokenImages/PRIVI.png";
import WaxWalletLogo from "assets/walletImages/waxWallet.png";
import PolkadotWalletLogo from "assets/walletImages/polkadot.svg";

export const PRIVI_ADDRESS = "0x4c6a375e66440949149720f273d69fcd11b1564b";
export const PRIVI_ETH_ACCOUNT = "0x7d994063E2C98b2F49b13418Fc3FE58c45DdcC0D";
export const walletConnect = {
  walletconnect: { rpcUrl: process.env.REACT_APP_INFURA_URL || "" },
  bsc: {
    web3ReactConnector() {
      return new BscConnector({ supportedChainIds: [56, 97] });
    },
    handleActivationError(err) {
      if (err instanceof UserRejectedRequestError) {
        return new ConnectionRejectedError();
      }
    },
  },
};

export const chainId = 1;

export const POLYGON_CHAIN_IDS = [137, 80001];

export const polygonConnector = new InjectedConnector({ supportedChainIds: POLYGON_CHAIN_IDS })

export type WalletInfo = {
  title: string;
  description: string;
  logo: string;
  type: "privi" | "metamask" | "walletconnect" | "binance" | "wax" | "polkadot";
  connector?: AbstractConnector;
};

export const RANDOM_MOCK_PLAYLISTS_LENGTH = 19;
export const WALLETS: WalletInfo[] = [
  {
    title: "Privi Wallet",
    description: "Connect to your Privi Wallet",
    logo: PriviWalletLogo,
    connector: injected,
    type: "privi",
  },
  {
    title: "MetaMask",
    description: "Connect to your MetaMask Wallet",
    logo: MetaMaskLogo,
    connector: injected,
    type: "metamask",
  },
  {
    title: "WalletConnect",
    description: "Connect to your WalletConnect",
    logo: WalletConnectLogo,
    connector: walletconnect,
    type: "walletconnect",
  },
  {
    title: "Binance Extension",
    description: "Connect to your Binance Wallet",
    logo: BinanceExtensionLogo,
    connector: bscConnect,
    type: "binance",
  },
  {
    title: "Wax Wallet",
    description: "Connect to your Wax Wallet",
    logo: WaxWalletLogo,
    type: "wax",
  },
  {
    title: "Polkadot Wallet",
    description: "Connect to your Polkadot Wallet",
    logo: PolkadotWalletLogo,
    type: "polkadot",
  },
];

const emailRegex = new RegExp(
  /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

export function validEmail(email: string): boolean {
  return emailRegex.test(email);
}

export const BlockchainNets = [
  { name: "PRIVI", value: "Privi Chain" },
  { name: "SUBSTRATE", value: "Substrate Chain" },
  { name: "POLYGON", value: "Polygon Chain" },
  { name: "ETH", value: "Ethereum Chain" },
];

export const handleFacebookLink = () => {
  window.location.href = 'https://www.facebook.com/PRIVI-Protocol-104693631453856';
};

export const handleTwitterLink = () => {
  window.location.href = 'http://www.twitter.com/priviprotocol';
};

export const handleLinkedinLink = () => {
  window.location.href = 'https://www.linkedin.com/company/privi-protocol/';
};

export const handleInstagramLink = () => {
  window.location.href = 'https://instagram.com/priviprotocol';
};

export const handleTiktokLink = () => {
  window.location.href = 'https://vm.tiktok.com/ZMechVPv8/';
};

export const handleMediumLink = () => {
  window.location.href = 'https://privi.medium.com/';
};

export const EUROPEAN_COUNTRIES = [
  {
    name: "Andorra",
    id: "AD",
  },
  {
    name: "Albania",
    id: "AL",
  },
  {
    name: "Austria",
    id: "AT",
  },
  {
    name: "Åland Islands",
    id: "AX",
  },
  {
    name: "Bosnia and Herzegovina",
    id: "BA",
  },
  {
    name: "Belgium",
    id: "BE",
  },
  {
    name: "Bulgaria",
    id: "BG",
  },
  {
    name: "Belarus",
    id: "BY",
  },
  {
    name: "Switzerland",
    id: "CH",
  },
  {
    name: "Cyprus",
    id: "CY",
  },
  {
    name: "Czech Republic",
    id: "CZ",
  },
  {
    name: "Germany",
    id: "DE",
  },
  {
    name: "Denmark",
    id: "DK",
  },
  {
    name: "Estonia",
    id: "EE",
  },
  {
    name: "Spain",
    id: "ES",
  },
  {
    name: "Finland",
    id: "FI",
  },
  {
    name: "Faroe Islands",
    id: "FO",
  },
  {
    name: "France",
    id: "FR",
  },
  {
    name: "United Kingdon",
    id: "GB",
  },
  {
    name: "Guernsey",
    id: "GG",
  },
  {
    name: "Greece",
    id: "GR",
  },
  {
    name: "Croatia",
    id: "HR",
  },
  {
    name: "Hungary",
    id: "HU",
  },
  {
    name: "Ireland",
    id: "IE",
  },
  {
    name: "Isle of Man",
    id: "IM",
  },
  {
    name: "Iceland",
    id: "IC",
  },
  {
    name: "Italy",
    id: "IT",
  },
  {
    name: "Jersey",
    id: "JE",
  },
  {
    name: "Liechtenstein",
    id: "LI",
  },
  {
    name: "Lithuania",
    id: "LT",
  },
  {
    name: "Luxembourg",
    id: "LU",
  },
  {
    name: "Latvia",
    id: "LV",
  },
  {
    name: "Monaco",
    id: "MC",
  },
  {
    name: "Moldova, Republic of",
    id: "MD",
  },
  {
    name: "Macedonia, The Former Yugoslav Republic of",
    id: "MK",
  },
  {
    name: "Malta",
    id: "MT",
  },
  {
    name: "Netherlands",
    id: "NL",
  },
  {
    name: "Norway",
    id: "NO",
  },
  {
    name: "Poland",
    id: "PL",
  },
  {
    name: "Portugal",
    id: "PT",
  },
  {
    name: "Romania",
    id: "RO",
  },
  {
    name: "Russian Federation",
    id: "RU",
  },
  {
    name: "Sweden",
    id: "SE",
  },
  {
    name: "Slovenia",
    id: "SI",
  },
  {
    name: "Svalbard and Jan Mayen",
    id: "SJ",
  },
  {
    name: "Slovakia",
    id: "SK",
  },
  {
    name: "San Marino",
    id: "SM",
  },
  {
    name: "Ukraine",
    id: "UA",
  },
  {
    name: "Holy See (Vatican City State)",
    id: "VA",
  },
];
