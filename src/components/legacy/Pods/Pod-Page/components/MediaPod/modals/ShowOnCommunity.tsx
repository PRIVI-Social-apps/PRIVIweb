import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import { Grid, makeStyles, Modal, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import "./ShowOnCommunity.css";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import Box from 'shared/ui-kit/Box';

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  autoCompleteRoot: {
    fontFamily: "Agrandir",
    paddingLeft: 20,
    paddingRight: 16,
    height: 56,
    width: "100%",
    display: "flex",
    marginTop: 10,
    alignItems: "center",
    background: "#F7F9FE",
    border: "1px solid #E0E4F3",
    borderRadius: 8,
    color: "#707582",
    fontSize: 14,
  },
  autoCompleteInput: {
    "& .MuiInputBase-root": {
      paddingRight: 0,
    },
  },
  communityItem: {
    borderBottom: "1px solid #EFF2F8",
    "& span": {
      fontSize: 14,
    },
  },
  formControlInput: {
    width: "100%",
    "& div.MuiOutlinedInput-root": {
      background: "#F7F9FE",
      border: "1px solid #E0E4F3",
      borderRadius: 8,
      color: "#707582",
      height: 40,
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
    },
  },
}));

const ShowOnCommunity = (props: any) => {
  const styles = useStyles();
  const userSelector = useSelector((state: RootState) => state.user);

  const [step, setStep] = useState(0);

  const [communities, setCommunities] = useState<any[]>([]);
  const [selectedCommunities, setSelectedCommunities] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [revenues, setRevenues] = useState<any>({});

  const [status, setStatus] = useState<any>("");
  const [isDataLoading, setIsDataLoading] = useState(false);

  useEffect(() => {
    console.log("mediaType", props.mediaType);
    setIsDataLoading(true);
    axios
      .get(`${URL()}/community/getAllCommunities`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          setCommunities(resp.communities);
        }
        setIsDataLoading(false);
      })
      .catch(err => {
        setIsDataLoading(false);
      });
  }, []);

  useEffect(() => {
    setMessage("");
    setRevenues({});
    setSelectedCommunities([]);
  }, [props.open]);

  const onRevenueChange = communityAddress => e => {
    e.persist();

    setRevenues(prev => ({
      ...prev,
      [communityAddress]: e.target.value,
    }));
  };

  const addCommunity = (event, community) => {
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
    const newRevenues = delete revenues[community.CommunityAddress];
    setRevenues(newRevenues);
  };

  const confirmSubmit = () => {
    let body: any = {
      media: props.mediaId,
      mediaType: props.mediaType,
      pod: props.podId,
      message: message,
      offers: revenues,
    };
    axios
      .post(`${URL()}/mediaOnCommunity/create/${userSelector.id}`, body)
      .then(response => {
        if (response.data.success) {
          setStatus({
            msg: "Request done!",
            key: Math.random(),
            variant: "success",
          });
          setStep(0);
          props.handleClose();
        } else {
          setStatus({
            msg: response.data.error,
            key: Math.random(),
            variant: "error",
          });
        }
      })
      .catch(error => {
        setStatus({
          msg: "Error making the request",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  return (
    <Modal open={props.open} onClose={props.handleClose} className={styles.modal}>
      <div className="show-on-community">
        {step === 0 ? (
          <>
            <Box display="flex" flexDirection="row" justifyContent="flex-end">
              <img
                src={require("assets/icons/cross_gray.png")}
                style={{ cursor: "pointer" }}
                onClick={props.handleClose}
              />
            </Box>
            <Box display="flex" flexDirection="row" justifyContent="center">
              <img src={require("assets/icons/community.png")} />
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <h3>Show Media On A Community</h3>
              <h5 className="text-color-grey text-center">
                Offer your Media on a community that you think may be a good fit for your content.
              </h5>
            </Box>
            <Box mt={4} mb={2} display="flex" flexDirection="column" alignItems="center">
              <h5>Search for communities</h5>
              <LoadingWrapper loading={isDataLoading}>
                <>
                  <Autocomplete
                    id="show-community-searcher"
                    className={styles.autoCompleteRoot}
                    freeSolo
                    clearOnBlur
                    // key={autoCompleteKey}
                    onChange={addCommunity}
                    renderOption={option => (
                      <CommunityItem community={option} handleAdd={() => null} handleItem={() => {}} />
                    )}
                    options={communities}
                    getOptionLabel={option => option?.Name || ""}
                    renderInput={params => (
                      <TextField
                        {...params}
                        placeholder="Search community"
                        className={styles.autoCompleteInput}
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
                  <Box mt={2} width={1} maxHeight={300} overflow="auto">
                    {selectedCommunities.map((community, index) => (
                      <CommunityItem community={community} selected handleItem={removeCommunity} />
                    ))}
                  </Box>
                </>
              </LoadingWrapper>
            </Box>
          </>
        ) : (
          <>
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={2}>
              <h4>{step === 1 ? "Sell Media On A Community" : "Summary"}</h4>
              <img src={require("assets/icons/cross_gray.png")} onClick={props.handleClose} />
            </Box>
            <Box mb={step === 1 ? 4 : 8}>
              <h5>Message</h5>
              {step === 1 ? (
                <TextField
                  variant="outlined"
                  className={styles.formControlInput}
                  multiline
                  rows={5}
                  size="small"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              ) : (
                <span className="text-color-grey">{message}</span>
              )}
            </Box>
            {step === 1 ? null : <div className="solid-border" />}
            {step === 1 ? (
              <Box mb={3}>
                <h5 className="text-bold">Offer</h5>
                <span className="text-color-grey">
                  Indicate the commission (%) that you will offer to the community. This commission will be
                  generated by the media’s revenue inside the community.
                </span>
              </Box>
            ) : null}
            <Box mb={3}>
              <Box mb={1}>
                <h5>{step === 1 ? "Commision (%) on revenue" : "Commision (%) on revenue offer"}</h5>
              </Box>
              <Box maxHeight={300} overflow="auto">
                <LoadingWrapper loading={isDataLoading}>
                  <Grid container spacing={2} wrap="wrap">
                    {selectedCommunities.map(community => (
                      <Grid item md={6}>
                        <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
                          <div
                            style={{
                              backgroundImage: community.HasPhoto
                                ? `url(${community.Url}?${Date.now()})`
                                : "none",
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
                          <span className="text-bold">{community.Name}</span>
                        </Box>
                        {step === 1 ? (
                          <TextField
                            variant="outlined"
                            className={styles.formControlInput}
                            size="small"
                            placeholder={"%"}
                            value={revenues[community.CommunityAddress] || ""}
                            onChange={onRevenueChange(community.CommunityAddress)}
                          />
                        ) : (
                          <h4 className="text-color-grey">{revenues[community.CommunityAddress]}%</h4>
                        )}
                      </Grid>
                    ))}
                  </Grid>
                </LoadingWrapper>
              </Box>
            </Box>
            {step === 1 ? null : <div className="solid-border" />}
          </>
        )}
        <LoadingWrapper loading={isDataLoading}>
          <>
            {selectedCommunities.length ? (
              <div className="buttonLayout">
                <div className="leftButtonLayout">
                  <button className="secondary" onClick={props.handleClose}>
                    Cancel
                  </button>
                </div>
                <div className="rightButtonLayout">
                  {step > 0 ? (
                    <button className="secondary" onClick={() => setStep(prev => prev - 1)}>
                      Back
                    </button>
                  ) : null}
                  {step < 2 ? (
                    <button onClick={() => setStep(prev => prev + 1)}>Next</button>
                  ) : (
                    <button onClick={confirmSubmit}>Confirm And Submit</button>
                  )}
                </div>
              </div>
            ) : null}
          </>
        </LoadingWrapper>
        {status && (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
            onClose={() => setStatus(undefined)}
          />
        )}
      </div>
    </Modal>
  );
};

const CommunityItem = (props: any) => {
  const styles = useStyles();

  return (
    <Box className={styles.communityItem} width={1} p={2}>
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
        <span className="text-bold">{props.community.Name}</span>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" my={1}>
        <div className="dash-border" />
        <img
          src={
            props.selected ? require("assets/icons/delete_red.svg") : require("assets/icons/add_green.svg")
          }
          onClick={() => props.handleItem(props.community)}
        />
      </Box>
      <Box display="flex" flexDirection="row">
        <Box width={1} display="flex" flexDirection="column">
          <span className="text-bold text-color-grey">Community members</span>
          <span className="text-color-grey">{props.community?.Members?.length || 0}</span>
        </Box>
        <Box width={1} display="flex" flexDirection="column">
          <span className="text-bold text-color-grey">Creds distributed</span>
          <span className="text-color-grey">0</span>
        </Box>
      </Box>
    </Box>
  );
};

export default ShowOnCommunity;
