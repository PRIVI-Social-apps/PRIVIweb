import React, { useState, useRef, useEffect } from "react";
import { Color, Modal } from "shared/ui-kit";
import { Box, InputAdornment } from "@material-ui/core";
import { useTypedSelector } from "store/reducers/Reducer";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { airdropCommunityToken, allocateTokenProposal } from "shared/services/API";
import axios from "axios";
import URL from "shared/functions/getURL";
import { TitleGrandLight } from "../../../index.styles";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

// Create Airdrop or Allocation proposal
const CreateProposal = ({ type, open, handleClose, handleRefresh, community }) => {
  //REDUX
  const user = useTypedSelector(state => state.user);

  const [proposalData, setProposalData] = useState<any>({
    amount: "",
    address: "",
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
        CommunityId: community.CommunityAddress,
        Addresses: { [proposalData.address]: proposalData.amount },
      };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    }
  };

  const handleCreatePropose = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        // any additional data that need to be stored goes in this object
        const additionalData = {};
        let resp;
        if (type == "airdrop") resp = await airdropCommunityToken(payload, additionalData);
        else resp = await allocateTokenProposal(payload, additionalData);
        if (resp && resp.success) {
          setTimeout(() => {
            handleRefresh();
            handleClose();
          }, 1000);
          setSuccessMsg("Propose submitted");
          handleClickSuccess();
        } else {
          setErrorMsg("Error when making the request");
          handleClickError();
        }
      }
    } catch (e) {
      setErrorMsg("Error when making the request");
      handleClickError();
    }
  };
  useEffect(() => {
    if (community.CommunityAddress) {
      axios
        .get(`${URL()}/wallet/balanceOf`, {
          params: { address: community.CommunityAddress, token: community.TokenSymbol },
        })
        .then(res => {
          const resp = res.data;
          if (resp && resp.success) {
            setAvailable(resp.amount);
          } else setAvailable(0);
        });
    }
  }, [community.CommunityAddress]);

  return (
    <Modal size="small" isOpen={open} onClose={handleClose} showCloseIcon theme="dark">
      <>
        <SignatureRequestModal
          theme="dark"
          open={openSignRequestModal}
          address={user.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={handleCreatePropose}
          handleClose={() => setOpenSignRequestModal(false)}
        />
        <TitleGrandLight mb={3} disableUppercase>
          {type === "airdrop" ? "Make a new Airdrop Proposal" : "Make a new Allocation Proposal"}
        </TitleGrandLight>
        <Box mb={3}>
          <InputWithLabelAndTooltip
            theme="dark"
            inputValue={proposalData.address}
            onInputValueChange={handleChangeProposalData("address")}
            labelName={"Address"}
            placeHolder={"0x.........."}
            type="text"
            tooltip={`Type an address to make an ${
              type === "airdrop" ? "Airdrop" : "Allocation"
            } proposal to`}
          />
        </Box>

        <Box mb={3} color="white" fontFamily="Agrandir">
          <InputWithLabelAndTooltip
            theme="dark"
            inputValue={proposalData.amount}
            onInputValueChange={handleChangeProposalData("amount")}
            labelName={"Amount"}
            placeHolder={"0.10"}
            minValue={"0.001"}
            type="number"
            tooltip={`Type an amount`}
            endAdornment={<InputAdornment position="end">{community.TokenSymbol}</InputAdornment>}
          />
          <Box fontSize="14px" color={Color.White} mt={1}>
            Available {available}
          </Box>
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="flex-end">
          <DAOButton onClick={handleOpenSignatureModal}>Make Proposal</DAOButton>
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
  );
};

export default CreateProposal;
