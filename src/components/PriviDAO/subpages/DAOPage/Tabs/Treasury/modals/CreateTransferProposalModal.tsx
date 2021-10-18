import React, { useEffect, useState, useRef } from "react";

import { Box, Grid } from "@material-ui/core";

import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { useTypedSelector } from "store/reducers/Reducer";
import { FontSize, Modal } from "shared/ui-kit";
import { buildJsxFromObject, formatNumber } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { makePayment, transferProposal } from "shared/services/API";
import { TitleGrandLight, Text } from "../../../index.styles";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

const CreateTransferProposalModal = ({ isUserView, open, handleClose, handleRefresh, communityAddress }) => {
  // redux
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const [tokens, setTokens] = useState<any[]>([{ token: "USDT" }]);
  const [token, setToken] = useState<string>("");
  const [amount, setAmount] = useState<string>("0");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [estimationFee, setEstimationFee] = useState<string>("0");
  const [concept, setConcept] = useState<string>("");

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  useEffect(() => {
    const tokenList: any[] = [];
    let tok: string = "";
    let obj: any = null;
    for ([tok, obj] of Object.entries(userBalances)) {
      if (obj.Type == "CRYPTO") tokenList.push({ token: tok });
    }
    setTokens(tokenList);
    if (token == "" && tokenList.length) setToken(tokenList[0]?.token);
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
      return false;
    } else if (!Number(amount)) {
      setErrorMsg("Amount invalid");
      handleClickError();
      return false;
    } else if (!token) {
      setErrorMsg("Token invalid");
      handleClickError();
      return false;
    } else if (isUserView && !communityAddress) {
      setErrorMsg("Address invalid");
      handleClickError();
      return false;
    }
    return true;
  };

  const handleOpenSignatureModal = () => {
    if (validate()) {
      let payload = {};
      if (isUserView) {
        payload = {
          Type: concept ?? "Payment",
          Token: token,
          From: user.address,
          To: communityAddress,
          Amount: amount,
        };
      } else {
        payload = {
          CommunityId: communityAddress,
          Token: token,
          To: walletAddress,
          Amount: amount,
        };
      }
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        let resp;
        if (isUserView) resp = await makePayment(payload, {});
        else resp = await transferProposal(payload, { Concept: concept });
        if (resp && resp.success) {
          setSuccessMsg("Transfer submited");
          handleClickSuccess();
          setTimeout(() => {
            handleClose();
            handleRefresh();
          }, 1000);
        } else {
          setErrorMsg("Transfer submission failed");
          handleClickError();
        }
      }
    } catch (e) {
      setErrorMsg("Unexpected error: " + e);
      handleClickError();
    }
  };

  return (
    <Modal size="small" isOpen={open} onClose={handleClose} showCloseIcon theme="dark">
      <SignatureRequestModal
        theme="dark"
        open={openSignRequestModal}
        address={user.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={handleSubmit}
        handleClose={() => setOpenSignRequestModal(false)}
      />
      <Box mb={3}>
        <TitleGrandLight disableUppercase>New Transfer Proposal</TitleGrandLight>
      </Box>
      <Box display="flex" flexDirection="row" mb={3} color="white" fontSize="18px">
        <Grid container direction="row" spacing={3}>
          <Grid item xs={12} md={6}>
            <Box>Token</Box>
            <TokenSelect
              value={token}
              onChange={e => setToken(e.target.value)}
              tokens={tokens}
              theme="dark"
            />
            {isUserView && (
              <Text size={FontSize.S} mt={1}>
                Available {formatNumber(userBalances[token] ? userBalances[token].Balance : 0, token, 4)}
              </Text>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <InputWithLabelAndTooltip
              theme="dark"
              inputValue={amount}
              onInputValueChange={e => setAmount(e.target.value)}
              type="number"
              minValue="0.001"
              labelName="Amount"
              placeHolder="Type an amount to transfer"
            />
          </Grid>

          {isUserView ? (
            <Grid item xs={12} md={12}>
              <InputWithLabelAndTooltip
                theme="dark"
                inputValue={estimationFee}
                type="number"
                labelName="Estimated fee"
                placeHolder="Fee applied for this operation"
                disabled
              />
            </Grid>
          ) : (
            <Grid item xs={12} md={12}>
              <InputWithLabelAndTooltip
                theme="dark"
                inputValue={walletAddress}
                type="text"
                labelName="Address"
                placeHolder="Address to do the transfer to"
                onInputValueChange={e => setWalletAddress(e.target.value)}
              />
            </Grid>
          )}

          <Grid item xs={12} md={12}>
            <InputWithLabelAndTooltip
              theme="dark"
              inputValue={concept}
              type="text"
              labelName="Concept"
              placeHolder="Concept of the transfer"
              onInputValueChange={e => setConcept(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <DAOButton onClick={handleClose}>Cancel</DAOButton>
        <DAOButton onClick={handleOpenSignatureModal}>Submit Transfer Proposal</DAOButton>
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
  );
};

export default CreateTransferProposalModal;
