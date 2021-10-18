import React, { useEffect, useState, useRef } from "react";

import { Text } from "../TreasuryStyle";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { useTypedSelector } from "store/reducers/Reducer";
import { FontSize, Header5, HeaderBold4, PrimaryButton, SecondaryButton, Modal } from "shared/ui-kit";
import { Input } from "shared/ui-kit/inputs";
import Box from "shared/ui-kit/Box";
import { buildJsxFromObject, formatNumber } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { makePayment, transferProposal } from "shared/services/API";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

const CreateTransferProposalModal = ({isUserView, open, handleClose, handleRefresh, communityAddress}) => {
  // redux
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const [tokens, setTokens] = useState<any[]>([{token: 'USDT'}]);
  const [token, setToken] = useState<string>('');
  const [amount, setAmount] = useState<string>('0');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [estimationFee, setEstimationFee] = useState<string>('0');
  const [concept, setConcept] = useState<string>('');

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  useEffect(() => {
    const tokenList:any[] = [];
    let tok:string = '';
    let obj:any = null;
    for ([tok, obj] of Object.entries(userBalances)) {
      if (obj.Type == 'CRYPTO') tokenList.push({token: tok});
    }
    setTokens(tokenList);
    if (token == '' && tokenList.length) setToken(tokenList[0]?.token);
  }, [userBalances]);


  const handleClickSuccess = () => {
    setOpenSuccess(true);
    setTimeout(() => {
      setOpenSuccess(false);
    }, 3000);
  };

  const handleClickError = () => {
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
    }, 3000);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  const validate = () => {
    if (!communityAddress) {
      setErrorMsg("Community Address missing");
      handleClickError();
      return false
    }
    else if (!Number(amount)) {
      setErrorMsg("Amount invalid");
      handleClickError();
      return false
    }
    else if (!token) {
      setErrorMsg("Token invalid");
      handleClickError();
      return false
    }
    else if (isUserView && !communityAddress) {
      setErrorMsg("Address invalid");
      handleClickError();
      return false
    }
    return true;
  }

  const handleOpenSignatureModal = () => {
    if (validate()) {
      let payload = {};
      if (isUserView) {
        payload = {
          "Type": concept ?? "Payment",
          "Token": token,
          "From": user.address,
          "To": communityAddress,
          "Amount": amount
        };
      }
      else {
        payload = {
          "CommunityId": communityAddress,
          "Token": token,
          "To": walletAddress,
          "Amount": amount
        };
      }
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  }

  const handleSubmit = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        let resp;
        if (isUserView) resp = await makePayment(payload, {});
        else resp = await transferProposal(payload, {Concept: concept});
        if (resp && resp.success) {
          setSuccessMsg("Transfer submited");
          handleClickSuccess();
          setTimeout(() => {
            handleClose();
            handleRefresh();
          }, 1000);
        }
        else {
          setErrorMsg("Transfer submission failed");
          handleClickError();
        }
      }
    }
    catch (e) {
      setErrorMsg("Unexpected error: " + e);
      handleClickError();
    }
  };

  return (
    <Modal
        size="small"
        isOpen={open}
        onClose={handleClose}
        showCloseIcon
      >
      <SignatureRequestModal
        open={openSignRequestModal}
        address={user.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={handleSubmit}
        handleClose={() => setOpenSignRequestModal(false)}
      />
      <Box mb={5}>
        <HeaderBold4>New Transfer Proposal</HeaderBold4>
      </Box>
      <Box display="flex" flexDirection="row" mb={4}>
        <Box width={0.5} pr={1}>
          <Header5>Token</Header5>
          <TokenSelect
            value={token}
            onChange={(e) => setToken(e.target.value)}
            tokens={tokens}
          />
          {isUserView && <Text size={FontSize.S} mt={1}>Available {formatNumber(userBalances[token] ? userBalances[token].Balance : 0, token, 4)}</Text>}
        </Box>
        <Box width={0.5} pl={1}>
          <Header5>Amount</Header5>
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{height: 50, width: '100%'}}
          />
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" mb={4}>
        {isUserView ? // FIXME: user view or cofounder view
          <>
            <Header5>Estimated Fee</Header5>
            <Input
              value={estimationFee}
              onChange={(e) => setEstimationFee(e.target.value)}
              disabled={true}
              style={{height: 50}}
            />
          </>
          :
          <>
            <Header5>Wallet Address</Header5>
            <Input
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              style={{height: 50}}
            />
          </>
        }
      </Box>
      <Box display="flex" flexDirection="column" mb={4}>
        <Header5>Concept</Header5>
        <Input
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          style={{height: 50}}
        />
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <SecondaryButton size="medium" onClick={handleClose}>Cancel</SecondaryButton>
        <PrimaryButton size="medium" onClick={handleOpenSignatureModal}>
          Submit Transfer Proposal
        </PrimaryButton>
      </Box>

      {openSuccess && (
        <AlertMessage
          key={Math.random()}
          message={successMsg}
          variant="success"
          onClose={handleCloseSuccess}
        />
      )}
      {openError && (
        <AlertMessage
          key={Math.random()}
          message={errorMsg}
          variant="error"
          onClose={handleCloseError}
        />
      )}
    </Modal>
  )
}

export default CreateTransferProposalModal;
