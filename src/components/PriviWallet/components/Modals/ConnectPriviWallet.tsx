import React, { FC, useEffect, useState } from "react";
import { ConnectPriviWalletModal, MnemonicWordsInputModal } from "shared/ui-kit/Modal/Modals";
import { generatePriviWallet, savePriviWallet } from "shared/helpers";
import * as API from 'shared/services/API/WalletAPI'
import { LoadingWrapper } from "shared/ui-kit/Hocs";

interface IConnectPriviWallet {
  onClose?: () => void;
  walletList?: any;
  setWalletList?: (any) => void;
}

enum CONNECTSTEP {
  INIT,
  MNEMONIC,
}

const ConnectPriviWallet: FC<IConnectPriviWallet> = props => {
  const userId = sessionStorage.getItem("userId");
  const [step, setStep] = useState(CONNECTSTEP.INIT);
  const { onClose } = props;
  const [loading, setLoading] = useState<boolean>(false)

  const handleConnect = () => {
    setStep(CONNECTSTEP.MNEMONIC);
  };

  const handleSubmit = async (phrases: string[]) => {
    const { address, privateKey } = await generatePriviWallet(phrases);
    setLoading(true)
    try {
      await API.connectPriviWallet({ userId, address })
      savePriviWallet(privateKey)
      setLoading(false)
      handleClose();
      alert("Privi wallet connected");
    } catch(e) {
      alert(e.message);
      setLoading(false)
    }
  };

  const handleClose = () => {
    setStep(CONNECTSTEP.INIT);
    onClose && onClose();
  };

  useEffect(() => {}, []);

  return (
    <LoadingWrapper loading={loading}>
      <ConnectPriviWalletModal
        open={step === CONNECTSTEP.INIT}
        handleConnect={handleConnect}
        handleClose={handleClose}
      />
      <MnemonicWordsInputModal
        open={step === CONNECTSTEP.MNEMONIC}
        title="Connect Privi Wallet"
        submitBtnTxt="Connet Wallet"
        handleSubmit={handleSubmit}
        handleClose={handleClose}
      />
    </LoadingWrapper>
  );
};

export default ConnectPriviWallet;
