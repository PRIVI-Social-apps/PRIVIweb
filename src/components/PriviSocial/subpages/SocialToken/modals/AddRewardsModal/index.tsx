import React, { useEffect, useState } from "react";
import { Modal, PriviSocialButton, Color } from "shared/ui-kit";

import { Autocomplete } from "@material-ui/lab";
import { createStyles, makeStyles, InputBase } from "@material-ui/core";
import { useTypedSelector } from "store/reducers/Reducer";
import Axios, { CancelTokenSource } from "axios";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

const searchIcon = require("assets/icons/search_gray.png");

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "auto !important",
    },
    content: {
      width: "610px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      "& h4": {
        fontWeight: 800,
        fontSize: "22px",
        color: Color.GrayDark,
        margin: "12px 0px 8px",
      },
      "& h5": {
        fontWeight: 800,
        fontSize: "18px",
        color: Color.GrayDark,
        margin: "0px 0px 18px",
      },
      "& label": {
        width: "100%",
        fontWeight: 800,
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        color: Color.GrayDark,
        marginBottom: "11px",
        marginTop: "5px",
        "& img": {
          marginLeft: "5px",
          width: "12px",
          height: "12px",
        },
      },
    },
    perkImage: {
      height: "155px",
      width: "239px",
      borderRadius: "10px",
      marginBottom: "27px",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    inputContainer: {
      display: "flex",
      alignItems: "center",
      background: "#F7F9FE",
      border: "1px solid #E0E4F3",
      boxSizing: "border-box",
      borderRadius: "6px",
      marginBottom: "27px",
      width: "100%",
      color: "#707582",
      padding: "12.5px 20px 10.5px",
      "& input": {
        padding: "0",
        fontSize: "14px",
        fontFamily: "Agrandir",
      },
      "& img": {
        margin: "0",
        width: "17px",
        height: "17px",
      },
    },
  })
);

export default function AddRewardsModal({ open, handleClose, perk }) {
  //HOOKS
  const classes = useStyles();
  const autocompleteStyle = useAutoCompleteStyles();
  const user = useTypedSelector(state => state.user);

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  let source: CancelTokenSource;

  const [nftsAndBadgesList, setNftsAndBadgesList] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [reward, setReward] = useState<any>({});

  useEffect(() => {
    if (user && user.id && open) {
      getMediasAndBadges();
    }
  }, [user, open]);

  const getMediasAndBadges = async () => {
    if (source) {
      source.cancel();
    }
    source = Axios.CancelToken.source();
    const config = {
      cancelToken: source.token,
      params: {
        userId: user.id,
        isVisitor: false,
        mainTab: "Media",
        subTab: "Owned",
        lastId: null,
        isLastNFT: true,
        pagination: 1,
        lastLikedMedia: "owner",
      },
    };

    try {
      const response = await Axios.get<any>(`${URL()}/user/getProfileTapsInfo`, config);
      const resp = response.data;

      console.log(resp);

      const mediasAndBadges = [] as any;

      if (resp.success) {
        const data = resp.data;
        //MEDIA
        const newMedias = data?.myMedias?.data ?? [];
        let medias = [...newMedias];
        medias.forEach((m, index) => {
          m.ImageUrl = m.HasPhoto
            ? `${URL()}/media/getMediaMainPhoto/${m.MediaSymbol.replace(/\s/g, "")}`
            : undefined;

          mediasAndBadges.push(m);
        });

        if (user.badges && user.badges.length > 0) {
          user.badges.forEach(b => {
            mediasAndBadges.push({
              ...b,
              ImageUrl: b.Symbol ? `${URL()}/user/badges/getPhoto/${b.Symbol}` : undefined,
            });
          });
        }

        setNftsAndBadgesList(mediasAndBadges);
      }
    } catch (error) {
      if (Axios.isCancel(error)) {
        console.log("Request canceled");
      } else {
        console.log("cancel error");
        setErrorMsg("Error getting user info");
        handleClickError();
      }
      // eslint-disable-next-line no-throw-literal
      throw error;
    }
  };

  const handleAddReward = () => {
    //TODO: add reward
    setSuccessMsg("Reward added!");
    handleClickSuccess();
    handleClose();
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

  if (open && perk)
    return (
      <Modal className={classes.root} size="medium" isOpen={open} onClose={handleClose} showCloseIcon>
        <div className={classes.content}>
          <h4>Add reward</h4>
          <h5>Add reward for your perks</h5>
          <div
            className={classes.perkImage}
            style={{
              backgroundImage: perk.ImageURL && perk.ImageURL !== "" ? `url(${perk.ImageURL})` : "none",
            }}
          />
          <h5>{perk.Title ?? ""}</h5>

          <label>
            Reward <img src={require("assets/icons/info.png")} alt="info" />
          </label>

          <div className={classes.inputContainer}>
            <Autocomplete
              clearOnBlur
              freeSolo
              classes={autocompleteStyle}
              onChange={(event: any, newValue: any | null) => {
                if (newValue) {
                  setReward(newValue);
                }
              }}
              options={nftsAndBadgesList}
              renderOption={(option, { selected }) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 20px",
                    margin: 0,
                    width: "100%",
                    backgroundColor: selected ? "#F7F9FE" : "transparent",
                  }}
                >
                  <div
                    style={{
                      backgroundImage:
                        typeof option !== "string" && option.ImageURL ? `url(${option.ImageURL})` : "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      cursor: "pointer",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.12))",
                      marginRight: "9px",
                    }}
                  />
                  <div
                    style={{
                      fontStyle: "normal",
                      fontWeight: "normal",
                      fontSize: "14px",
                      color: "#707582",
                      fontFamily: "Agrandir",
                    }}
                  >
                    {option.MediaName ?? option.Name ?? option.Symbol}
                  </div>
                </div>
              )}
              getOptionLabel={option => option.MediaName ?? option.Name ?? option.Symbol}
              getOptionSelected={option => option === reward}
              renderInput={params => (
                <InputBase
                  value={searchValue}
                  onChange={event => {
                    setSearchValue(event.target.value);
                    if (searchValue === "") {
                      setReward(null);
                    }
                  }}
                  ref={params.InputProps.ref}
                  inputProps={params.inputProps}
                  style={{ width: "100%" }}
                  autoFocus
                  placeholder="Search for one of your NFTs including Badges"
                />
              )}
            />
            <img src={searchIcon} alt={"search"} />
          </div>

          <PriviSocialButton onClick={handleAddReward} size="medium">
            Add Reward
          </PriviSocialButton>
        </div>

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
  else return null;
}

const useAutoCompleteStyles = makeStyles({
  root: {
    width: "100%",
  },
  listbox: {
    maxHeight: 168,
  },
  option: {
    height: 52,
  },
});
