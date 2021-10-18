import React, { useEffect, useRef, useState } from "react";
import { Modal, PriviSocialButton, Color } from "shared/ui-kit";

import { createStyles, makeStyles, InputBase, Grid } from "@material-ui/core";
import { useTypedSelector } from "store/reducers/Reducer";
import Axios, { CancelTokenSource } from "axios";
import URL from "shared/functions/getURL";
import { Autocomplete } from "@material-ui/lab";
import { TimeInput } from "shared/ui-kit/TimeInput";
import { DateInput } from "shared/ui-kit/DateTimeInput";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

const imageIcon = require("assets/icons/image_icon_dark.png");
const searchIcon = require("assets/icons/search_gray.png");

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "892px !important",
    },
    content: {
      widtg: "100%",
      display: "flex",
      flexDirection: "column",
      "& button": {
        alignSelf: "flex-end",
      },
      "& h4": {
        fontWeight: 800,
        fontSize: "22px",
        color: Color.GrayDark,
        margin: "0px 0px 8px",
      },
      "& h5": {
        fontWeight: 800,
        fontSize: "18px",
        color: Color.GrayDark,
        margin: "0px 0px 38px",
      },
      "& h6": {
        fontWeight: 800,
        fontSize: "18px",
        color: Color.GrayDark,
        margin: "0px 0px 32px",
      },
      "& label": {
        width: "100%",
        fontWeight: 800,
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        color: Color.GrayDark,
        marginBottom: "10px",
        marginTop: "0px",
        "& span": {
          marginLeft: "5px",
          color: "#ABB3C4",
        },
        "& img": {
          marginLeft: "5px",
          width: "12px",
          height: "12px",
        },
      },
      "& input": {
        display: "flex",
        background: "#F7F9FE",
        border: "1px solid #E0E4F3",
        boxSizing: "border-box",
        borderRadius: "6px",
        marginBottom: "28px",
        width: "100%",
        color: "#707582",
        padding: "12.5px 20px 10.5px",
      },
      "& .MuiInput-root": {
        marginBottom: "28px",
        "& input": {
          margin: "0px",
          fontSize: "14px",
          fontFamily: "Agrandir",
          background: "transparent",
          padding: "0px",
          border: "none",
        },
        "& button": {
          alignSelf: "auto",
          background: "#FFFFFF",
          border: "1px solid #C0C6DC",
          boxSizing: "border-box",
          borderRadius: "0px 6px 6px 0px",
          padding: "7px 8px !important",
          marginRight: "-14px !important",
          height: "auto !important",
          "& img": {
            height: "16px",
          },
        },
      },
      "& .imageSquareImgTitleDesc": {
        height: "335px !important",
      },
      "& .dragImageHereImgTitleDesc": {
        alignItems: 'center',
        height: "335px",
      },
    },
    inputContainer: {
      display: "flex",
      alignItems: "center",
      background: "#F7F9FE",
      border: "1px solid #E0E4F3",
      boxSizing: "border-box",
      borderRadius: "6px",
      marginBottom: "28px",
      width: "100%",
      color: "#707582",
      padding: "12.5px 20px 10.5px",
      "& input": {
        margin: "0px",
        fontSize: "14px",
        fontFamily: "Agrandir",
        background: "transparent",
        padding: "0px",
        border: "none",
      },
      "& img": {
        margin: "0",
        width: "17px",
        height: "17px",
      },
    },
  })
);

export default function AddPerksModal({ open, handleClose, socialToken, handleRefresh }) {
  //HOOKS
  const classes = useStyles();
  const autocompleteStyle = useAutoCompleteStyles();
  const user = useTypedSelector(state => state.user);

  const inputRef = useRef<any>();

  const [perk, setPerk] = useState<any>({
    Title: "",
    Cost: "",
    Quantity: "",
    Description: "",
    HasPhoto: false,
    StartDate: new Date(),
    EndDate: new Date(),
  });
  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  let source: CancelTokenSource;

  const [nftsAndBadgesList, setNftsAndBadgesList] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [reward, setReward] = useState<any>({});

  const handleStartDateChange = (date: Date | null) => {
    setPerk({
      ...perk,
      StartDate: date,
    });
  };
  const handleEndDateChange = (date: Date | null) => {
    setPerk({
      ...perk,
      EndDate: date,
    });
  };

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

  const handleAddPerk = async () => {
    if (verify()) {
      try {
        const addRes = await Axios.post(`${URL()}/social/addPerk/${socialToken.PoolAddress}`, { ...perk, Reward: reward });
        if (addRes.data.success) {
          const newPerk = addRes.data.data;
          if (photo) {
            const formData = new FormData();
            formData.append("image", photo, newPerk.id);
            const config = {
              headers: {
                "content-type": "multipart/form-data",
              },
            };
            await Axios.post(`${URL()}/social/changePerkPhoto/${socialToken.PoolAddress}/${newPerk.id}`, formData, config);
          }
          setSuccessMsg("Perk Created!");
          handleRefresh();
        }
      } catch (err) {

      }
    }
    // handleClickSuccess();
    // handleClose();
  };

  const verify = () => {
    if (!perk.Title || perk.Title === "") {
      setErrorMsg("Name field invalid. Please fill in the value.");
      handleClickError();
      return false;
    } else if (!perk.Cost || perk.Cost === "" || Number(perk.Cost) <= 0) {
      setErrorMsg("Cost field invalid. Please fill in the value. Cost Can't be less than 0.");
      handleClickError();
      return false;
    } else if (!perk.Quantity || perk.Quantity === "" || Number(perk.Quantity) <= 0) {
      setErrorMsg("Quantity field invalid. Please fill in the value. Quantity Can't be less than 0.");
      handleClickError();
      return false;
    } else if (!perk.Description || perk.Description === "") {
      setErrorMsg("Description field invalid. Please fill in the value.");
      handleClickError();
      return false;
    } else if (
      !perk.StartDate ||
      perk.StartDate === "" ||
      new Date(perk.StartDate).getTime() < new Date().getTime()
    ) {
      setErrorMsg(
        "Start date field invalid. Please fill in the value. Start date can't be inferior than current date"
      );
      handleClickError();
      return false;
    } else if (
      !perk.EndDate ||
      perk.EndDate === "" ||
      new Date(perk.EndDate).getTime() < new Date(perk.StartDate).getTime()
    ) {
      setErrorMsg(
        "Start date field invalid. Please fill in the value. End date date can't be inferior than Start date"
      );
      handleClickError();
      return false;
    } else return true;
  };

  const onPhotoChange = (files: any) => {
    setPhoto(files[0]);
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      setPhotoImg(reader.result);

      let image = new Image();

      if (reader.result !== null && (typeof reader.result === "string" || reader.result instanceof String)) {
        image.src = reader.result.toString();

        //save dimensions
        image.onload = function () {
          let height = image.height;
          let width = image.width;
          setPerk({ ...perk, dimensions: { height: height, width: width } });
          return true;
        };
      }
    });
    reader.readAsDataURL(files[0]);
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

  const fileInput = e => {
    e.preventDefault();
    console.log(e);
    const files = e.target.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const dragOver = e => {
    e.preventDefault();
  };
  const dragEnter = e => {
    e.preventDefault();
  };
  const dragLeave = e => {
    e.preventDefault();
  };
  const fileDrop = e => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  };
  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onPhotoChange(files);
      } else {
        files[i]["invalid"] = true;
        // Alert invalid image
      }
    }
  };
  const validateFile = file => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/x-icon"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };
  const removeImage = () => {
    setPhoto(null);
    setPhotoImg(null);
  };

  if (open && socialToken)
    return (
      <Modal className={classes.root} size="medium" isOpen={open} onClose={handleClose} showCloseIcon>
        <div className={classes.content}>
          <h4>Add perks</h4>
          <h5>Add a perk for your token buyers and, if you want to, attach a reward to it!</h5>
          <h6>
            Perk <img src={require("assets/icons/info.png")} alt="info" />
          </h6>
          <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
            <Grid item xs={12} md={4}>
              <label>
                Add Title <span>(Emojis allowed!)</span>
              </label>
              <InputWithLabelAndTooltip
                overriedClasses=""
                inputValue={perk.Title}
                type="text"
                placeHolder="Super cool title!"
                onInputValueChange={e => {
                  setPerk({
                    ...perk,
                    Title: e.target.value,
                  });
                }}
                required
              />
              <Grid container spacing={1} direction="row" alignItems="flex-start" justify="flex-start">
                <Grid item xs={12} md={6}>
                  <label>
                    Cost <img src={require("assets/icons/info.png")} alt="info" />
                  </label>
                  <InputWithLabelAndTooltip
                    overriedClasses=""
                    placeHolder="0,000"
                    inputValue={perk.Cost}
                    type="number"
                    minValue="0.01"
                    onInputValueChange={e => {
                      setPerk({
                        ...perk,
                        Cost: e.target.value,
                      });
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <label>
                    Qty <img src={require("assets/icons/info.png")} alt="info" />
                  </label>
                  <InputWithLabelAndTooltip
                    overriedClasses=""
                    placeHolder="0"
                    inputValue={perk.Quantity}
                    type="number"
                    minValue="1"
                    onInputValueChange={e => {
                      setPerk({
                        ...perk,
                        Quantity: e.target.value,
                      });
                    }}
                    required
                  />
                </Grid>
              </Grid>
              <label>Start Date</label>
              <DateInput
                minDate={new Date()}
                format="MM/dd/yyyy"
                placeholder="Select date..."
                value={perk.StartDate}
                onChange={handleStartDateChange}
              />
              <label>Start Time</label>
              <TimeInput
                minDate={new Date()}
                format="HH:mm"
                placeholder="Select time..."
                value={perk.StartDate}
                onChange={handleStartDateChange}
              />
              <label>End Date</label>
              <DateInput
                minDate={new Date()}
                format="MM/dd/yyyy"
                placeholder="Select date..."
                value={perk.EndDate}
                onChange={handleEndDateChange}
              />
              <label>End Time</label>
              <TimeInput
                minDate={new Date()}
                format="HH:mm"
                placeholder="Select time..."
                value={perk.EndDate}
                onChange={handleEndDateChange}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <label>Describe perk</label>
              <InputWithLabelAndTooltip
                overriedClasses=""
                placeHolder="Description for the perk!"
                inputValue={perk.Description}
                type="text"
                onInputValueChange={e => {
                  setPerk({
                    ...perk,
                    Description: e.target.value,
                  });
                }}
                required
              />
              <label>Reward</label>
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
                            typeof option !== "string" && option.ImageURL
                              ? `url(${option.ImageURL})`
                              : "none",
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
              <label>Cover Image</label>
              {photoImg ? (
                <div className="imageSquareImgTitleDescDiv">
                  <div
                    className="imageSquareImgTitleDesc"
                    style={{
                      backgroundImage: `url(${photoImg})`,
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                    }}
                  ></div>
                  <div
                    className="removeImageButtonSquareImgTitle"
                    onClick={removeImage}
                    style={{
                      right: "10px",
                      top: "10px",
                    }}
                  >
                    <SvgIcon><CloseSolid /></SvgIcon>
                  </div>
                </div>
              ) : (
                <div
                  className="dragImageHereImgTitleDesc"
                  onClick={() => {
                    if (inputRef && inputRef.current) {
                      inputRef.current.click();
                    }
                  }}
                  onDragOver={dragOver}
                  onDragEnter={dragEnter}
                  onDragLeave={dragLeave}
                  onDrop={fileDrop}
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    flex: 1,
                  }}
                >
                  <img
                    className="dragImageHereIconImgTitleDesc"
                    src={imageIcon}
                    alt={"camera"}
                    style={{
                      width: 15.33,
                      height: 15.33,
                      marginBottom: 15.85,
                    }}
                  />
                  <div className="dragImageHereLabelImgTitleDesc" style={{textAlign: 'center'}}>
                    Drag Image Here
                    <div className={"dragImageHereLabelImgTitleSubDesc"}>
                      or <span style={{color: '#39d839', fontWeight: 800}}>browse media on your device</span>
                    </div>
                  </div>
                </div>
              )}
              <InputWithLabelAndTooltip
                hidden
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                onInputValueChange={fileInput}
                reference={inputRef}
              />
            </Grid>
          </Grid>

          <PriviSocialButton onClick={handleAddPerk} size="medium">
            Create perk
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
