import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import { FontSize, Header5, HeaderBold4, PrimaryButton, Modal } from "shared/ui-kit";
import { Input } from "shared/ui-kit/inputs";
import Box from "shared/ui-kit/Box";
import { useTypedSelector } from "store/reducers/Reducer";
import { Text } from "../VestingTaxationStyle";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { airdropCommunityToken, allocateTokenProposal } from "shared/services/API";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

// Create Airdrop or Allocation proposal
const CreateProposal = ({ type, open, handleClose, handleRefresh, community }) => {
  //REDUX
  const user = useTypedSelector(state => state.user);

  const [proposalData, setProposalData] = useState<any>({
    amount: '',
    address: '',
  });
  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const [available, setAvailable] = useState<number>(0);

  const handleChangeProposalData = field => event => {
    const value = event.target.value;
    setProposalData(prev => ({ ...prev, [field]: value }));
  };

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

  const handleOpenSignatureModal = () => {
    if (community.CommunityAddress && proposalData.amount && proposalData.address) {
      const payload: any = {
        "CommunityId": community.CommunityAddress,
        "Addresses": {[proposalData.address]: proposalData.amount}
      };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  }

  const handleCreatePropose = async () => {
    try {
      const payload = payloadRef.current;
    if (Object.keys(payload).length) {
      // any additional data that need to be stored goes in this object
      const additionalData = {}
      let resp;
      if (type == 'airdrop') resp = await airdropCommunityToken(payload, additionalData);
      else resp = await allocateTokenProposal(payload, additionalData);
        if (resp && resp.success) {
          setTimeout(() => {
            handleRefresh();
            handleClose();
          }, 1000);
          setSuccessMsg("Propose submitted");
          handleClickSuccess();
        }
        else {
          setErrorMsg("Error when making the request");
          handleClickError();
        }
      }
    }
    catch (e) {
      setErrorMsg("Error when making the request");
      handleClickError();
    }
  };
  useEffect(() => {
    if (community.CommunityAddress) {
      axios.get(`${URL()}/wallet/balanceOf`, {params: {address: community.CommunityAddress, token: community.TokenSymbol}}).then((res) => {
        const resp = res.data;
        if (resp && resp.success) {
          setAvailable(resp.amount);
        }
        else  setAvailable(0);
      })
    }
  }, [community.CommunityAddress])

  return (
    <Modal
        size="small"
        isOpen={open}
        onClose={handleClose}
        showCloseIcon
      >
        <>
          <SignatureRequestModal
            open={openSignRequestModal}
            address={user.address}
            transactionFee="0.0000"
            detail={signRequestModalDetail}
            handleOk={handleCreatePropose}
            handleClose={() => setOpenSignRequestModal(false)}
          />
          <Box mb={5}>
            <HeaderBold4>{type === "airdrop" ? "Make a new Airdrop Proposal" : "Make a new Allocation Proposal"} </HeaderBold4>
          </Box>
          <Box display="flex" flexDirection="column" mb={4}>
            <Header5>Address</Header5>
            <Input
              value={proposalData.address}
              onChange={handleChangeProposalData("address")}
            />
          </Box>
          <Box display="flex" flexDirection="column" mb={4}>
            <Header5>Amount</Header5>
            <Input
              value={proposalData.amount}
              onChange={handleChangeProposalData("amount")}
            />
            <Text size={FontSize.S} mt={1}>Available {available}</Text>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
            <PrimaryButton block size="medium" onClick={handleOpenSignatureModal}> Make Proposal</PrimaryButton>
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
        </>
    </Modal>

  )
}

export default CreateProposal;
