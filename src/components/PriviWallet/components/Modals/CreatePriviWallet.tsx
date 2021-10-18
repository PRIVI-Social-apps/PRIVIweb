import React, { FC, useState } from "react";
import axios from "axios";
import URL from "shared/functions/getURL";
import {
  CreatePriviWalletModal,
  CreatePhraseModal,
  MnemonicWordsInputModal,
  UnlockPriviWalletModal,
} from "shared/ui-kit/Modal/Modals";
import { generatePriviWallet } from "shared/helpers";
import { generatePhrase } from "@xchainjs/xchain-crypto";

interface ICreateWallet {
  onClose?: () => void;
  walletList?: any;
  setWalletList?: (any) => void;
}

enum WALLET {
  INIT,
  CREATE,
  VERIFY,
  SUCCESS,
}

const CreatePriviWallet: FC<ICreateWallet> = props => {
  const userId = sessionStorage.getItem("userId");
  const { onClose } = props;
  const [step, setStep] = useState(WALLET.INIT);
  const [phrases, setPhrases] = useState<string[]>([]);
  const { walletList, setWalletList } = props;

  const handleCreate = () => {
    const temp = generatePhrase().split(" ");
    if (temp.length === 12) {
      setPhrases(temp);
      setStep(WALLET.CREATE);
    }
  };

  const handleVerify = async (_phrases: string[]) => {
    if (phrases.join(" ") === _phrases.join(" ")) {
      if (!userId) return;
      const { address, privateKey } = await generatePriviWallet(phrases);
      // call attachAddress API
      axios
        .post(`${URL()}/wallet/registerPriviWallet`, {
          userId,
          address,
        })
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            setWalletList && setWalletList([...walletList, resp.wallet]);
            setStep(WALLET.SUCCESS);
          } else {
            // Wallet Creation failed
            console.log("Wallet Creation Failed");
          }
        });
    }
  };

  const handleClose = async () => {
    setStep(WALLET.INIT);
    onClose && onClose();
  };

  const renderStep = () => {
    switch (step) {
      case WALLET.INIT:
        return <CreatePriviWalletModal open={true} handleOk={handleCreate} handleClose={handleClose} />;
      case WALLET.CREATE:
        return (
          <CreatePhraseModal
            open={true}
            onBack={() => setStep(WALLET.INIT)}
            onNext={() => setStep(WALLET.VERIFY)}
            phrases={phrases}
            onGenerate={handleCreate}
            onClose={handleClose}
          />
        );
      case WALLET.VERIFY:
        return (
          <MnemonicWordsInputModal
            open={true}
            handleSubmit={handleVerify}
            handleClose={handleClose}
            onBack={() => setStep(WALLET.CREATE)}
          />
        );
      case WALLET.SUCCESS:
        return <UnlockPriviWalletModal open={true} onClose={handleClose} />;
      default:
        break;
    }
  };

  return <> {renderStep()}</>;
};

export default CreatePriviWallet;
