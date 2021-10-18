import React, { useEffect, useState } from "react";
import axios from "axios";

import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import Alert from "@material-ui/lab/Alert";

import { sendContributionModalStyles } from "./SendContributionModal.styles";
import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { signTransaction } from "shared/functions/signTransaction";
import { formatNumber, handleSetStatus } from "shared/functions/commonFunctions";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from 'shared/ui-kit/Box';

const SendContributionModal = (props: any) => {
  const classes = sendContributionModalStyles();

  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);
  const [communities, setCommunities] = useState<any[]>([]);
  const [selectedCommunities, setSelectedCommunities] = useState<any[]>([]);
  const [tokenObjs, setTokenObjs] = useState<any[]>([]);

  const [token, setToken] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [status, setStatus] = React.useState<any>("");
  const [isCommunityLoading, setIsCommunityLoading] = useState<boolean>(false);
  const [isTokenLoading, setIsTokenLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsCommunityLoading(true);
    axios
      .get(`${URL()}/community/getAllCommunities`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          const newCommunities: any[] = [];
          resp.communities.forEach(community => {
            if (community.CommunityAddress && (community.Name || community.TokenName))
              newCommunities.push(community);
          });
          setCommunities(newCommunities);
        }
        setIsCommunityLoading(false);
      })
      .catch(err => {
        console.log("=================", err);
        setIsCommunityLoading(false);
      });
    setIsTokenLoading(true);
    axios
      .get(`${URL()}/wallet/getCryptosRateAsList`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          const tokenObjList: any[] = [];
          const data = resp.data;
          data.forEach(rateObj => {
            tokenObjList.push({ token: rateObj.token, name: rateObj.token });
          });
          setTokenObjs(tokenObjList);
          setToken(tokenObjList[0].token);
        }
        setIsTokenLoading(false);
      })
      .catch(err => {
        console.log("=================", err);
        setIsTokenLoading(false);
      });
  }, []);

  useEffect(() => {
    setSelectedCommunities([]);
  }, [props.open]);

  const addCommunity = (_, community) => {
    if (community) {
      const existCommunity = selectedCommunities.find(
        comm => comm.CommunityAddress === community.CommunityAddress
      );
      if (!existCommunity) {
        setSelectedCommunities(prev => [...prev, community]);
      }
    }
  };

  const removeCommunity = community => {
    setSelectedCommunities(prev => prev.filter(comm => comm.CommunityAddress !== community.CommunityAddress));
  };

  const sendContribution = async () => {
    if (validate()) {
      const promises: any[] = [];
      for (let i = 0; i < selectedCommunities.length; i++) {
        const community = selectedCommunities[i];
        const body: any = {
          Token: token,
          From: user.address,
          To: community.CommunityAddress,
          Amount: Number(amount),
          Type: "Contribution",
        };
        const [hash, signature] = await signTransaction(user.mnemonic, body);
        body.Hash = hash;
        body.Signature = signature;
        promises.push(axios.post(`${URL()}/wallet/transfer`, body));
      }
      Promise.all(promises).then(responses => {
        let sentContributions = 0;
        responses.forEach(res => {
          if (res?.data?.success) sentContributions++;
        });
        // all sent
        if (sentContributions == responses.length) {
          handleSetStatus(`Contribution sent to all ${sentContributions} communities`, "success", setStatus);
          setTimeout(() => props.handleClose(), 1000);
        }
        // some request failed
        else {
          handleSetStatus(
            `Failed to send contribution to ${responses.length - sentContributions} (of ${
              responses.length
            }) communties`,
            "error",
            setStatus
          );
        }
      });
    }
  };

  const validate = (): boolean => {
    if (!userBalances[token] || userBalances[token].Balance < Number(amount) * selectedCommunities.length) {
      handleSetStatus(`Insufficient ${token} balance`, "error", setStatus);
      return false;
    }
    return true;
  };

  return (
    <Modal
      size="small"
      isOpen={props.open}
      onClose={props.handleClose}
      className={classes.root}
      showCloseIcon
    >
      <div className={classes.modalContent}>
        <h4>Contribute to a community</h4>
        <Box mb={4} mt={4} display="flex" flexDirection="column">
          <h5>Search for communities</h5>
          <LoadingWrapper loading={isCommunityLoading}>
            <>
              <Autocomplete
                id="send-contribution-searcher"
                className={classes.autoCompleteRoot}
                freeSolo
                clearOnBlur
                // key={autoCompleteKey}
                onChange={addCommunity}
                renderOption={option => <CommunityItem community={option} handleAdd={() => null} />}
                options={communities}
                getOptionLabel={option => option?.Name ?? option?.TokenName}
                renderInput={params => (
                  <TextField
                    {...params}
                    placeholder="Search community"
                    className={classes.autoCompleteInput}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 19 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.4697 18.733C17.7626 19.0259 18.2374 19.0259 18.5303 18.733C18.8232 18.4401 18.8232 17.9652 18.5303 17.6723L17.4697 18.733ZM15.25 8.70264C15.25 12.4306 12.2279 15.4526 8.5 15.4526V16.9526C13.0563 16.9526 16.75 13.259 16.75 8.70264H15.25ZM8.5 15.4526C4.77208 15.4526 1.75 12.4306 1.75 8.70264H0.25C0.25 13.259 3.94365 16.9526 8.5 16.9526V15.4526ZM1.75 8.70264C1.75 4.97471 4.77208 1.95264 8.5 1.95264V0.452637C3.94365 0.452637 0.25 4.14629 0.25 8.70264H1.75ZM8.5 1.95264C12.2279 1.95264 15.25 4.97471 15.25 8.70264H16.75C16.75 4.14629 13.0563 0.452637 8.5 0.452637V1.95264ZM18.5303 17.6723L14.3428 13.4847L13.2821 14.5454L17.4697 18.733L18.5303 17.6723Z"
                            fill="#727F9A"
                          />
                        </svg>
                      ),
                    }}
                  />
                )}
              />
              {selectedCommunities.length ? (
                <Box width={1} mt={2} maxHeight={200} overflow="auto">
                  {selectedCommunities.map((community, index) => (
                    <CommunityItem community={community} selected handleItem={removeCommunity} />
                  ))}
                </Box>
              ) : null}
            </>
          </LoadingWrapper>
        </Box>
        <LoadingWrapper loading={isTokenLoading}>
          <>
            <Box mb={1} display="flex" flexDirection="row" alignItems="flex-end">
              <Box width={0.7} pr={0.5}>
                <h5>Contribution amount</h5>
                <TextField
                  variant="outlined"
                  className={classes.formControlInput}
                  size="small"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </Box>
              <Box width={0.3} pl={0.5}>
                <TokenSelect
                  tokens={tokenObjs}
                  value={token}
                  onChange={e => {
                    setToken(e.target.value);
                  }}
                />
              </Box>
            </Box>
            <Box mb={4}>
              <span className={classes.textColorGrey}>
                Available: {formatNumber(userBalances[token] ? userBalances[token].Balance : 0, token, 4)}
              </span>
            </Box>
          </>
        </LoadingWrapper>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <SecondaryButton size="medium" onClick={props.handleClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton size="medium" onClick={sendContribution}>
            Send Contribution
          </PrimaryButton>
        </Box>
        {status && <Alert severity={status.variant}>{status.msg}</Alert>}
      </div>
    </Modal>
  );
};

const CommunityItem = (props: any) => {
  const classes = sendContributionModalStyles();

  return (
    <Box
      className={classes.communityItem}
      width={1}
      p={2}
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box display="flex" flexDirection="row" alignItems="center">
        <div
          style={{
            backgroundImage: props.community.HasPhoto ? `url(${props.community.Url}?${Date.now()})` : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            cursor: "pointer",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            border: "3px solid #ffffff",
            filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.12))",
            marginRight: "12px",
          }}
        />
        <span className={classes.textBold}>{props.community.Name}</span>
      </Box>
      <img
        src={props.selected ? require("assets/icons/delete_red.svg") : require("assets/icons/add_green.svg")}
        onClick={() => props.handleItem(props.community)}
      />
    </Box>
  );
};

export default SendContributionModal;
