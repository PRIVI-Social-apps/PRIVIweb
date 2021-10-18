import React, { useEffect, useRef, useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import { useSelector } from "react-redux";
import { FormControl, InputBase, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";
import { RootState, useTypedSelector } from "store/reducers/Reducer";
import { signTransaction } from "shared/functions/signTransaction";
import ImageTitleDescription from "shared/ui-kit/Page-components/ImageTitleDescription";
import { getUsersInfoList } from "store/selectors";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import URL from "shared/functions/getURL";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { registerMedia, IRegisterMedia, registerMediaForSubstrate } from "shared/services/API";
import { BlockchainNets } from "shared/constants/constants";
import { useSubstrate } from "shared/connectors/substrate";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import { Color } from "shared/ui-kit";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import "./MediaTerms.css";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import { ReactComponent as ArrowForwardIcon } from "assets/icons/long-arrow-alt-right-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
const infoIcon = require("assets/icons/info.svg");
const dateIcon = require("assets/icons/date.svg");
const timeIcon = require("assets/icons/time.svg");
const plusWhiteIcon = require("assets/icons/plus_white.png");

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      fontFamily: "Agrandir",
      fontSize: "10px",
      color: "#656E7E",
      backgroundColor: "rgba(246, 248, 249, 0.8)",
      border: "none",
      fontWeight: "bold",
    },
    body: {
      fontSize: "14px",
      fontFamily: "Agrandir",
      border: "none",
      color: "#656E7E",
      padding: "16px",
    },
  })
)(TableCell);

const style = {
  width: "100%",
  float: "left",
  textAlign: "left",
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  closeIcon: {
    cursor: "poitner",
  },
}));

const useAutoCompleteStyles = makeStyles({
  listbox: {
    maxHeight: 168,
  },
  option: {
    height: 52,
    borderBottom: "1px solid #EFF2F8",
  },
});

const SelectDown = (props: any) => {
  return (
    <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
      <path
        d="M1 0.797363L6 5.79736L11 0.797363"
        stroke="#333333"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const MediaTerms = (props: any) => {
  const userSelector = useSelector((state: RootState) => state.user);
  const userBalances = useSelector((state: RootState) => state.userBalances);
  const usersInfoList = useTypedSelector(getUsersInfoList);

  const [tabMediaTerms, setTabMediaTerms] = useState<number>(0);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const [openError, setOpenError] = useState<boolean>(false);

  const classes = useStyles();
  const autoCompleteClasses = useAutoCompleteStyles();

  const [media, setMedia] = useState<any>({
    Price: 0,
    PricePerSecond: 0,
    Record: false,
    Payment: "Free",
    RecordPaymentType: "Free",
    ReleaseDate: new Date().getTime(),
    ReleaseHour: new Date().getTime(),
    Token: "BAL",
    ExclusivePermissions: false,
    Rewards: [],
    Copies: 0,
    RecordToken: "BAL",
    RecordPrice: 0,
    RecordPricePerSecond: 0,
    RecordCopies: 0,
    RecordRoyalty: 0,
  });

  const [status, setStatus] = useState<any>("");

  const inputRef: any = useRef([]);
  const [keyCollabs, setKeyCollabs] = useState<any[]>([]);

  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [filterArtistsCollabs, setFilterArtistsCollabs] = useState<number>(0);
  const [filterArtistsMedia, setFilterArtistsMedia] = useState<number>(0);
  const [filterArtistsLikes, setFilterArtistsLikes] = useState<number>(0);

  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  // tokens
  const [typeToTokenListMap, setTypeToTokenListMap] = useState<any>({
    CRYPTO: [],
    SOCIAL: [],
    BADGE: [],
  });
  // exclusive tab
  const [exclusiveTokenType, setExclusiveTokenType] = useState<string>(
    Object.keys(typeToTokenListMap).length ? Object.keys(typeToTokenListMap)[0] : ""
  );
  const [exclusiveTokenList, setExclusiveTokenList] = useState<string[]>([]);
  const [exclusiveToken, setExclusiveToken] = useState<string>("");
  const [exclusiveTokenQuantity, setExclusiveTokenQuantity] = useState<string>("");
  // rewards tab
  const [rewardTokenList, setRewardTokenList] = useState<string[]>([]);
  const [rewardTokenType, setRewardTokenType] = useState<string>(
    Object.keys(typeToTokenListMap).length ? Object.keys(typeToTokenListMap)[0] : ""
  );
  const [rewardToken, setRewardTokenName] = useState<string>("");
  const [rewardTokenQuantity, setRewardTokenQuantity] = useState<string>("");
  const [shareValue, setShareValue] = useState<{
    index: number;
    value: number;
  }>({ index: 0, value: 0 });

  const payloadRef = useRef<any>(null);
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const permissionTableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "",
      headerWidth: 60,
    },
    {
      headerName: "TOKEN NAME",
    },
    {
      headerName: "TOKEN TYPE",
    },
    {
      headerName: "AMOUNT",
    },
    {
      headerName: "",
      headerWidth: 50,
    },
  ];
  const [permissionTableData, setPermissionTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  const rewardTableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "",
      headerWidth: 60,
    },
    {
      headerName: "TOKEN NAME",
    },
    {
      headerName: "TOKEN TYPE",
    },
    {
      headerName: "AMOUNT",
    },
    {
      headerName: "",
      headerWidth: 50,
    },
  ];
  const [rewardTableData, setRewardTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  const { api, apiState, keyring, keyringState } = useSubstrate();

  const handleClickSuccess = () => {
    setOpenSuccess(true);
    setTimeout(() => {
      setOpenSuccess(false);
    }, 4000);
  };
  const handleClickError = () => {
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
    }, 4000);
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

  // ---------- TOKEN FUNCTIONS ---------
  // get token list for payment tab
  useEffect(() => {
    const config = {
      params: {
        typeList: Object.keys(typeToTokenListMap),
      },
    };
    setIsDataLoading(true);
    axios
      .get(`${URL()}/wallet/getRegisteredTokensByType`, config)
      .then(response => {
        const resp = response.data;
        if (resp.success) {
          const data = { ...resp.data };
          let type: any = "";
          let list: any = [];
          for ([type, list] of Object.entries(data)) {
            if (list.length == 0) data[type] = ["No items"];
          }
          setTypeToTokenListMap(data);
        }
        setIsDataLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsDataLoading(false);
      });
  }, []);

  // set token type for each tab when typeToTokenListMap changed
  useEffect(() => {
    if (!typeToTokenListMap[exclusiveTokenType] && Object.keys(typeToTokenListMap).length > 0)
      setExclusiveTokenType(Object.keys(typeToTokenListMap)[0]);
    if (!typeToTokenListMap[rewardTokenType] && Object.keys(typeToTokenListMap).length > 0)
      setRewardTokenType(Object.keys(typeToTokenListMap)[0]);
  }, [typeToTokenListMap]);

  // EXCLUSIVE
  // update tokenList when exclusiveTokenType changed
  useEffect(() => {
    setExclusiveTokenList(typeToTokenListMap[exclusiveTokenType] ?? []);
  }, [exclusiveTokenType, typeToTokenListMap]);
  // set correct exclusive token when tokenList changed
  useEffect(() => {
    if (!exclusiveTokenList.includes(exclusiveToken) && exclusiveTokenList.length > 0)
      setExclusiveToken(exclusiveTokenList[0]);
    else {
      setExclusiveToken("");
    }
  }, [exclusiveTokenList, typeToTokenListMap]);

  // REWARDS
  // set correct rewardTokenList (dropdown) whenever tokenType changes
  useEffect(() => {
    setRewardTokenList(typeToTokenListMap[rewardTokenType] ?? []);
  }, [rewardTokenType, typeToTokenListMap]);
  // set correct tokenName when token list changed
  useEffect(() => {
    if (!rewardTokenList.includes(rewardToken) && rewardTokenList.length > 0)
      setRewardTokenName(rewardTokenList[0]);
  }, [rewardTokenList, typeToTokenListMap]);
  // --------------------------------------

  useEffect(() => {
    //should be remove user's id from the list ?? so they don't message themselves
    const allUsers = usersInfoList.filter(user => user.id !== userSelector.id) ?? [];
    allUsers.forEach(user => {
      let image = "";
      if (user.anon !== undefined && user.anon === true && user.anonAvatar && user.anonAvatar.length > 0) {
        image = `${require(`assets/anonAvatars/${user.anonAvatar}`)}`;
      } else {
        if (user.hasPhoto && user.url) {
          image = `${user.url}?${Date.now()}`;
        }
      }
      user.imageUrl = image;
      user.assistances = user.assistances ?? 0;
      user.rate = user.rate ?? 0;
    });
    setUsers(allUsers);
  }, []);

  useEffect(() => {
    if (props.media) {
      const mediaCopy = { ...media, ...props.media };
      if (props.media.Collabs && props.media.Collabs !== {}) {
        mediaCopy.Collab = true;
      }

      mediaCopy.Payment = props.media.Payment || "Free";
      mediaCopy.RecordPaymentType = props.media.RecordPaymentType || "Free";
      mediaCopy.Record = props.media.Record || true;
      mediaCopy.ExclusivePermissions = props.media.ExclusivePermissions || false;
      mediaCopy.Token = props.media.Token || "BAL";
      mediaCopy.ReleaseDate =
        new Date(props.media.ReleaseDate).getFullYear() > 2020
          ? new Date(props.media.ReleaseDate).getTime()
          : new Date(props.media.ReleaseDate).getTime() * 1000 || new Date().getTime();
      mediaCopy.ReleaseHour =
        new Date(props.media.ReleaseDate).getFullYear() > 2020
          ? new Date(props.media.ReleaseDate).getTime()
          : new Date(props.media.ReleaseDate).getTime() * 1000 || new Date().getTime();
      if (props.media.HasPhoto) {
        setPhotoImg(`${URL()}/media/getMediaMainPhoto/${props.media.MediaSymbol}`);
      }

      setMedia(mediaCopy);
    }
  }, [props.media]);

  useEffect(() => {
    if (media.Collabs) {
      let keysCollabsArray = Object.keys(media.Collabs);
      setKeyCollabs(keysCollabsArray);
    }
  }, [media.Collabs]);

  useEffect(() => {
    //console.log(photo, photoImg);
  }, [photo, photoImg]);

  const saveProgress = () => {
    delete media.id;
    const mediaBody = { ...media };
    //let timestampTime: number = 0;
    let releaseDate = new Date(media.ReleaseDate);
    let releaseHour = new Date(media.ReleaseHour);
    let hours = releaseHour.getHours();
    let minutes = releaseHour.getMinutes();
    //timestampTime = minutes * 60 + hours * 60 * 60;
    releaseDate.setHours(hours);
    releaseDate.setMinutes(minutes);
    releaseDate.setSeconds(0);
    let releaseDateTime = releaseDate.getTime() || new Date(releaseDate).getTime();
    media.ReleaseDate = releaseDateTime;
    mediaBody.Creator = userSelector.address;
    setIsDataLoading(true);
    axios
      .post(`${URL()}/media/editMedia/${props.mediaPod}/${props.mediaId}`, {
        media: mediaBody,
      })
      .then(async res => {
        const resp = res.data;
        //(resp);
        if (resp.success) {
          setMedia(resp.data);
          setStatus({
            msg: "Request success!",
            key: Math.random(),
            variant: "success",
          });
          //console.log(props.podAddress, media.MediaSymbol);
          if (photo && photoImg) {
            await uploadImage(props.podAddress, media.MediaSymbol);
          }
          props.onCloseModal();
          props.refreshPod();
        } else {
          setStatus({
            msg: resp.error ? resp.error : "Error when making the request",
            key: Math.random(),
            variant: "error",
          });
        }
        setIsDataLoading(false);
      })
      .catch(e => {
        setStatus({
          msg: "Error when making the request",
          key: Math.random(),
          variant: "error",
        });
        setIsDataLoading(false);
      });
  };

  const handleOpenSignatureModal = () => {
    let areNotPendingCollabs: boolean = true;
    if (media.SavedCollabs && media.SavedCollabs.length > 0) {
      for (let savedCollab of media.SavedCollabs) {
        if (savedCollab.status === "Requested") {
          areNotPendingCollabs = false;
        }
      }
    }
    if (!areNotPendingCollabs) {
      let releaseDate = new Date(media.ReleaseDate);
      let releaseHour = new Date(media.ReleaseHour);
      let hours = releaseHour.getHours();
      let minutes = releaseHour.getMinutes();
      releaseDate.setHours(hours);
      releaseDate.setMinutes(minutes);
      releaseDate.setSeconds(0);
      const releaseDateTime = Math.floor(releaseDate.getTime() / 1000);

      let payType: string = "";
      if (media.Payment === "Free" || media.Payment === "Fixed") {
        payType = "FIXED";
      } else if (media.Payment === "Streaming") {
        payType = "DYNAMIC";
      }
      let recordPayType: string = "";
      if (media.RecordPaymentType === "Free" || media.RecordPaymentType === "Fixed") {
        recordPayType = "FIXED";
      } else if (media.RecordPaymentType === "Streaming") {
        recordPayType = "DYNAMIC";
      }

      const collabs = {};
      if (!media.Collab) {
        collabs[userSelector.address] = 1;
      } else {
        if (media.SavedCollabs && media.SavedCollabs.length > 0) {
          for (let savedCollab of media.SavedCollabs) {
            collabs[savedCollab.address] = savedCollab.share / 100;
          }
        } else {
          collabs[userSelector.address] = 1;
        }
      }
      const payload: IRegisterMedia = {
        PodAddress: props.podAddress,
        MediaSymbol: media.MediaSymbol,
        MediaName: media.MediaName,
        Type: media.Type,
        PaymentType: payType,
        Copies: +media.Copies ?? 0,
        Royalty: +media.Royalty ?? 0,
        FundingToken: media.Token,
        ReleaseDate: releaseDateTime, // change
        Collabs: collabs,
        PricePerSecond: media.PricePerSecond ?? 0,
        Price: media.Price ?? 0,
        IsRecord: media.Record ?? true,
        RecordToken: media.RecordToken,
        RecordPaymentType: recordPayType,
        RecordPrice: +media.RecordPrice ?? 0,
        RecordPricePerSecond: +media.RecordPricePerSecond ?? 0,
        RecordCopies: +media.RecordCopies ?? 0,
        RecordRoyalty: +media.RecordRoyalty ?? 0,
      };
      payloadRef.current = payload;
      setSignRequestModalDetail(buildJsxFromObject(payload));
      setOpenSignRequestModal(true);
    } else {
      setStatus({
        msg: "Can not Register Media - There are Collabs Requested",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const afterRegisterConditions = async podRes => {
    if (podRes.success) {
      setStatus({
        msg: "Request success!",
        key: Math.random(),
        variant: "success",
      });
      if (photo && photoImg) {
        await uploadImage(props.podAddress, media.MediaSymbol);
      }
      props.onCloseModal();
      props.refreshPod();
    } else {
      setStatus({
        msg: podRes.error ? podRes.error : "Error when making the request",
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const registerConditions = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        const additionalData: any = {
          Requester: userSelector.address,
          ExclusivePermissions: media.ExclusivePermissions,
          ExclusivePermissionsList: media.ExclusivePermissionsList,
          Rewards: media.Rewards,
          IsUploaded: media.IsUploaded,
          Dimensions: media.Dimensions ?? "",
          PaymentType: media.Payment,
          // BlockchainNet: media.blockchainNet
        };
        if (media.Type === "LIVE_VIDEO_TYPE" || media.Type === "LIVE_AUDIO_TYPE") {
          additionalData.IsUploaded = true;
        } else {
          additionalData.IsUploaded = media.IsUploaded;
        }

        if (props.network === BlockchainNets[1].value) {
          // Register Media on Substrate Chain
          if (!api) return;

          const keyringOptions = (keyring as any).getPairs().map(account => ({
            key: account.address,
            value: account.address,
            text: account.meta.name.toUpperCase(),
            icon: "user",
          }));
          const accountAddress = keyringOptions.length > 0 ? keyringOptions[0].value : "";
          const accountPair =
            accountAddress && keyringState === "READY" && (keyring as any).getPair(accountAddress);

          registerMediaForSubstrate(payload, additionalData, api, accountPair).then(registerMediaRes => {
            afterRegisterConditions(registerMediaRes);
          });
        } else {
          // Register Media on Privi Chain
          const registerMediaRes = await registerMedia(
            "registerMedia",
            payload,
            additionalData,
            userSelector.mnemonic
          );
          afterRegisterConditions(registerMediaRes);
        }
      } else {
        setStatus({
          msg: "Can not Register Media - There are Collabs Requested",
          key: Math.random(),
          variant: "error",
        });
      }
    } catch (e) {
      setStatus({
        msg: "Unexpected Error: " + e,
        key: Math.random(),
        variant: "error",
      });
    }
  };

  const uploadImage = async (podId, mediaSymbol) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", photo, mediaSymbol);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      axios
        .post(`${URL()}/media/changeMediaImage/${podId}/${mediaSymbol}`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          resolve(true);
          // alert("Error uploading photo");
        });
    });
  };

  const filterArtistsFunction = () => {
    let artists = [...users];
    let filteredArtists = artists.filter(
      usr =>
        usr.media > filterArtistsMedia &&
        usr.numFollowers &&
        usr.likes &&
        usr.likes.length > filterArtistsLikes
    );
    setFilteredUsers(filteredArtists);
  };

  const removeCollab = async (collab: any) => {
    let collabs: any = {};

    if (media.SavedCollabs && media.SavedCollabs.length > 0) {
      let collabIndex = media.SavedCollabs.findIndex(col => col.id === collab.id);
      media.SavedCollabs.splice(collabIndex, 1);

      let sumShare: number = 0;
      for (let collab of media.SavedCollabs) {
        if (collab.id !== userSelector.id) {
          sumShare += Number(collab.share);
        }
      }

      if (sumShare < 100) {
        let creatorIndex = media.SavedCollabs.findIndex(coll => coll.id === userSelector.id);
        let user = {
          name: userSelector.firstName,
          id: userSelector.id,
          address: userSelector.address,
          share: 100 - sumShare,
          status: "Creator",
        };
        if (creatorIndex === -1) {
          media.SavedCollabs.push(user);
        } else {
          media.SavedCollabs[creatorIndex] = user;
        }
      }

      for (let savedCollab of media.SavedCollabs) {
        media.SavedCollabs[savedCollab.id] = Number(savedCollab.share) / 100;
      }
    }

    const body: any = {
      PodAddress: props.podAddress,
      MediaSymbol: media.MediaSymbol,
      Collabs: collabs,
    };
    const [hash, signature] = await signTransaction(userSelector.mnemonic, body);
    body.RemovedCollab = collab;
    body.Creator = userSelector.id;
    body.Hash = hash;
    body.Signature = signature;

    axios.post(`${URL()}/media/removeCollab/${props.podAddress}/${media.MediaSymbol}`, body).then(res => {
      const resp = res.data;

      if (resp.success) {
        setStatus({
          msg: "Request success",
          key: Math.random(),
          variant: "success",
        });
      } else {
        setStatus({
          msg:
            resp.error && JSON.stringify(resp.error) !== JSON.stringify({})
              ? resp.error
              : "Error when making the request",
          key: Math.random(),
          variant: "error",
        });
      }
    });
  };

  const handleAddExclusiveAccessItem = () => {
    if (exclusiveToken && exclusiveTokenType && exclusiveTokenQuantity) {
      const mediaCopy = { ...media };
      if (!mediaCopy.ExclusivePermissionsList) {
        mediaCopy.ExclusivePermissionsList = [] as any;
      }
      mediaCopy.ExclusivePermissionsList.push({
        Token: exclusiveToken,
        TokenType: exclusiveTokenType,
        Quantity: Number(exclusiveTokenQuantity),
      });
      setExclusiveTokenQuantity("");
      setMedia(mediaCopy);
    }
  };

  const removeExclusiveAccessItem = index => {
    const mediaCopy = { ...media };
    mediaCopy.ExclusivePermissionsList.splice(index, 1);
    setMedia(mediaCopy);
  };

  const handleAddReward = () => {
    if (rewardToken !== "" && rewardTokenType !== "" && Number(rewardTokenQuantity) > 0) {
      const mediaCopy = { ...media };
      if (!mediaCopy.Rewards) {
        mediaCopy.Rewards = [] as any;
      }
      mediaCopy.Rewards.push({
        Token: rewardToken,
        TokenType: rewardTokenType,
        Quantity: Number(rewardTokenQuantity),
      });
      setRewardTokenQuantity("");
      setMedia(mediaCopy);
    }
  };

  const removeReward = index => {
    const mediaCopy = { ...media };
    mediaCopy.Rewards.splice(index, 1);
    setMedia(mediaCopy);
  };

  function renderInputCreateModal(p) {
    return (
      <div>
        <div className="flexRowInputs">
          <div className="infoHeaderCreatePod">{p.name}</div>
          <img className="infoIconCreatePod" src={infoIcon} alt={"info"} style={{ opacity: 0 }} />
          {/*p.info && p.info.length > 0 ? (
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              arrow
              className="tooltipHeaderInfo"
              title={p.info}
            >
              <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
            </Tooltip>
          ) : null*/}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <InputWithLabelAndTooltip
            overriedClasses="textFieldCreatePod term-control"
            style={{ width: "calc(" + p.width + "px - 24px)", padding: "8px" }}
            type={p.type}
            minValue={p.min}
            inputValue={p.value ? p.value : media[p.item]}
            onInputValueChange={elem => {
              let mediaCopy = { ...media };
              mediaCopy[p.item] = elem.target.value;
              setMedia(mediaCopy);
            }}
            placeHolder={p.placeholder}
          />
        </div>
      </div>
    );
  }

  //add button component
  const AddButtonCreateModal = (props: any) => {
    return (
      <div className="createHashtagButton" onClick={props.function}>
        <img className="createHashtagButtonIcon" src={plusWhiteIcon} alt={"plus"} />
      </div>
    );
  };

  useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (media.ExclusivePermissionsList && media.ExclusivePermissionsList.length) {
      data = media.ExclusivePermissionsList.map((item, i) => {
        return [
          {
            cell: (
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: "656e7e",
                  margin: "0px 10px",
                  backgroundImage:
                    item.Token !== ""
                      ? item.TokenType && item.TokenType === "CRYPTO"
                        ? `url(${require(`assets/tokenImages/${item.Token}.png`)}`
                        : `url(${URL()}/wallet/getTokenPhoto/${item.Token})`
                      : "none",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ),
          },
          {
            cell: item.Token || "",
          },
          {
            cell: item.TokenType || "",
          },
          {
            cell: item.Quantity || "",
          },
          {
            cell: item.status !== "Creator" && (
              <SvgIcon className={classes.closeIcon} onClick={() => removeExclusiveAccessItem(i)}>
                <CloseSolid />
              </SvgIcon>
            ),
          },
        ];
      });
    }

    setPermissionTableData(data);
  }, [media.ExclusivePermissionsList]);

  useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (media.Rewards && media.Rewards.length) {
      data = media.Rewards.map((reward, i) => {
        return [
          {
            cell: (
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: "656e7e",
                  margin: "0px 10px",
                  backgroundImage:
                    reward.Token !== ""
                      ? reward.TokenType && reward.TokenType === "CRYPTO"
                        ? `url(${require(`assets/tokenImages/${reward.Token}.png`)}`
                        : `url(${URL()}/wallet/getTokenPhoto/${reward.Token})`
                      : "none",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ),
          },
          {
            cell: reward.Token || "",
          },
          {
            cell: reward.TokenType || "",
          },
          {
            cell: reward.Quantity || "",
          },
          {
            cell:
              reward.status !== "Creator" ? (
                <SvgIcon className={classes.closeIcon} onClick={() => removeReward(i)}>
                  <CloseSolid />
                </SvgIcon>
              ) : null,
          },
        ];
      });
    }

    setRewardTableData(data);
  }, [media.Rewards]);

  return (
    <div className="modalTerms">
      <SignatureRequestModal
        open={openSignRequestModal}
        address={userSelector.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={registerConditions}
        handleClose={() => setOpenSignRequestModal(false)}
      />
      <div className="exit" onClick={props.onCloseModal}>
        <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
      </div>
      <div className="cards-options">
        <h2>Complete Conditions</h2>

        <div className={"buttonsMediaTermsBorder"} />
        <div className="buttonsMediaTerms" style={{ display: "flex", justifyContent: "flex-end" }}>
          <div className={"selected"} onClick={() => setTabMediaTerms(0)}>
            <button>1</button>
            General
          </div>
          <div
            className={tabMediaTerms !== 0 ? "selected" : "unselected"}
            onClick={() => setTabMediaTerms(1)}
          >
            <button>2</button>
            Payments
          </div>
          <div
            className={tabMediaTerms === 2 || tabMediaTerms === 3 ? "selected" : "unselected"}
            onClick={() => setTabMediaTerms(2)}
          >
            <button>3</button>
            Collabs
          </div>
          <div
            className={tabMediaTerms === 3 ? "selected" : "unselected"}
            onClick={() => setTabMediaTerms(3)}
          >
            <button>4</button>
            Rewards
          </div>
        </div>
      </div>
      <LoadingWrapper loading={isDataLoading}>
        <>
          {tabMediaTerms === 0 ? (
            <Grid
              direction="row"
              alignItems="flex-start"
              justify="flex-start"
              container
              style={{
                marginBottom: "5px",
                marginTop: "5px",
              }}
            >
              <Grid item={true} xs={12} sm={12}>
                <ImageTitleDescription
                  photoImg={photoImg}
                  mainElement={media}
                  mainSetter={setMedia}
                  photoTitle="Media Main Image"
                  setterPhoto={setPhoto}
                  setterPhotoImg={setPhotoImg}
                  titleTitle="Media Name"
                  title={media.MediaName}
                  setterTitle={name => {
                    // NON UPDATED FIELD -> MediaName can't be modified
                    /*let mediaCopy = { ...media };
                    mediaCopy.MediaName = name;
                    setMedia(mediaCopy);*/
                  }}
                  titlePlaceholder="Enter media name..."
                  descTitle="Media Description"
                  desc={media.MediaDescription}
                  setterDesc={desc => {
                    let mediaCopy = { ...media };
                    mediaCopy.MediaDescription = desc;
                    setMedia(mediaCopy);
                  }}
                  descPlaceholder="Media description..."
                  imageSize={12}
                  infoSize={6}
                  canEdit={true}
                />
              </Grid>
              <Grid item={true} xs={12} sm={12}>
                <Grid
                  direction="row"
                  alignItems="flex-start"
                  justify="flex-start"
                  container
                  style={{
                    marginBottom: "15px",
                    marginTop: "10px",
                  }}
                >
                  <Grid item={true} xs={12} sm={6} style={{ paddingRight: 24 }}>
                    <div className="flexRowInputs">
                      <div className="infoHeaderCreateCampaign">Release Date</div>
                      {/*<Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        arrow
                        className="tooltipHeaderInfo"
                        title={`Release date`}
                      >
                        <img
                          className="infoIconCreatePod"
                          src={infoIcon}
                          alt={"info"}
                        />
                      </Tooltip>*/}
                    </div>
                    <div className="textFieldCreateCampaign">
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          id="date-picker-expiration-date"
                          minDate={new Date()}
                          format="MM.dd.yyyy"
                          placeholder="Select date..."
                          value={media.ReleaseDate}
                          onChange={(elem: any) => {
                            let date = new Date(elem).getTime();
                            const mediaCopy = { ...media };
                            mediaCopy.ReleaseDate = date;
                            setMedia(mediaCopy);
                          }}
                          keyboardIcon={
                            <img className="iconCalendarCreateCampaign" src={dateIcon} alt={"calendar"} />
                          }
                          style={{ width: "100%" }}
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                  </Grid>
                  <Grid item={true} xs={12} sm={6}>
                    <div className="flexRowInputs">
                      <div className="infoHeaderCreateCampaign">Release Time</div>
                      {/*<Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        arrow
                        className="tooltipHeaderInfo"
                        title={`Release date`}
                      >
                        <img
                          className="infoIconCreatePod"
                          src={infoIcon}
                          alt={"info"}
                        />
                      </Tooltip>*/}
                    </div>
                    <div className="textFieldCreateCampaign">
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardTimePicker
                          style={{
                            marginTop: "0px",
                            marginBottom: "0px",
                            width: "100%",
                          }}
                          margin="normal"
                          id="time-picker"
                          value={media.ReleaseHour}
                          onChange={(elem: any) => {
                            let date = new Date(elem).getTime();
                            const mediaCopy = { ...media };
                            mediaCopy.ReleaseHour = date;
                            setMedia(mediaCopy);
                          }}
                          KeyboardButtonProps={{
                            "aria-label": "change time",
                          }}
                          keyboardIcon={
                            <img className="iconCalendarCreateCampaign" src={timeIcon} alt={"calendar"} />
                          }
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : tabMediaTerms === 1 ? (
            <div>
              <h4 className={"titlePayment"}>Charging</h4>
              <div className="mediaTermsPaymentRow">
                <div className="option-buttons payment-type">
                  <button
                    className={media.Payment === "Free" ? "selected" : undefined}
                    onClick={() => {
                      let mediaCopy = { ...media };
                      mediaCopy.Payment = "Free";
                      mediaCopy.PricePerSecond = 0;
                      mediaCopy.Price = 0;
                      setMedia(mediaCopy);
                    }}
                  >
                    Free
                  </button>
                  <button
                    className={media.Payment === "Fixed" ? "selected" : undefined}
                    onClick={() => {
                      let mediaCopy = { ...media };
                      mediaCopy.Payment = "Fixed";
                      mediaCopy.PricePerSecond = 0;
                      setMedia(mediaCopy);
                    }}
                  >
                    Fixed
                  </button>
                  {media.Type &&
                  (media.Type === "LIVE_VIDEO_TYPE" ||
                    media.Type === "LIVE_AUDIO_TYPE" ||
                    media.Type === "VIDEO_TYPE" ||
                    media.Type === "AUDIO_TYPE") ? (
                    <button
                      className={media.Payment === "Streaming" ? "selected" : undefined}
                      onClick={() => {
                        let mediaCopy = { ...media };
                        mediaCopy.Payment = "Streaming";
                        mediaCopy.Price = 0;
                        setMedia(mediaCopy);
                      }}
                    >
                      Streaming
                    </button>
                  ) : null}
                </div>
              </div>
              {(media.Payment === "Fixed" || media.Payment === "Streaming") && (
                <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
                  <Grid item xs={12} sm={6}>
                    <div>
                      <div className="flexRowInputs">
                        <div className="infoHeaderCreatePod">Token</div>
                        <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
                      </div>
                      <div
                        className="selector-with-token no-width term-control"
                        style={{ display: "flex", padding: "8px" }}
                      >
                        {media && media.Token && media.Token !== "" ? (
                          <img
                            className="imgSelectorTokenAddLiquidityModal"
                            src={require(`assets/tokenImages/${
                              props.tokenNameToSymbolMap[media.Token]
                                ? props.tokenNameToSymbolMap[media.Token] === "LINK"
                                  ? "LNK"
                                  : props.tokenNameToSymbolMap[media.Token]
                                : media.Token === "LINK"
                                ? "LNK"
                                : media.Token
                            }.png`)}
                            alt={media.Token}
                            style={{ marginRight: "8px" }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 15,
                              backgroundColor: "656e7e",
                              margin: "0px 10px",
                            }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <FormControl style={{ width: "100%" }} className="selectorFormControlCreatePod">
                            <StyledSelect
                              disableUnderline
                              value={media.Token}
                              className="selectCreatePod"
                              onChange={e => {
                                const selectedName: any = e.target.value;
                                let mediaCopy = { ...media };
                                mediaCopy.Token = selectedName;
                                setMedia(mediaCopy);
                              }}
                              IconComponent={SelectDown}
                            >
                              {(typeToTokenListMap.CRYPTO ?? []).map((item, i) => {
                                return (
                                  <StyledMenuItem key={i} value={item}>
                                    {item}
                                  </StyledMenuItem>
                                );
                              })}
                            </StyledSelect>
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {media.Payment === "Fixed"
                      ? renderInputCreateModal({
                          name: "Price",
                          placeholder: "Enter Price...",
                          type: "number",
                          width: 400,
                          item: "Price",
                        })
                      : renderInputCreateModal({
                          name: "Price per second",
                          info: "Price per second",
                          placeholder: "Enter Price per second...",
                          type: "number",
                          width: 400,
                          item: "PricePerSecond",
                        })}
                  </Grid>
                </Grid>
              )}

              {(media.Payment === "Fixed" || media.Payment === "Streaming") && (
                <div className="mediaTermsPaymentRow" style={{ flexDirection: "column", marginTop: "16px" }}>
                  <h4 className="titlePayment" style={{ marginBlockEnd: 14 }}>
                    Exclusive Access
                  </h4>
                  <div
                    style={{
                      flexDirection: "row",
                      display: "flex",
                      alignSelf: "flex-start",
                    }}
                  >
                    <div
                      onClick={() => {
                        let mediaCopy = { ...media };
                        mediaCopy.ExclusivePermissions = true;
                        setMedia(mediaCopy);
                      }}
                      style={{
                        color: media.ExclusivePermissions === true ? "#181818" : "#949BAB",
                        marginRight: 30,
                      }}
                    >
                      <StyledCheckbox
                        buttonType="circle"
                        buttonColor={media.ExclusivePermissions === true ? Color.Black : Color.GrayMedium}
                        checked={media.ExclusivePermissions === true}
                      />
                      Yes
                    </div>
                    <div
                      className={"row"}
                      onClick={() => {
                        let mediaCopy = { ...media };
                        mediaCopy.ExclusivePermissions = false;
                        setMedia(mediaCopy);
                      }}
                      style={{
                        color: media.ExclusivePermissions === false ? "#181818" : "#949BAB",
                      }}
                    >
                      <StyledCheckbox
                        buttonType="circle"
                        buttonColor={media.ExclusivePermissions === false ? Color.Black : Color.GrayMedium}
                        checked={media.ExclusivePermissions === false}
                      />
                      No
                    </div>
                  </div>
                </div>
              )}
              {media.ExclusivePermissions === true ? (
                <div className="flexRowInputs exclusiveRow">
                  <label>
                    <div className="infoHeaderCreatePod">Token Type</div>
                    <div
                      className="selector-with-token no-width term-control"
                      style={{ display: "flex", alignItems: "center", padding: "8px" }}
                    >
                      <FormControl className="selectorFormControlCreatePod">
                        <StyledSelect
                          disableUnderline
                          value={exclusiveTokenType}
                          className="selectCreatePod"
                          onChange={e => {
                            setExclusiveTokenType(e.target.value as string);
                          }}
                          IconComponent={SelectDown}
                        >
                          {Object.keys(typeToTokenListMap ?? []).map(tokenType => {
                            return (
                              <StyledMenuItem value={tokenType} key={tokenType}>
                                {tokenType}
                              </StyledMenuItem>
                            );
                          })}
                        </StyledSelect>
                      </FormControl>
                    </div>
                  </label>
                  <label>
                    <div className="infoHeaderCreatePod">Token Name</div>
                    <div
                      className="selector-with-token no-width term-control"
                      style={{ display: "flex", alignItems: "center", padding: "8px" }}
                    >
                      <div
                        style={{
                          width:
                            exclusiveToken &&
                            typeToTokenListMap.CRYPTO &&
                            typeToTokenListMap.CRYPTO.includes(exclusiveToken)
                              ? 30
                              : 0,
                          minWidth:
                            exclusiveToken &&
                            typeToTokenListMap.CRYPTO &&
                            typeToTokenListMap.CRYPTO.includes(exclusiveToken)
                              ? 30
                              : 0,
                          height: 30,
                          borderRadius: 15,
                          backgroundColor: "656e7e",
                          marginRight: "10px",
                          backgroundImage: exclusiveToken
                            ? typeToTokenListMap.CRYPTO && typeToTokenListMap.CRYPTO.includes(exclusiveToken)
                              ? `url(${require(`assets/tokenImages/${exclusiveToken}.png`)}`
                              : `url(${URL()}/wallet/getTokenPhoto/${exclusiveToken})`
                            : "none",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <FormControl className="selectorFormControlCreatePod">
                        <StyledSelect
                          disableUnderline
                          value={exclusiveToken}
                          className="selectCreatePod"
                          onChange={e => {
                            setExclusiveToken(e.target.value as string);
                          }}
                          IconComponent={SelectDown}
                        >
                          {exclusiveTokenList.map(token => {
                            return (
                              <StyledMenuItem value={token} key={token}>
                                {token}
                              </StyledMenuItem>
                            );
                          })}
                        </StyledSelect>
                      </FormControl>
                    </div>
                  </label>
                  <label style={{ width: "calc(100% / 4)" }}>
                    <div className="infoHeaderCreatePod">Quantity</div>
                    <InputWithLabelAndTooltip
                      overriedClasses={"textFieldCreatePod term-control"}
                      type="number"
                      placeHolder="0"
                      minValue="0.01"
                      inputValue={exclusiveTokenQuantity}
                      required
                      onInputValueChange={elem => {
                        setExclusiveTokenQuantity(elem.target.value as string);
                      }}
                      style={{ padding: "8px" }}
                    />
                  </label>
                  {exclusiveToken && exclusiveToken != "No item" && (
                    <AddButtonCreateModal function={handleAddExclusiveAccessItem} />
                  )}
                </div>
              ) : null}
              {media.ExclusivePermissions === true &&
              media.ExclusivePermissionsList &&
              media.ExclusivePermissionsList.length > 0 ? (
                <div className="infoHeaderCreatePod">Exclusive Access List</div>
              ) : null}

              {media.ExclusivePermissionsList && media.ExclusivePermissionsList.length > 0 ? (
                <div className="table-wrapper">
                  <CustomTable headers={permissionTableHeaders} rows={permissionTableData} />
                </div>
              ) : null}
            </div>
          ) : tabMediaTerms === 2 ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h4 style={{ marginBottom: 14, marginTop: 0 }}>Collab</h4>
              <div
                style={{
                  flexDirection: "row",
                  display: "flex",
                  alignSelf: "flex-start",
                }}
              >
                <div
                  onClick={() => {
                    let mediaCopy = { ...media };
                    mediaCopy.Collab = !mediaCopy.Collab;
                    setMedia(mediaCopy);
                  }}
                  style={{
                    color: media.Collab === true ? "#181818" : "#949BAB",
                    marginRight: 30,
                  }}
                >
                  <StyledCheckbox
                    buttonType="circle"
                    buttonColor={media.Collab === true ? Color.Black : Color.GrayMedium}
                    checked={media.Collab === true}
                  />
                  Yes
                </div>
                <div
                  className={"row"}
                  onClick={() => {
                    let mediaCopy = { ...media };
                    mediaCopy.Collab = !mediaCopy.Collab;
                    setMedia(mediaCopy);
                  }}
                  style={{
                    color: media.Collab === false ? "#181818" : "#949BAB",
                  }}
                >
                  <StyledCheckbox
                    buttonType="circle"
                    buttonColor={media.Collab === false ? Color.Black : Color.GrayMedium}
                    checked={media.Collab === false}
                  />
                  No
                </div>
              </div>
              {media.Collab ? (
                <div className="collab-counts">
                  <h4 style={{ marginTop: 40, marginBottom: 0 }}>Collab Conditions </h4>
                  <h4
                    style={{
                      fontSize: 14,
                      fontWeight: "normal",
                      color: "#707582",
                      marginTop: 8,
                      marginBottom: 20,
                    }}
                  >
                    I want to collab with users that have more than
                  </h4>
                  <Grid
                    container
                    spacing={5}
                    direction="row"
                    alignItems="flex-start"
                    justify="flex-start"
                    className="general"
                  >
                    <Grid item xs={12} md={4} style={{ display: "flex", flexDirection: "column" }}>
                      <div className="flexRowInputs">
                        <div className="infoHeaderCreatePod">Collabs</div>
                        {/*<Tooltip
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          arrow
                          className="tooltipHeaderInfo"
                          title={"Media type"}
                        >
                          <img
                            className="infoIconCreatePod"
                            src={infoIcon}
                            alt={"info"}
                          />
                        </Tooltip>*/}
                      </div>
                      <div
                        className="selector-with-token term-control"
                        style={{ maxWidth: "250px", display: "flex", alignItems: "center", padding: "8px" }}
                      >
                        <InputWithLabelAndTooltip
                          overriedClasses="textFieldEdit"
                          style={{ border: "0 !important" }}
                          type="number"
                          inputValue={`${filterArtistsCollabs}`}
                          onInputValueChange={elem => {
                            //console.log("collabs");
                            let filterCollabs: any = elem.target.value;
                            setFilterArtistsCollabs(filterCollabs);
                            filterArtistsFunction();
                          }}
                          placeHolder="0"
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} md={4} style={{ display: "flex", flexDirection: "column" }}>
                      <div className="flexRowInputs">
                        <div className="infoHeaderCreatePod">Likes</div>
                        {/*<Tooltip
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          arrow
                          className="tooltipHeaderInfo"
                          title={"Media type"}
                        >
                          <img
                            className="infoIconCreatePod"
                            src={infoIcon}
                            alt={"info"}
                          />
                        </Tooltip>*/}
                      </div>
                      <div
                        className="selector-with-token term-control"
                        style={{ maxWidth: "250px", display: "flex", alignItems: "center", padding: "8px" }}
                      >
                        <InputWithLabelAndTooltip
                          overriedClasses="textFieldEdit"
                          style={{ border: "0 !important" }}
                          type="number"
                          inputValue={`${filterArtistsLikes}`}
                          onInputValueChange={elem => {
                            let filterLikes: any = elem.target.value;
                            setFilterArtistsLikes(filterLikes);
                            filterArtistsFunction();
                          }}
                          placeHolder="0"
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} md={4} style={{ display: "flex", flexDirection: "column" }}>
                      <div className="flexRowInputs">
                        <div className="infoHeaderCreatePod" style={{ maxWidth: "250px" }}>
                          Media
                        </div>
                        {/*<Tooltip
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          arrow
                          className="tooltipHeaderInfo"
                          title={"Media type"}
                        >
                          <img
                            className="infoIconCreatePod"
                            src={infoIcon}
                            alt={"info"}
                          />
                        </Tooltip>*/}
                      </div>
                      <div
                        className="selector-with-token term-control"
                        style={{ maxWidth: "250px", display: "flex", alignItems: "center", padding: "8px" }}
                      >
                        <InputWithLabelAndTooltip
                          overriedClasses="textFieldEdit"
                          style={{ border: "0 !important" }}
                          type="number"
                          inputValue={`${filterArtistsMedia}`}
                          onInputValueChange={elem => {
                            let filterMedia: any = elem.target.value;
                            setFilterArtistsMedia(filterMedia);
                            filterArtistsFunction();
                          }}
                          placeHolder="0"
                        />
                      </div>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={12} className="collab-user">
                    <div className="flexRowInputs">
                      <div className="infoHeaderCreatePod" style={{ fontSize: 18, marginTop: 40 }}>
                        Choose specific users to collab with
                      </div>
                      {/*<Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        arrow
                        className="tooltipHeaderInfo"
                        title={"Find user"}
                      >
                        <img
                          className="infoIconCreatePod"
                          src={infoIcon}
                          alt={"info"}
                        />
                      </Tooltip>*/}
                    </div>
                    <div
                      className="selector-with-token term-control"
                      style={{ display: "flex", alignItems: "center", padding: "8px" }}
                    >
                      <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                        <path
                          d="M17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L17.2929 18.7071ZM15 8.5C15 12.0899 12.0899 15 8.5 15V17C13.1944 17 17 13.1944 17 8.5H15ZM8.5 15C4.91015 15 2 12.0899 2 8.5H0C0 13.1944 3.80558 17 8.5 17V15ZM2 8.5C2 4.91015 4.91015 2 8.5 2V0C3.80558 0 0 3.80558 0 8.5H2ZM8.5 2C12.0899 2 15 4.91015 15 8.5H17C17 3.80558 13.1944 0 8.5 0V2ZM18.7071 17.2929L14.5195 13.1053L13.1053 14.5195L17.2929 18.7071L18.7071 17.2929Z"
                          fill="#707582"
                        />
                      </svg>
                      <Autocomplete
                        id="autocomplete-1"
                        style={{
                          marginLeft: 20,
                          width: "calc(100% - 60px)",
                          paddingRight: "10px",
                        }}
                        fullWidth={true}
                        freeSolo
                        debug={true}
                        value={users[0] != "" ? users.find(user => user.id === users[0]) : users[0]}
                        onChange={(event: any, newValue: any | null) => {
                          if (newValue) {
                            let user = {
                              name: newValue.name,
                              id: newValue.id,
                              address: newValue.address,
                              share: 0,
                              status: "Requested",
                              imageUrl: newValue.imageUrl,
                            };

                            let collabs: any[] = [...(media?.SavedCollabs || [])];

                            if (
                              !collabs.length ||
                              (collabs.length && collabs.findIndex(coll => coll.id === user.id) < 0)
                            ) {
                              collabs.push(user);
                            }

                            setMedia({ ...media, SavedCollabs: collabs });
                          }
                        }}
                        classes={autoCompleteClasses}
                        options={[...users.filter(user => !users.includes(user.id))]}
                        renderOption={(option, { selected }) => (
                          <React.Fragment>
                            {option !== "" ? (
                              <div
                                style={{
                                  backgroundImage:
                                    typeof option !== "string" &&
                                    option.imageUrl &&
                                    option.imageUrl.length > 0
                                      ? `url(${option.imageUrl})`
                                      : "none",
                                  backgroundRepeat: "no-repeat",
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  cursor: "pointer",
                                  minWidth: 30,
                                  width: 30,
                                  height: 30,
                                  borderRadius: 15,
                                  backgroundColor: "#656e7e",
                                  marginRight: 10,
                                  fontFamily: "Agrandir",
                                }}
                              />
                            ) : null}
                            <div style={{ flexGrow: 1 }}>
                              {typeof option !== "string" ? `@${option.name}` : ""}
                            </div>
                            {typeof option !== "string" && (
                              <>
                                {/* <div style={{ color: "#03EAA5", marginRight: 10 }}>Request Collab</div> */}
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                  <path
                                    d="M9 1V17M1 9L17 9"
                                    stroke="url(#paint0_linear)"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <defs>
                                    <linearGradient
                                      id="paint0_linear"
                                      x1="2.84615"
                                      y1="6.86667"
                                      x2="15.5626"
                                      y2="8.51737"
                                      gradientUnits="userSpaceOnUse"
                                    >
                                      <stop offset="0.828418" stop-color="#23D0C6" />
                                      <stop offset="1" stop-color="#00CC8F" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                              </>
                            )}
                          </React.Fragment>
                        )}
                        getOptionLabel={option => (typeof option !== "string" ? `@${option.name}` : "")}
                        getOptionSelected={option => typeof option !== "string" && option.id === users[0]}
                        renderInput={params => (
                          <InputBase
                            ref={params.InputProps.ref}
                            inputProps={params.inputProps}
                            autoFocus
                            placeholder="add a user"
                          />
                        )}
                      />
                    </div>
                  </Grid>
                  <div
                    style={{
                      position: "relative",
                      marginBottom: 60,
                      marginTop: 40,
                    }}
                  >
                    {filteredUsers.length ? (
                      <>
                        <div>Suggested artist based on your filters</div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            position: "absolute",
                            marginTop: 15,
                            width: "100%",
                          }}
                        >
                          <div
                            style={{
                              width: "calc(100% - 70px)",
                              display: "flex",
                              flexDirection: "row",
                              overflow: "auto",
                            }}
                          >
                            {filteredUsers.map((collab, index) => (
                              <div
                                key={`collab-${index}`}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  flexDirection: "row",
                                  marginRight: 15,
                                }}
                              >
                                <div
                                  style={{
                                    backgroundImage:
                                      collab.imageUrl && collab.imageUrl.length > 0
                                        ? `url(${collab.imageUrl})`
                                        : "none",
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    cursor: "pointer",
                                    minWidth: 30,
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    backgroundColor: "#656e7e",
                                    marginRight: 10,
                                  }}
                                />
                                <div style={{ width: "max-content" }}>@{collab.name}</div>
                              </div>
                            ))}
                          </div>
                          <div
                            onClick={() => {
                              let collabs: any[] = [...(media?.SavedCollabs || [])];

                              const suggestedUsers = filteredUsers
                                .filter(user => collabs.findIndex(collab => user.id == collab.id) < 0)
                                .map(user => ({
                                  name: user.name,
                                  id: user.id,
                                  address: user.address,
                                  share: 0,
                                  status: "Requested",
                                  imageUrl: user.imageUrl,
                                }));

                              setMedia({
                                ...media,
                                SavedCollabs: collabs.concat(suggestedUsers),
                              });
                            }}
                            className="cursor-pointer"
                          >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path
                                d="M1.42627 0.810547V6.81055M1.42627 6.81055H7.23306M1.42627 6.81055L3.98153 4.44122C5.31807 3.06264 7.05205 2.17019 8.92219 1.89833C10.7923 1.62648 12.6973 1.98995 14.3501 2.93398C16.003 3.87801 17.3141 5.35146 18.0859 7.13231M18.8467 18.8105V12.8105M18.8467 12.8105L13.0399 12.8105M18.8467 12.8105L16.2914 15.1799C14.9548 16.5585 13.2208 17.4509 11.3507 17.7228C9.48057 17.9946 7.57557 17.6312 5.92275 16.6871C4.26993 15.7431 2.95883 14.2696 2.18699 12.4888"
                                stroke="url(#paint0_linear)"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <defs>
                                <linearGradient
                                  id="paint0_linear"
                                  x1="3.43631"
                                  y1="7.41055"
                                  x2="17.2963"
                                  y2="9.15174"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop offset="0.828418" stop-color="#23D0C6" />
                                  <stop offset="1" stop-color="#00CC8F" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                  {media.SavedCollabs && media.SavedCollabs.length > 0 ? (
                    <>
                      {media.SavedCollabs.map((collab, i) => (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            paddingTop: 4,
                            paddingBottom: 4,
                          }}
                        >
                          <div
                            style={{
                              backgroundImage:
                                collab.imageUrl && collab.imageUrl.length > 0
                                  ? `url(${collab.imageUrl})`
                                  : "none",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              cursor: "pointer",
                              minWidth: 30,
                              width: 32,
                              height: 32,
                              borderRadius: 15,
                              backgroundColor: "#656e7e",
                              marginRight: 10,
                            }}
                          />
                          <div style={{ flex: 1, fontSize: 14 }}>@{collab.name}</div>
                          <div className="infoHeaderCreatePod">Share</div>
                          <div className="selector-with-token" style={{ width: "90px", margin: "0 15px" }}>
                            <InputWithLabelAndTooltip
                              overriedClasses="textFieldEdit"
                              style={{
                                border: "0 !important",
                                width: "calc(100% - 12px)",
                              }}
                              minValue="0"
                              type="number"
                              inputValue={collab.share}
                              onInputValueChange={elem => {
                                let duplicateCollabs = [...media.SavedCollabs];
                                duplicateCollabs[i].share = elem.target.value;

                                let sumShare: number = 0;
                                for (let collab of duplicateCollabs) {
                                  if (collab.id !== userSelector.id) {
                                    sumShare += Number(collab.share);
                                  }
                                }
                                if (sumShare < 100) {
                                  const creatorIndex = duplicateCollabs.findIndex(
                                    coll => coll.id === userSelector.id
                                  );
                                  const user = {
                                    name: userSelector.firstName,
                                    id: userSelector.id,
                                    address: userSelector.address,
                                    share: 100 - sumShare,
                                    status: "Creator",
                                    // imageUrl: userSelector.imageUrl
                                  };
                                  if (creatorIndex === -1) {
                                    duplicateCollabs.push(user);
                                  } else {
                                    duplicateCollabs[creatorIndex] = user;
                                  }
                                }

                                setMedia({
                                  ...media,
                                  SavedCollabs: duplicateCollabs,
                                });
                              }}
                              placeHolder="0%"
                            />
                          </div>
                          {!props.creator || props.creator !== collab.id ? (
                            <div
                              onClick={() => removeCollab(collab)}
                              style={{ width: "20px" }}
                              className="cursor-pointer"
                            >
                              <svg
                                width="19"
                                height="20"
                                viewBox="0 0 19 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M15.2871 4.5V16.5C15.2871 17.6046 14.3917 18.5 13.2871 18.5H5.28711C4.18254 18.5 3.28711 17.6046 3.28711 16.5V4.5M12.2871 4.5V3.5C12.2871 2.39543 11.3917 1.5 10.2871 1.5H8.28711C7.18254 1.5 6.28711 2.39543 6.28711 3.5V4.5M1.28711 4.5H17.2871"
                                  stroke="#181818"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </div>
                          ) : (
                            <div style={{ width: "20px" }}></div>
                          )}
                        </div>
                      ))}
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : tabMediaTerms === 3 ? (
            <div>
              {/*REWARDS*/}
              <label>
                <div className="flexRowInputs">
                  <div className="infoHeaderCreatePod">Select Token type</div>
                  {/*<Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    arrow
                    className="tooltipHeaderInfo"
                    title={"Select Token type"}
                  >
                    <img
                      className="infoIconCreatePod"
                      src={infoIcon}
                      alt={"info"}
                    />
                  </Tooltip>*/}
                </div>
                <div className="select-tokens">
                  {typeToTokenListMap &&
                    Object.keys(typeToTokenListMap).map(type => {
                      return (
                        <button
                          className={type !== rewardTokenType ? "disabled" : ""}
                          onClick={() => {
                            setRewardTokenType(type);
                          }}
                          key={type}
                        >
                          {`${type} ${
                            type.toUpperCase().includes("CRYPTO")
                              ? "💸"
                              : type.includes("NFT")
                              ? "🏆"
                              : type.includes("FT") || type.includes("BADGE")
                              ? "👘"
                              : "📸"
                          }`}
                        </button>
                      );
                    })}
                </div>
              </label>
              <div className="flexRowInputs rewardsRow">
                <label>
                  <div className="flexRowInputs">
                    <div className="infoHeaderCreatePod">Token Name</div>
                    {/*<Tooltip
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      arrow
                      className="tooltipHeaderInfo"
                      title={"Token to reward"}
                    >
                      <img
                        className="infoIconCreatePod"
                        src={infoIcon}
                        alt={"info"}
                      />
                    </Tooltip>*/}
                  </div>
                  <div
                    className="selector-with-token"
                    style={{ display: "flex", padding: "8px", alignItems: "center" }}
                  >
                    <div
                      style={{
                        width:
                          rewardToken &&
                          typeToTokenListMap.CRYPTO &&
                          typeToTokenListMap.CRYPTO.includes(rewardToken)
                            ? 30
                            : 0,
                        minWidth:
                          rewardToken &&
                          typeToTokenListMap.CRYPTO &&
                          typeToTokenListMap.CRYPTO.includes(rewardToken)
                            ? 30
                            : 0,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: "656e7e",
                        margin: "0px 10px",
                        backgroundImage: rewardToken
                          ? typeToTokenListMap.CRYPTO.includes(rewardToken)
                            ? `url(${require(`assets/tokenImages/${rewardToken}.png`)}`
                            : `url(${URL()}/wallet/getTokenPhoto/${rewardToken})`
                          : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <FormControl className="selectorFormControlCreatePod">
                      <StyledSelect
                        disableUnderline
                        value={rewardToken}
                        style={{ width: "340px" }}
                        className="selectCreatePod"
                        onChange={e => {
                          setRewardTokenName(e.target.value as string);
                        }}
                      >
                        {rewardTokenList.map(token => {
                          return (
                            <StyledMenuItem value={token} key={token}>
                              {token}
                            </StyledMenuItem>
                          );
                        })}
                      </StyledSelect>
                    </FormControl>
                  </div>
                </label>
                <label>
                  <div className="flexRowInputs">
                    <div className="infoHeaderCreatePod">Quantity</div>
                    {/*<Tooltip
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      arrow
                      className="tooltipHeaderInfo"
                      title={"Amount of the selected token to reward"}
                    >
                      <img
                        className="infoIconCreatePod"
                        src={infoIcon}
                        alt={"info"}
                      />
                    </Tooltip>*/}
                  </div>
                  <InputWithLabelAndTooltip
                    overriedClasses={"textFieldCreatePod"}
                    type="number"
                    placeHolder="0"
                    minValue="0.01"
                    inputValue={rewardTokenQuantity}
                    required
                    onInputValueChange={elem => {
                      setRewardTokenQuantity(elem.target.value as string);
                    }}
                    style={{ display: "flex", padding: "8px", alignItems: "center" }}
                  />
                  <div className="under-info" style={{ marginTop: "8px" }}>{`Max available ${
                    userBalances[rewardToken] ? userBalances[rewardToken].Balance : 0
                  }`}</div>
                </label>
                {/* <AddButtonCreateModal function={handleAddReward} /> */}
              </div>
              {media.Rewards && media.Rewards.length > 0 ? (
                <div className="flexRowInputs">
                  <div className="infoHeaderCreatePod">Reward List</div>
                  {/*<Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    arrow
                    className="tooltipHeaderInfo"
                    title={"List of all the rewards"}
                  >
                    <img
                      className="infoIconCreatePod"
                      src={infoIcon}
                      alt={"info"}
                    />
                  </Tooltip>*/}
                </div>
              ) : null}

              {media.Rewards && media.Rewards.length > 0 ? (
                <div className="table-wrapper">
                  <CustomTable headers={rewardTableHeaders} rows={rewardTableData} />
                </div>
              ) : null}
            </div>
          ) : null}
        </>
      </LoadingWrapper>

      <div className="flexEndCenterRowTerms" style={{ justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: tabMediaTerms === 3 ? "100%" : "auto",
            justifyContent: tabMediaTerms === 3 ? "space-between" : "flex-start",
          }}
        >
          <button style={{ marginLeft: "5px", color: "#151414" }} onClick={saveProgress}>
            Save Progress
          </button>
          <button
            style={{
              marginLeft: "5px",
              background: tabMediaTerms === 3 ? "black" : "white",
              color: tabMediaTerms === 3 ? "white" : "#151414",
              borderColor: tabMediaTerms === 3 ? "black" : "#949bab",
            }}
            onClick={handleOpenSignatureModal}
          >
            Register Conditions
          </button>
        </div>
        {tabMediaTerms === 0 || tabMediaTerms === 1 || tabMediaTerms === 2 ? (
          <button
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "5px",
            }}
            onClick={() => {
              if (tabMediaTerms === 0) {
                setTabMediaTerms(1);
              } else if (tabMediaTerms === 1) {
                setTabMediaTerms(2);
              } else if (tabMediaTerms === 2) {
                setTabMediaTerms(3);
              }
            }}
          >
            Next
            <div style={{ marginLeft: "5px" }}>
              <SvgIcon>
                <ArrowForwardIcon />
              </SvgIcon>
            </div>
          </button>
        ) : null}
      </div>

      <div className={classes.root}>
        {status && (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
            onClose={() => setStatus(undefined)}
          />
        )}
      </div>
    </div>
  );
};

export default MediaTerms;
