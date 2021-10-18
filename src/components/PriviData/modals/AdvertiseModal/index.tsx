import React, { useEffect, useState, useContext } from "react";
import Axios, { CancelTokenSource } from "axios";

import { FormControl, InputBase } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import { advertiseModalStyles } from './index.styles';
import { useAutoCompleteStyles } from "components/legacy/Profile/modals/AirdropTokensModal/AirdropTokensModal.styles";
import PriviDataContext from "shared/contexts/PriviDataContext";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import Box from 'shared/ui-kit/Box';
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

const addIcon = require("assets/icons/plus.svg");
const searchIcon = require("assets/icons/search.png");
const binIcon = require("assets/icons/remove_red.png");
const warningIcon = require("assets/icons/warning.png");

enum ContentTypes {
  communities = "Community",
  myMedias = "Media",
  digitalPods = "Digital Pods",
  myCredits = "Credit",
  pods = "FT Pods",
}

enum OpenType {
  Home = "HOME",
  Advertise = "ADVERTISE",
  BuyDATAp = "BUY DATAP",
}

export default function AdvertiseModal({ open, handleClose }) {
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);
  const userBalances = useTypedSelector(state => state.userBalances);
  const classes = advertiseModalStyles();

  const { setOpenTab } = useContext(PriviDataContext);

  const [page, setPage] = useState<number>(0);
  const [contentType, setContentType] = useState<string>("");
  const [contentOptions, setContentOptions] = useState<any[]>([]);
  const [content, setContent] = useState<any>({});
  const [contentSearchValue, setContentSearchValue] = useState<string>("");
  const [targetUsers, setTargetUsers] = useState<string[]>([]);
  const [userSearchValue, setUserSearchValue] = useState<string>("");
  const [cost, setCost] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());

  const autocompleteStyle = useAutoCompleteStyles();

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  let source: CancelTokenSource;

  useEffect(() => {
    if (userBalances && Object.keys(userBalances).length > 0) {
      const objectDATAp = Object.keys(userBalances).find(t => t === "DATAp");

      if (objectDATAp && userBalances[objectDATAp] && userBalances[objectDATAp].Balance) {
        setBalance(userBalances[objectDATAp].Balance);
      } else {
        setBalance(0);
      }
    }
  }, [userBalances]);

  useEffect(() => {
    setContent({});
    if (user && user.id) {
      if (source) {
        source.cancel();
      }
      source = Axios.CancelToken.source();

      const config = {
        cancelToken: source.token,
        params: {
          userId: user.id,
          isVisitor: false,
          mainTab:
            ContentTypes[contentType] === ContentTypes.communities ? "Social" : ContentTypes[contentType],
          subTab: "Owned",
          lastId: null,
          isLastNFT: true,
          pagination: 1,
          lastLikedMedia: "owner",
        },
      };

      //TODO: update backend function, currently not working
      Axios.get(`${URL()}/user/getProfileTapsInfo/`, config)
        .then(res => {
          const resp = res.data;

          if (resp.success) {
            const data = resp.data;

            let list = data[contentType].data;

            list.forEach((item, index) => {
              list[index].imageURL = "";
              if (ContentTypes[contentType] !== ContentTypes.myMedias) {
                list[index].imageURL = item.Url;
              } else {
                list[index].imageURL =
                  item.Type === "DIGITAL_ART_TYPE" && item.Url
                    ? `${item.Url}`
                    : item.Type !== "DIGITAL_ART_TYPE" && item.UrlMainPhoto
                    ? `${item.UrlMainPhoto}`
                    : "";
              }
            });

            setContentOptions(list);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [contentType]);

  useEffect(() => {
    //TODO: update cost
  }, [targetUsers, content]);

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
    if (!contentType || contentType === "") {
      setErrorMsg("Please select content type and content");
      handleClickError();
      return false;
    } else if (!content || Object.keys(content).length > 0) {
      setErrorMsg("Please select a content to advertise");
      handleClickError();
      return false;
    } else if (!targetUsers || targetUsers.length <= 0) {
      setErrorMsg("Please select at least one user to send the advertise");
      handleClickError();
      return false;
    } else if (cost > balance || balance === 0) {
      setErrorMsg("Insufficient balance");
      handleClickError();
      return false;
    } else return true;
  };

  const handleSubmit = () => {
    if (validate()) {
      //TODO: submit
      handleClickSuccess();
      setTimeout(() => {
        handleClose();
      }, 1000);
    }
  };

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon>
      <h5 className={classes.title}>Advertise Content</h5>
      <div className={classes.stepsBorder} />
      <div className={classes.steps}>
        {["Content Type", "Target Users", "Message"].map((tab, index) => (
          <div className={index <= page ? classes.selected : undefined} key={`tab-${index}`}>
            <button onClick={() => setPage(index)}>{index + 1}</button>
            <span>{tab}</span>
          </div>
        ))}
      </div>
      {page === 0 ? (
        <div className={classes.content}>
          <label>What type of content do you want to promote</label>
          <FormControl variant="outlined" className={classes.select}>
            <StyledSelect
              value={contentType}
              displayEmpty
              onChange={e => {
                setContentType(e.target.value as string);
              }}
            >
              <StyledMenuItem value="" disabled>
                Choose option
              </StyledMenuItem>
              {Object.keys(ContentTypes).map((item, index) => (
                <StyledMenuItem key={index} value={item}>
                  {ContentTypes[item]}
                </StyledMenuItem>
              ))}
            </StyledSelect>
          </FormControl>

          <label>Search by Name</label>
          <div className={classes.inputContainer}>
            <Autocomplete
              clearOnBlur
              freeSolo
              classes={autocompleteStyle}
              key={autocompleteKey}
              onChange={(event: any, newValue: any | null) => {
                if (newValue) {
                  setContent(newValue);
                  // reset search query
                  setAutocompleteKey(new Date().getTime());
                }
              }}
              options={contentOptions}
              renderOption={(option, { selected }) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 20px",
                    borderBottom: "1px solid #eff2f8",
                    margin: 0,
                    width: "100%",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        backgroundImage:
                          typeof option !== "string" && option.imageURL && option.imageURL !== ""
                            ? `url(${option.imageURL})`
                            : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        cursor: "pointer",
                        borderRadius: "10px",
                        width: "32px",
                        height: "32px",
                        border: "3px solid #ffffff",
                        filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.12))",
                        marginRight: "12px",
                      }}
                    />
                    <div
                      style={{
                        fontStyle: "normal",
                        fontWeight: "normal",
                        fontSize: "14px",
                        color: "#181818",
                        fontFamily: "Agrandir",
                      }}
                    >
                      {option.Name ?? option.Title ?? option.MediaName ?? option.name}
                    </div>
                  </div>
                </div>
              )}
              getOptionLabel={option => option.Name ?? option.Title ?? option.MediaName ?? option.name}
              renderInput={params => (
                <InputBase
                  value={contentSearchValue}
                  onChange={event => {
                    setContentSearchValue(event.target.value);
                  }}
                  ref={params.InputProps.ref}
                  inputProps={params.inputProps}
                  style={{ width: "100%" }}
                  autoFocus
                  placeholder="Search content"
                />
              )}
            />
          </div>

          {content && Object.keys(content).length > 0 && (
            <div className={classes.contentTile}>
              <Box display="flex" alignItems="center">
                <div
                  className={classes.userAvatar}
                  style={{
                    backgroundImage:
                      content.imageURL && content.imageURL !== "" ? `url(${content.imageURL})` : "none",
                    borderRadius: "4px",
                  }}
                />
                <Box color="#181818" fontSize="14px" fontFamily="Agrandir">
                  {content.Name ?? content.Title ?? content.MediaName ?? content.name}
                </Box>
              </Box>

              <img
                src={binIcon}
                alt="remove"
                onClick={() => {
                  setContent({});
                }}
              />
            </div>
          )}
        </div>
      ) : page === 1 ? (
        <div className={classes.content}>
          <label>Who would you like to send this promotion to?</label>
          <div className={classes.inputContainer}>
            <Autocomplete
              clearOnBlur
              freeSolo
              classes={autocompleteStyle}
              key={autocompleteKey}
              onChange={(event: any, newValue: any | null) => {
                if (newValue) {
                  const usersCopy = [...targetUsers];
                  usersCopy.push(newValue.address ?? newValue.id);
                  setTargetUsers(usersCopy);
                  // reset search query
                  setAutocompleteKey(new Date().getTime());
                }
              }}
              options={[...users.filter(user => !targetUsers.includes(user.address))]}
              renderOption={(option, { selected }) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 20px",
                    borderBottom: "1px solid #eff2f8",
                    margin: 0,
                    width: "100%",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        backgroundImage:
                          typeof option !== "string" && option.imageURL ? `url(${option.imageURL})` : "none",
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
                    <div
                      style={{
                        fontStyle: "normal",
                        fontWeight: "normal",
                        fontSize: "14px",
                        color: "#181818",
                        fontFamily: "Agrandir",
                      }}
                    >
                      @{option.urlSlug && !option.urlSlug.includes("Px") ? option.urlSlug : option.name}
                    </div>
                  </div>
                  <img src={addIcon} alt={"add"} style={{ width: "16px", height: "16px" }} />
                </div>
              )}
              getOptionLabel={option =>
                `@${option.urlSlug && !option.urlSlug.includes("Px") ? option.urlSlug : option.name}`
              }
              getOptionSelected={option => option.address === targetUsers[0] || option.id === targetUsers[0]}
              renderInput={params => (
                <InputBase
                  value={userSearchValue}
                  onChange={event => {
                    setUserSearchValue(event.target.value);
                  }}
                  ref={params.InputProps.ref}
                  inputProps={params.inputProps}
                  style={{ width: "100%" }}
                  autoFocus
                  placeholder="Search users"
                />
              )}
            />
            <img src={searchIcon} alt={"search"} />
          </div>

          {targetUsers && targetUsers.length > 0 && (
            <Box display="flex" flexDirection="column" width="100%">
              {targetUsers.map((user, index) => {
                const thisUser = users.find(u => u.address === user || u.id === user);

                if (thisUser)
                  return (
                    <div className={classes.userTile}>
                      <Box display="flex" alignItems="center">
                        <div
                          className={classes.userAvatar}
                          style={{
                            backgroundImage:
                              thisUser.imageURL && thisUser.imageURL !== ""
                                ? `url(${thisUser.imageURL})`
                                : "none",
                          }}
                        />
                        <Box color="#181818" fontSize="14px" fontFamily="Agrandir">
                          {`@${
                            thisUser.urlSlug && !thisUser.urlSlug.includes("Px")
                              ? thisUser.urlSlug
                              : thisUser.name
                          }`}
                        </Box>
                      </Box>

                      <img
                        src={binIcon}
                        alt="remove"
                        onClick={() => {
                          let newUsers = [...targetUsers];
                          newUsers.splice(index, 1);
                          setTargetUsers(newUsers);
                        }}
                      />
                    </div>
                  );
                else return null;
              })}
            </Box>
          )}

          <div className={classes.cost}>
            <Box display="flex" justifyContent="space-between" width="100%">
              <label>Cost</label>

              <Box display="flex" flexDirection="column" alignItems="flex-end">
                <Box fontSize="22px" color="#181818" marginBottom="8px">
                  DATAp {cost.toFixed(2)}
                </Box>
                <Box fontSize="14px" color="#707582">
                  (DATAp {targetUsers.length > 0 ? (cost / targetUsers.length).toFixed(2) : cost.toFixed(2)}{" "}
                  per user)
                </Box>
              </Box>
            </Box>
            {(cost > balance || balance === 0) && (
              <Box color="#707582" fontSize="14px" display="flex" alignItems="center" marginTop="20px">
                <img src={warningIcon} alt="warning" />
                You don’t have enough DATAp
                <span
                  onClick={() => {
                    handleClose();
                    setOpenTab(OpenType.BuyDATAp);
                  }}
                >
                  Buy DATAp using Privi
                </span>
              </Box>
            )}
          </div>
        </div>
      ) : (
        <div className={classes.content}>
          <label>Add a message (optional)</label>
          <textarea
            value={message}
            onChange={e => {
              setMessage(e.target.value);
            }}
          />
        </div>
      )}

      <div className={classes.buttons}>
        {page !== 0 ? (
          <SecondaryButton
            onClick={() => {
              setPage(page - 1);
            }}
            size="medium"
          >
            Back
          </SecondaryButton>
        ) : (
          <div />
        )}
        <PrimaryButton
          onClick={() => {
            page !== 2 ? setPage(page + 1) : handleSubmit;
          }}
          size="medium"
          disabled={
            (page === 0 && (contentType === "" || !content)) ||
            (page === 1 && (targetUsers.length <= 0 || cost > balance || balance === 0))
          }
        >
          {page !== 2 ? "Continue" : "Submit"}
        </PrimaryButton>
      </div>

      {openSuccess && (
        <AlertMessage
          key={Math.random()}
          message={"Advertise sent correctly!"}
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
}
