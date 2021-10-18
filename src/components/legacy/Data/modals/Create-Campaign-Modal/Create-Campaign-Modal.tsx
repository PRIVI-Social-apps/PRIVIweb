import React, { useEffect, useRef, useState } from "react";
import "./Create-Campaign-Modal.css";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import { Divider } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import URL from "shared/functions/getURL";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import SwapModal from "../../../Swap/components/Swap-Modal/Swap-Modal";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { trackPromise } from "react-promise-tracker";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";
const infoIcon = require("assets/icons/info_icon.png");
const imageIcon = require("assets/icons/image_icon.png");
const searchIcon = require("assets/icons/search_right_blue.png");
const perCentIcon = require("assets/icons/per_cent_icon.png");
const lockIcon = require("assets/icons/lock_white.png");
const calendarIcon = require("assets/icons/calendar_icon.png");
const plusWhiteIcon = require("assets/icons/plus_white.png");

const minDate = new Date(new Date().getTime() + 86400000);

const pricingTypes = ["CPC"];

const CreateCampaignModal = (props: any) => {
  const userSelector = useSelector((state: RootState) => state.user);

  const [campaign, setCampaign] = useState<any>({
    Name: "",
    Text: "",
    TotalBudget: "",
    Prices: "",
    DailyBudget: "",
    WeeklyBudget: "",
    HasPhoto: false,
  });
  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);
  const inputRef: any = useRef([]);
  const [tabSearcher, setTabSearcher] = useState<string>("");

  const [tabsCreateCampaignsValue, setTabsCreateCampaignsValue] = useState(0);
  const [tabsCreateCampaignsLabel, setTabsCreateCampaignsLabel] = useState("Pods");

  const [pricingSelector, setpricingSelector] = useState<string>(pricingTypes[0]);

  const [tokens, setTokens] = useState<any[]>([]);

  const [hashtag, setHashtag] = useState<string>("");
  const [hashtags, setHashtags] = useState<any[]>([]);
  const [addHashtag, setAddHashtag] = useState(false);
  const [location, setLocation] = useState<string>("");
  const [locations, setLocations] = useState<any[]>([]);
  const [addLocation, setAddLocation] = useState(false);
  const [memberOfPods, setMemberOfPods] = useState<string>("");
  const [membersOfPods, setMembersOfPods] = useState<any[]>([]);
  const [addMemberOfPods, setAddMemberOfPods] = useState(false);
  const [memberOfCommunities, setMemberOfCommunities] = useState<string>("");
  const [membersOfCommunities, setMembersOfCommunities] = useState<any[]>([]);
  const [addMemberOfCommunities, setAddMemberOfCommunities] = useState(false);
  const [hasToken, setHasToken] = useState<string>("");
  const [hasTokens, setHasTokens] = useState<any[]>([]);
  const [addHasToken, setAddHasToken] = useState(false);

  const [admin, setAdmin] = useState<any>({});
  const [admins, setAdmins] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<any>({});
  const [usersRoles, setUsersRoles] = useState<any[]>([]);

  const [allPods, setAllPods] = useState<any[]>([]);
  const [creditPools, setCreditPools] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [searchedCreditPools, setSearchedCreditPools] = useState<any[]>([]);
  const [searchedPods, setSearchedPods] = useState<any[]>([]);
  const [searchedCommunities, setSearchedCommunities] = useState<any[]>([]);

  const [selectedItem, setSelectedItem] = useState<any>({});
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [selectedItemType, setSelectedItemType] = useState<string>("");

  const [openSwapModal, setOpenSwapModal] = useState<boolean>(false);
  const handleOpenSwapModal = () => {
    setOpenSwapModal(true);
  };
  const handleCloseSwapModal = () => {
    setOpenSwapModal(false);
  };

  const [status, setStatus] = React.useState<any>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    // Get my Pods, my pools, my credit
    trackPromise(
      axios
        .get(`${URL()}/privi-data/getMyPodsPoolsCreditsCommunities/${userSelector.id}`)
        .then(response => {
          if (response.data.success) {
            let data = response.data.data;

            //console.log(data);

            let pods = data.myFTPods;
            pods.concat(data.myNFTPods);

            let allPods = [...data.allPods];
            allPods.forEach((item, i) => {
              item.selected = false;
            });
            //console.log(allPods);
            setAllPods(allPods);
            setCreditPools(data.allCreditPools);
            setSearchedPods(allPods);
            setSearchedCreditPools(data.allCreditPools);
            setCommunities(data.allCommunities);
            setSearchedCommunities(data.allCommunities);
          }
        })
        .catch(error => {
          console.log(error);
          // alert("Error getMyPodsPoolsCreditsCommunities");
        })
    );
  }, []);

  // get token list from backend
  useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
      const resp = res.data;
      if (resp.success) {
        const tokenList: string[] = []; // list of tokens
        const tokenRatesObj: {} = {}; // tokenRates
        const data = resp.data;
        data.forEach(rateObj => {
          tokenList.push(rateObj.token);
          tokenRatesObj[rateObj.token] = rateObj.rate;
        });
        setTokens(tokenList); // update token list
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tabsCreateCampaignsValue === 0) {
      let sPods = [] as any;
      if (tabSearcher.length > 0 && allPods.length > 0) {
        allPods.forEach(pod => {
          if (pod.Name.toUpperCase().includes(tabSearcher.toUpperCase())) {
            sPods.push(pod);
          } else {
            pod.Hashtags.forEach(hashtag => {
              if (
                hashtag.toUpperCase().includes(tabSearcher.toUpperCase()) ||
                (hashtag.includes("#") &&
                  hashtag.replace("#", "").toUpperCase().includes(tabSearcher.toUpperCase()))
              ) {
                sPods.push(pod);
                return;
              }
            });
          }
        });
      } else {
        sPods = [...allPods];
      }
      setSearchedPods(sPods);
    } else if (tabsCreateCampaignsValue === 1 && creditPools.length > 0) {
      let sPools = [] as any;
      if (tabSearcher.length > 0) {
        creditPools.forEach(creditPool => {
          if (
            creditPool.CreditName.toUpperCase().includes(tabSearcher.toUpperCase()) ||
            creditPool.LendingToken.toUpperCase().includes(tabSearcher.toUpperCase())
          ) {
            sPools.push(creditPool);
          }
        });
      } else {
        sPools = [...creditPools];
      }
      setSearchedCreditPools(sPools);
    } else if (tabsCreateCampaignsValue === 2 && communities.length > 0) {
      let sCommunities = [] as any;
      if (tabSearcher.length > 0) {
        communities.forEach(community => {
          if (
            community.Name.toUpperCase().includes(tabSearcher.toUpperCase()) ||
            community.TokenName.toUpperCase().includes(tabSearcher.toUpperCase()) ||
            community.FundingToken.toUpperCase().includes(tabSearcher.toUpperCase())
          ) {
            sCommunities.push(community);
          }
        });
      } else {
        sCommunities = [...communities];
      }
      setSearchedCommunities(sCommunities);
    }
  }, [tabSearcher]);

  const handleChangePriceType = event => {
    const value = event.target.value;
    setpricingSelector(value);
  };

  const handleChangeTabsCreateCampaigns = (event, newValue) => {
    setTabSearcher("");
    switch (newValue) {
      case 0:
        setTabsCreateCampaignsLabel("Pods");
        break;
      case 1:
        setTabsCreateCampaignsLabel("CreditPools");
        break;
      case 2:
        setTabsCreateCampaignsLabel("Communities");
        break;
    }
    setTabsCreateCampaignsValue(newValue);
  };

  const [ageRangeSelector, setAgeRangeSelector] = useState<string>("25-35");
  const handleChangeAgeRangeSelector = event => {
    const value = event.target.value;
    setAgeRangeSelector(value);
  };

  const [sexSelector, setSexSelector] = useState<string>("Male");
  const handleChangeSexSelector = event => {
    const value = event.target.value;
    setSexSelector(value);
  };

  const [trustScoreSelector, setTrustScoreSelector] = useState<string>("50+");
  const handleChangeTrustScoreSelector = event => {
    const value = event.target.value;
    setTrustScoreSelector(value);
  };

  const [endorsementScoreSelector, setEndorsementScoreSelector] = useState<string>("50+");
  const handleChangeEndorsementScoreSelector = event => {
    const value = event.target.value;
    setEndorsementScoreSelector(value);
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

  const onCampaignPhotoChange = (files: any) => {
    setPhoto(files[0]);
    const campaignCopy = { ...campaign };
    campaignCopy.HasPhoto = true;
    setCampaign(campaignCopy);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setPhotoImg(reader.result);
    });
    reader.readAsDataURL(files[0]);
  };

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onCampaignPhotoChange(files);
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

  const removeCampaignImage = () => {
    setPhoto(null);
    setPhotoImg(null);
    const campaignCopy = { ...campaign };
    campaignCopy.HasPhoto = false;
    setCampaign(campaignCopy);
  };

  const fileInputCampaignPhoto = e => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const handleExpirationDateChange = (elem: any) => {
    if (new Date(elem).getTime() > new Date(campaign.DateStart).getTime() || !campaign.DateStart) {
      let campaignCopy = { ...campaign };
      campaignCopy.DateExpiration = new Date(elem).getTime();
      setCampaign(campaignCopy);
    }
  };
  const handleDateOfStartChange = (elem: any) => {
    if (new Date(elem).getTime() < new Date(campaign.DateExpiration).getTime() || !campaign.DateExpiration) {
      let campaignCopy = { ...campaign };
      campaignCopy.DateStart = new Date(elem).getTime();
      setCampaign(campaignCopy);
    }
  };

  const addAdmin = () => {
    if (admin.name && admin.name !== "") {
      let array = [...admins];
      array.push({
        name: admin.name,
        status: "Pending",
      });
      setAdmins(array);
      setAdmin({});
    }
  };

  const addUserRoles = () => {
    if (userRoles.name && userRoles.name !== "") {
      let array = [...userRoles];
      array.push({
        name: userRoles.name,
        status: "Pending",
      });
      setUsersRoles(array);
      setUserRoles({});
    }
  };

  const createCampaign = () => {
    if (validateCampaignInfo()) {
      let body = { ...campaign };
      body.TargetHashtags = hashtags;
      body.Locations = locations;
      body.MemberOfPods = membersOfPods;
      body.MemberOfCommunities = membersOfCommunities;
      body.HasTokens = hasTokens;
      body.Admins = admins;
      body.Users = usersRoles;
      body.Sex = sexSelector;
      body.TrustScore = trustScoreSelector.split("+")[0];
      body.EndorsementScore = endorsementScoreSelector.split("+")[0];
      body.Pricing = [];
      body.AgeRangeStart = ageRangeSelector.split("-")[0];
      body.AgeRangeEnd = ageRangeSelector.split("-")[1];
      body.ItemId = selectedItemId;
      body.ItemType = selectedItemType;
      body.CreatorAddress = userSelector.address;
      body.PricingType = pricingSelector;
      body.Creator = userSelector.id;

      trackPromise(
        axios.post(`${URL()}/privi-data/createCampaign`, body).then(async response => {
          if (response.data.success) {
            if (campaign.HasPhoto) {
              await uploadImage(response.data.data.Id);
            }
            setStatus({
              msg: "campaign created",
              key: Math.random(),
              variant: "success",
            });
            setTimeout(() => {
              props.handleRefresh();
              props.onCloseModal();
              //setCreationProgress(false);
            }, 1000);
          } else {
            setErrorMsg("Error when making the request");
            setStatus({
              msg: "campaign creation failed",
              key: Math.random(),
              variant: "error",
            });
          }
        })
      );
    }
  };

  const validateCampaignInfo = () => {
    //console.log(campaign);
    if (!campaign.Name || campaign.Name === "") {
      setErrorMsg("Name field invalid.");
      return false;
    } else if (!campaign.Text || campaign.Text === "") {
      setErrorMsg("Description field invalid.");
      return false;
    } else if (selectedItem === {} || selectedItemId === "" || selectedItemType === "") {
      setErrorMsg("Select an item.");
      return false;
    } else if (!campaign.DateStart || campaign.DateStart === "" || campaign.DateStart === 0) {
      setErrorMsg("Date Start field invalid.");
      return false;
    } else if (!campaign.DateExpiration || campaign.DateExpiration === "" || campaign.DateExpiration === 0) {
      setErrorMsg("Date Expiration field invalid.");
      return false;
    } else if (!campaign.TotalBudget || campaign.TotalBudget === "") {
      setErrorMsg("Total Budget field invalid.");
      return false;
    } else if (!campaign.Prices || campaign.Prices === "") {
      setErrorMsg("Prices field invalid.");
      return false;
    } else if (!campaign.DailyBudget || campaign.DailyBudget === "") {
      setErrorMsg("Daily Budget field invalid.");
      return false;
    } else if (!campaign.WeeklyBudget || campaign.WeeklyBudget === "") {
      setErrorMsg("Weekly Budget field invalid.");
      return false;
    } else {
      setErrorMsg("");
      return true;
    }
  };

  const uploadImage = async campaignId => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", photo, campaignId);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      axios
        .post(`${URL()}/privi-data/changeCampaignPhoto`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          resolve(true);
          alert("Error uploading photo");
        });
    });
  };

  function renderInputCreateModal(p) {
    return (
      <div key={`${p.index}-input-container`}>
        <InputWithLabelAndTooltip
          labelName={p.name}
          overriedClasses="textFieldCreateCampaign"
          style={{
            width: "calc(" + p.width + "px - 24px)",
          }}
          type={p.type}
          minValue={p.type === "number" ? "0.01" : "none"}
          inputValue={campaign[p.item]}
          onInputValueChange={e => {
            let campaignCopy = { ...campaign };
            campaignCopy[p.item] = e.target.value;
            setCampaign(campaignCopy);
          }}
          placeHolder={p.placeholder}
        />
      </div>
    );
  }
  const SelectorCreateModal = (props: any) => {
    return (
      <div>
        <FormControl className="selectorFormControlCreateCampaign">
          <StyledSelect
            disableUnderline
            value={props.selectValue}
            style={{ width: props.width }}
            className="selectCreateCampaign"
            onChange={props.selectFunction}
          >
            {props.selectItems.map((item, i) => {
              return (
                <StyledMenuItem key={i} value={item}>
                  {item}
                </StyledMenuItem>
              );
            })}
          </StyledSelect>
        </FormControl>
      </div>
    );
  };

  const PodItemCreateCampaign = (props: any) => {
    if (props.item && props.item.PodAddress) {
      return (
        <div
          className={props.selected ? "ItemCreateCampaignSelected" : "ItemCreateCampaign"}
          onClick={
            !props.selected
              ? () => {
                  let indexSelected = allPods.findIndex((pod, i) => i === props.index);
                  props.selectItem(indexSelected);
                }
              : () => {}
          }
        >
          <div
            className="leftPartItemCreateCampaign"
            style={{
              backgroundImage: props.item.HasPhoto ? `url(${props.item.Url}?${Date.now()})` : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div />
            <div className="bottomItemCreateCampaign">
              <div className="nameItemCreateCampaign">
                {" "}
                {props.item.Hashtags && props.item.Hashtags.length > 0 ? props.item.Hashtags[0] : ""}
              </div>
              <div className="perCentItemCreateCampaign">
                <div className="perCentBadgeItemCreateCampaign">
                  <img src={perCentIcon} className="iconPerCentItemCreateCampaign" alt={"percent"} />
                  {props.item.State && props.item.State.FundsRaised && props.item.State.Debt
                    ? `${((props.item.State.FundsRaised / props.item.State.Debt) * 100).toFixed(0)}
                %`
                    : "80%"}
                </div>
              </div>
              <div className="iconBlockItemCreateCampaign">
                {props.item.Private === false ? (
                  <img src={lockIcon} className="lockIconItemCreateCampaign" alt={"lock"} />
                ) : null}
              </div>
            </div>
          </div>
          <div className="rightPartItemCreateCampaign">
            {props.selected ? (
              <div
                className="closeItemCreateCampaign"
                onClick={() => {
                  let indexSelected = allPods.findIndex((pod, i) => i === props.index);
                  props.unSelectItem(indexSelected);
                }}
              >
                <SvgIcon className={"closeIconItemCreateCampaignSelected"}>
                  <CloseSolid />
                </SvgIcon>
              </div>
            ) : null}
            {props.item.type && props.item.type === "FT" ? (
              <div className="valuesRightPartItemCreateCampaign">
                <div className="trustItemCreateCampaign">
                  <div
                    className={props.selected ? "valueItemCreateCampaignSelected" : "valueItemCreateCampaign"}
                  >
                    {props.item.TrustScore * 100 || 50}%
                  </div>
                  <div
                    className={props.selected ? "labelItemCreateCampaignSelected" : "labelItemCreateCampaign"}
                  >
                    Trust
                  </div>
                </div>
                <div className="endorsementItemCreateCampaign">
                  <div
                    className={props.selected ? "valueItemCreateCampaignSelected" : "valueItemCreateCampaign"}
                  >
                    {props.item.EndorsementScore * 100 || 50}%
                  </div>
                  <div
                    className={props.selected ? "labelItemCreateCampaignSelected" : "labelItemCreateCampaign"}
                  >
                    Endorsement
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  };
  const PoolItemCreateCampaign = (props: any) => {
    if (props.item && props.item.CreditAddress) {
      return (
        <div
          className={props.selected ? "ItemCreateCampaignSelected" : "ItemCreateCampaign"}
          onClick={
            !props.selected
              ? () => {
                  let indexSelected = creditPools.findIndex((creditPool, i) => i === props.index);
                  props.selectItem(indexSelected);
                }
              : () => {}
          }
        >
          <div className="leftPartItemCreateCampaign withToken">
            <div
              className="tokenImageItemCreateCampaign"
              style={{
                backgroundImage: props.item.LendingToken
                  ? `url(${require(`assets/tokenImages/${props.item.LendingToken}.png`)})`
                  : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="bottomItemCreateCampaign">
              <p className="nameItemCreateCampaign">{props.item.CreditName ? props.item.CreditName : ""}</p>
            </div>
          </div>
          <div className="rightPartItemCreateCampaign withToken">
            {props.selected ? (
              <div
                className="closeItemCreateCampaign"
                onClick={() => {
                  let indexSelected = creditPools.findIndex((creditPool, i) => i === props.index);
                  props.unSelectItem(indexSelected);
                }}
              >
                <SvgIcon className={"closeIconItemCreateCampaignSelected"}>
                  <CloseSolid />
                </SvgIcon>
              </div>
            ) : null}
            <div className="valuesRightPartItemCreateCampaign">
              <div className="trustItemCreateCampaign">
                <div
                  className={props.selected ? "valueItemCreateCampaignSelected" : "valueItemCreateCampaign"}
                >
                  {props.item.TrustScore * 100 || 50}%
                </div>
                <div
                  className={props.selected ? "labelItemCreateCampaignSelected" : "labelItemCreateCampaign"}
                >
                  Trust
                </div>
              </div>
              <div className="endorsementItemCreateCampaign">
                <div
                  className={props.selected ? "valueItemCreateCampaignSelected" : "valueItemCreateCampaign"}
                >
                  {props.item.EndorsementScore * 100 || 50}%
                </div>
                <div
                  className={props.selected ? "labelItemCreateCampaignSelected" : "labelItemCreateCampaign"}
                >
                  Endorsement
                </div>
              </div>
            </div>
            <div className="valuesRightPartItemCreateCampaign">
              <div className="trustItemCreateCampaign">
                <div
                  className={props.selected ? "valueItemCreateCampaignSelected" : "valueItemCreateCampaign"}
                >
                  {props.item.Interest
                    ? `${(props.item.Interest * 100).toFixed(0)}
                %`
                    : ""}
                </div>
                <div
                  className={props.selected ? "labelItemCreateCampaignSelected" : "labelItemCreateCampaign"}
                >
                  Interest
                </div>
              </div>
              <div className="endorsementItemCreateCampaign">
                <div
                  className={props.selected ? "valueItemCreateCampaignSelected" : "valueItemCreateCampaign"}
                >
                  {props.item.CollateralsAccepted && props.item.CollateralsAccepted.length > 0
                    ? `${props.item.CollateralsAccepted[0]}
                ${props.item.CollateralsAccepted.length > 1 ? `, ${props.item.CollateralsAccepted[1]}` : ""}`
                    : ""}
                </div>
                <div
                  className={props.selected ? "labelItemCreateCampaignSelected" : "labelItemCreateCampaign"}
                >
                  Collateral(s)
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  const CommunityItemCreateCampaign = (props: any) => {
    if (props.item && props.item.CommunityAddress) {
      return (
        <div
          className={props.selected ? "ItemCreateCampaignSelected" : "ItemCreateCampaign"}
          onClick={
            !props.selected
              ? () => {
                  let indexSelected = communities.findIndex((community, i) => i === props.index);
                  props.selectItem(indexSelected);
                }
              : () => {}
          }
        >
          <div className="leftPartItemCreateCampaign withToken">
            <div
              className="tokenImageItemCreateCampaign"
              style={{
                backgroundImage: props.item.FundingToken
                  ? `url(${require(`assets/tokenImages/${props.item.FundingToken}.png`)})`
                  : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="bottomItemCreateCampaign">
              <p className="nameItemCreateCampaign">{props.item.Name ? props.item.Name : ""}</p>
              <div className="iconBlockItemCreateCampaign">
                {props.item.Privacy === "Public" ? null : (
                  <img src={lockIcon} className="lockIconItemCreateCampaign" alt={"lock"} />
                )}
              </div>
            </div>
          </div>
          <div className="rightPartItemCreateCampaign withToken">
            {props.selected ? (
              <div
                className="closeItemCreateCampaign"
                onClick={() => {
                  let indexSelected = communities.findIndex((community, i) => i === props.index);
                  props.unSelectItem(indexSelected);
                }}
              >
                <SvgIcon className={"closeIconItemCreateCampaignSelected"}>
                  <CloseSolid />
                </SvgIcon>
              </div>
            ) : null}
            <div className="valuesRightPartItemCreateCampaign">
              <div className="trustItemCreateCampaign">
                <div
                  className={props.selected ? "valueItemCreateCampaignSelected" : "valueItemCreateCampaign"}
                >
                  {props.item.Members ? props.item.Members.length : "0"}
                </div>
                <div
                  className={props.selected ? "labelItemCreateCampaignSelected" : "labelItemCreateCampaign"}
                >
                  Members
                </div>
              </div>
              <div className="endorsementItemCreateCampaign">
                <div
                  className={props.selected ? "valueItemCreateCampaignSelected" : "valueItemCreateCampaign"}
                >
                  {props.item.FundingToken ? props.item.FundingToken : ""}
                </div>
                <div
                  className={props.selected ? "labelItemCreateCampaignSelected" : "labelItemCreateCampaign"}
                >
                  Token
                </div>
              </div>
            </div>
            <div className="valuesRightPartItemCreateCampaign">
              <div className="trustItemCreateCampaign">
                <div
                  className={props.selected ? "valueItemCreateCampaignSelected" : "valueItemCreateCampaign"}
                >
                  {props.item.Price != undefined ? `${props.item.Price.toFixed(4)}` : "N/A"}
                </div>
                <div
                  className={props.selected ? "labelItemCreateCampaignSelected" : "labelItemCreateCampaign"}
                >
                  Price
                </div>
              </div>
              <div className="endorsementItemCreateCampaign">
                <div
                  className={props.selected ? "valueItemCreateCampaignSelected" : "valueItemCreateCampaign"}
                >
                  {props.item.AvgHolding ? `${props.item.AvgHolding} days` : "unknown"}
                </div>
                <div
                  className={props.selected ? "labelItemCreateCampaignSelected" : "labelItemCreateCampaign"}
                >
                  Avg. holding
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  const HashtagLabel = (props: any) => {
    return (
      <div className={props.main ? "hashtagLabel hashtagLabelMain" : "hashtagLabel"}>
        {props.main ? <div className="mainHashtagLabel">MAIN</div> : null}
        <div></div>
        <div>{props.value}</div>
        <button
          className="removePodButton"
          onClick={(e: any) => {
            e.preventDefault();
            let array = [...props.array];
            array.splice(props.index, 1);
            props.setterArray(array);
          }}
        >
          <SvgIcon>
            <CloseSolid />
          </SvgIcon>
        </button>
      </div>
    );
  };

  const CreateHashtagButton = (props: any) => {
    return (
      <div>
        {props.addBoolean ? (
          <div className="createHashtagButtonInput">
            <InputWithLabelAndTooltip
              overriedClasses="createHashtagInput"
              onInputValueChange={e => {
                let value = e.target.value;
                props.setterValue(value);
              }}
              transparent
              type="text"
              inputValue={props.value}
              placeHolder={props.placeholder}
            />
            <button
              className="removePodButton"
              onClick={(e: any) => {
                if (props.value && props.value !== "") {
                  e.preventDefault();
                  let array = [...props.array];
                  if (props.string === "Hashtag") {
                    array.push("#" + props.value);
                  } else {
                    array.push(props.value);
                  }

                  props.setterArray(array);
                  props.setterValue("");
                  props.setterAddBoolean(false);
                }
              }}
            >
              <img className="createHashtagButtonIcon" src={plusWhiteIcon} alt={"plus"} />
            </button>
          </div>
        ) : (
          <AddButtonCreateModal function={() => props.setterAddBoolean(true)} />
        )}
      </div>
    );
  };

  const AddButtonCreateModal = (props: any) => {
    return (
      <div className="createHashtagButton" onClick={props.function}>
        <img className="createHashtagButtonIcon" src={plusWhiteIcon} alt={"plus"} />
      </div>
    );
  };

  const ArrayAddItems = (props: any) => {
    return (
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <div className="flexRowInputs">
          <div className="infoHeaderCreatePod">{props.title}</div>
          <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
        </div>
        <div className="hashtagsRowCreatePod">
          {props.array && props.array.length ? (
            <div className="flexRowInputs">
              {props.array.map((item, i) => {
                return (
                  <HashtagLabel
                    key={i}
                    value={item}
                    array={props.array}
                    setterArray={props.setterArray}
                    index={i}
                    main={false}
                  />
                );
              })}
            </div>
          ) : null}
          <CreateHashtagButton
            addBoolean={props.addBoolean}
            string={props.string}
            setterValue={props.setterValue}
            value={props.value}
            array={props.array}
            setterArray={props.setterArray}
            setterAddBoolean={props.setterAddBoolean}
            placeholder={props.placeholder}
          />
        </div>
      </div>
    );
  };

  const AdminsMailLabel = props => {
    return (
      <div className="adminsMailLabel">
        <div className="adminsNameMailLabel">
          <div>{props.admin.name}</div>
          <button
            className="removePodButton"
            onClick={(e: any) => {
              //add collateral and update collaterals list
              e.preventDefault();
              let adminsCopy = [...admins];
              adminsCopy.splice(props.index, 1);
              setAdmins(adminsCopy);
            }}
          >
            <SvgIcon>
              <CloseSolid />
            </SvgIcon>
          </button>
        </div>
        {props.admin.status === "Accepted" ? (
          <div className="adminsStatusLabel">{props.admin.status}</div>
        ) : null}
        {props.admin.status === "Pending" ? (
          <div className="adminsStatusLabel pendingStatusLabel">{props.admin.status}, resend invite</div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="createCampaignModal ">
      <div className="exit" onClick={props.onCloseModal}>
        <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
      </div>
      <div className="modalHeaderCreateCampaign">Create new Campaign</div>
      <div className="modalSubHeaderCreateCampaign">General Campaign info</div>
      <Grid container spacing={0} direction="row" alignItems="flex-start" justify="flex-start">
        <Grid item xs={12} md={6}>
          {photoImg ? (
            <div className="imageCreateCampaignDiv">
              <div
                className="imageCreateCampaign"
                style={{
                  backgroundImage: `url(${photoImg})`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  cursor: "pointer",
                }}
                onClick={() => {
                  let selectProfilePhoto = document.getElementById("selectCampaignImage");
                  if (selectProfilePhoto) {
                    //console.log('entra');
                    selectProfilePhoto.click();
                  }
                }}
              ></div>
              <div className="removeImageButtonCreateCampaign" onClick={() => removeCampaignImage()}>
                <SvgIcon>
                  <CloseSolid />
                </SvgIcon>
              </div>
            </div>
          ) : (
            <div
              className="dragImageHereCreateCampaign"
              onDragOver={dragOver}
              onDragEnter={dragEnter}
              onDragLeave={dragLeave}
              onDrop={fileDrop}
              onClick={() => {
                if (inputRef && inputRef.current) {
                  inputRef.current.click();
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <img className="dragImageHereIcon" src={imageIcon} alt={"camera"} />
              <InputWithLabelAndTooltip
                onInputValueChange={fileInputCampaignPhoto}
                reference={inputRef}
                hidden
                type="file"
                style={{
                  display: "none",
                }}
              />
              <div className="dragImageHereLabel">Drag Image Here</div>
            </div>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderInputCreateModal({
            name: "Campaign name",
            placeholder: "Enter campaign name...",
            type: "text",
            width: 400,
            item: "Name",
            index: 0,
          })}
          <InputWithLabelAndTooltip
            labelName="Campaign text"
            tooltip={""}
            overriedClasses="textAreaCreateCampaign"
            inputValue={campaign.text}
            onInputValueChange={elem => {
              let campaignCopy = { ...campaign };
              campaignCopy.Text = elem.target.value;
              setCampaign(campaignCopy);
            }}
            placeHolder="Enter Campaign description..."
          />
        </Grid>
      </Grid>
      <AppBar position="static" className="appBarTabsCreateCampaigns">
        <Tabs
          value={tabsCreateCampaignsValue}
          className="tabsCreateCampaigns"
          onChange={handleChangeTabsCreateCampaigns}
        >
          <Tab label="Pods" />
          <Tab label="Credit Pools" />
          <Tab label="Communities" />
        </Tabs>
      </AppBar>
      <div
        style={{
          width: "calc(350px - 46px)",
        }}
      >
        <SearchWithCreate
          searchValue={tabSearcher}
          handleSearchChange={e => {
            let value = e.target.value;
            setTabSearcher(value);
          }}
          searchPlaceholder={"Search for " + tabsCreateCampaignsLabel}
        />
      </div>
      {selectedItem && (
        <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
          <Grid item xs={12} md={6}>
            {selectedItemType === "Pod" ? (
              <PodItemCreateCampaign
                item={selectedItem}
                selected={true}
                unSelectItem={index => {
                  //console.log(item);
                  setSelectedItem("");
                  setSelectedItemId("");
                  setSelectedItemType("");
                  allPods[index].selected = false;
                }}
                index={0}
              />
            ) : selectedItemType === "Pool" ? (
              <PoolItemCreateCampaign
                item={selectedItem}
                selected={true}
                unSelectItem={index => {
                  //console.log(item);
                  setSelectedItem("");
                  setSelectedItemId("");
                  setSelectedItemType("");
                  creditPools[index].selected = false;
                }}
                index={0}
              />
            ) : selectedItemType === "Community" ? (
              <CommunityItemCreateCampaign
                item={selectedItem}
                selected={true}
                unSelectItem={index => {
                  //console.log(item);
                  setSelectedItem("");
                  setSelectedItemId("");
                  setSelectedItemType("");
                  communities[index].selected = false;
                }}
                index={0}
              />
            ) : null}
          </Grid>
        </Grid>
      )}
      <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
        {tabsCreateCampaignsValue === 0
          ? searchedPods.map((item, i) => {
              if (!item.selected) {
                return (
                  <Grid item xs={12} md={6} key={i}>
                    <PodItemCreateCampaign
                      item={item}
                      selected={item.selected}
                      selectItem={index => {
                        item.selected = true;
                        //console.log(item);
                        setSelectedItem(item);
                        setSelectedItemId(item.PodAddress);
                        setSelectedItemType("Pod");
                        allPods.forEach((value, i) => {
                          if (i !== index) {
                            value.selected = false;
                          }
                        });
                      }}
                      index={i}
                    />
                  </Grid>
                );
              } else return null;
            })
          : tabsCreateCampaignsValue === 1
          ? searchedCreditPools.map((item, i) => {
              if (!item.selected) {
                return (
                  <Grid item xs={12} md={6} key={i}>
                    <PoolItemCreateCampaign
                      item={item}
                      selected={item.selected}
                      selectItem={index => {
                        item.selected = true;
                        //console.log(item);
                        setSelectedItem(item);
                        setSelectedItemId(item.CreditAddress);
                        setSelectedItemType("Pool");
                        creditPools.forEach((value, i) => {
                          if (i !== index) {
                            value.selected = false;
                          }
                        });
                      }}
                      index={i}
                    />
                  </Grid>
                );
              } else return null;
            })
          : tabsCreateCampaignsValue === 2
          ? searchedCommunities.map((item, i) => {
              if (!item.selected) {
                return (
                  <Grid item xs={12} md={6} key={i}>
                    <CommunityItemCreateCampaign
                      item={item}
                      selected={item.selected}
                      selectItem={index => {
                        item.selected = true;
                        //console.log(item);
                        setSelectedItem(item);
                        setSelectedItemId(item.CommunityAddress);
                        setSelectedItemType("Community");
                        communities.forEach((value, i) => {
                          if (i !== index) {
                            value.selected = false;
                          }
                        });
                      }}
                      index={i}
                    />
                  </Grid>
                );
              } else return null;
            })
          : null}
      </Grid>
      <Divider className="dividerCreateCampaign" />
      <div className="modalSubHeaderCreateCampaign">Duration and budget</div>
      <Grid container spacing={0} direction="row" alignItems="flex-start" justify="flex-start">
        <Grid item xs={12} md={6}>
          <div className="flexRowInputs">
            <div className="infoHeaderCreateCampaign">Date of start</div>
            <img className="infoIconCreateCampaign" src={infoIcon} alt={"info"} />
          </div>
          <div
            className="textFieldCreateCampaign"
            style={{
              width: "calc(400px - 24px)",
              paddingTop: "1px",
              paddingBottom: "1px",
            }}
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                id="date-picker-start-date"
                minDate={minDate}
                format="MM.dd.yyyy"
                placeholder="Select date..."
                value={campaign.DateStart}
                onChange={handleDateOfStartChange}
                keyboardIcon={
                  <img className="iconCalendarCreateCampaign" src={calendarIcon} alt={"calendar"} />
                }
              />
            </MuiPickersUtilsProvider>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="flexRowInputs">
            <div className="infoHeaderCreateCampaign">Expiration date</div>
            <img className="infoIconCreateCampaign" src={infoIcon} alt={"info"} />
          </div>
          <div
            className="textFieldCreateCampaign"
            style={{
              width: "calc(400px - 24px)",
              paddingTop: "1px",
              paddingBottom: "1px",
            }}
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                id="date-picker-expiration-date"
                minDate={minDate}
                format="MM.dd.yyyy"
                placeholder="Select date..."
                value={campaign.DateExpiration}
                onChange={handleExpirationDateChange}
                keyboardIcon={
                  <img className="iconCalendarCreateCampaign" src={calendarIcon} alt={"calendar"} />
                }
              />
            </MuiPickersUtilsProvider>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          {renderInputCreateModal({
            name: "Total budget (%)",
            placeholder: "0",
            type: "number",
            item: "TotalBudget",
            width: 400,
            index: 11,
          })}
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="flexRowInputs">
            {renderInputCreateModal({
              name: "Prices",
              placeholder: "0.00",
              type: "number",
              item: "Prices",
              width: 260,
              index: 5,
            })}
            <div className="collateralSelector">
              <SelectorCreateModal
                width={130}
                selectValue={pricingSelector}
                selectFunction={handleChangePriceType}
                selectItems={pricingTypes}
              />
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          {renderInputCreateModal({
            name: "Daily budget (%)",
            placeholder: "0",
            type: "number",
            item: "DailyBudget",
            width: 400,
            index: 11,
          })}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderInputCreateModal({
            name: "Weekly budget (%)",
            placeholder: "0",
            type: "number",
            item: "WeeklyBudget",
            width: 400,
            index: 11,
          })}
        </Grid>
      </Grid>

      <Grid
        container
        className="buySwapDataCreateCampaignRow"
        spacing={0}
        direction="row"
        alignItems="center"
        justify="center"
      >
        <Grid item xs={6} md={3}>
          Not enough pDATA tokens?
        </Grid>
        <Grid item xs={8} md={4}>
          <button onClick={handleOpenSwapModal}>Swap for pDATA</button>
          <SwapModal
            open={openSwapModal}
            handleClose={handleCloseSwapModal}
            tokens={tokens}
            tokenTo={"pDATA"}
          />
        </Grid>
      </Grid>

      <div className="modalSubHeaderCreateCampaign">Targeting</div>
      <ArrayAddItems
        title="Hashtag"
        addBoolean={addHashtag}
        string="Hashtag"
        setterValue={setHashtag}
        value={hashtag}
        array={hashtags}
        setterArray={setHashtags}
        setterAddBoolean={setAddHashtag}
        placeholder="Hashtag..."
      />

      <Grid
        container
        style={{
          marginBottom: "20px",
        }}
        spacing={0}
        direction="row"
        alignItems="center"
        justify="center"
      >
        <Grid item xs={8} md={4}>
          <div className="flexRowInputs">
            <div className="infoHeaderCreatePod">Age range</div>
            <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
          </div>
          <SelectorCreateModal
            width={260}
            selectValue={ageRangeSelector}
            selectFunction={handleChangeAgeRangeSelector}
            selectItems={["18-25", "25-35", "35-45", "45-55", "55+"]}
          />
        </Grid>
        <Grid item xs={4} md={2}>
          <div className="flexRowInputs">
            <div className="infoHeaderCreatePod">Sex</div>
            <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
          </div>
          <SelectorCreateModal
            width={130}
            selectValue={sexSelector}
            selectFunction={handleChangeSexSelector}
            selectItems={["Male", "Female", "Prefer not to say"]}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <div className="flexRowInputs">
            <div className="infoHeaderCreatePod">Trust score</div>
            <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
          </div>
          <SelectorCreateModal
            width={190}
            selectValue={trustScoreSelector}
            selectFunction={handleChangeTrustScoreSelector}
            selectItems={["0+", "10+", "20+", "30+", "40+", "50+", "60+", "70+", "80+", "90+"]}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <div className="flexRowInputs">
            <div className="infoHeaderCreatePod">Endorsement score</div>
            <img className="infoIconCreatePod" src={infoIcon} alt={"info"} />
          </div>
          <SelectorCreateModal
            width={190}
            selectValue={endorsementScoreSelector}
            selectFunction={handleChangeEndorsementScoreSelector}
            selectItems={["0+", "10+", "20+", "30+", "40+", "50+", "60+", "70+", "80+", "90+"]}
          />
        </Grid>
      </Grid>

      <ArrayAddItems
        title="Location"
        addBoolean={addLocation}
        string={"Location"}
        setterValue={setLocation}
        value={location}
        array={locations}
        setterArray={setLocations}
        setterAddBoolean={setAddLocation}
        placeholder="Location..."
      />
      <ArrayAddItems
        title="Has tokens"
        addBoolean={addHasToken}
        string={"Has tokens"}
        setterValue={setHasToken}
        value={hasToken}
        array={hasTokens}
        setterArray={setHasTokens}
        setterAddBoolean={setAddHasToken}
        placeholder="Token..."
      />
      <ArrayAddItems
        title="Member of pods"
        addBoolean={addMemberOfPods}
        string={"Member of Pods"}
        setterValue={setMemberOfPods}
        value={memberOfPods}
        array={membersOfPods}
        setterArray={setMembersOfPods}
        setterAddBoolean={setAddMemberOfPods}
        placeholder="Pod..."
      />
      <ArrayAddItems
        title="Member of communities"
        addBoolean={addMemberOfCommunities}
        string={"Member of Communities"}
        setterValue={setMemberOfCommunities}
        value={memberOfCommunities}
        array={membersOfCommunities}
        setterArray={setMembersOfCommunities}
        setterAddBoolean={setAddMemberOfCommunities}
        placeholder="Community..."
      />

      <div className="modalSubHeaderCreatePod" style={{ marginTop: "20px" }}>
        User management
      </div>
      <div className="flexRowInputs">
        <div>
          <InputWithLabelAndTooltip
            labelName="Admins (email)"
            tooltip={""}
            overriedClasses="textFieldCreatePod"
            style={{
              width: "calc(350px - 24px)",
            }}
            type="text"
            inputValue={admin.name}
            onInputValueChange={e => {
              let copyAdmin = { ...admin };
              copyAdmin.name = e.target.value;
              setAdmin(copyAdmin);
            }}
            placeHolder="Add admin by email"
          />
        </div>
        <div className="collateralSelector">
          <AddButtonCreateModal function={() => addAdmin()} />
        </div>
      </div>
      {admins && admins.length !== 0 ? (
        <div>
          {admins.map((item, i) => {
            return <AdminsMailLabel key={i} index={i} admin={item} />;
          })}
        </div>
      ) : null}
      <div className="flexRowInputs">
        <div>
          <InputWithLabelAndTooltip
            labelName="User and roles"
            tooltip={""}
            overriedClasses="textFieldCreatePod"
            style={{
              width: "calc(350px - 24px)",
            }}
            type="text"
            inputValue={userRoles.name}
            onInputValueChange={e => {
              let copyUserRoles = { ...userRoles };
              copyUserRoles.name = e.target.value;
              setUserRoles(copyUserRoles);
            }}
            placeHolder="Add user by email"
          />
        </div>
        <div className="collateralSelector">
          <SelectorCreateModal
            width={120}
            selectValue={""}
            //selectFunction={} TODO: there was another handler assigned to this and gave error
            selectItems={["Admin", "Admin"]}
          />
        </div>
        <div className="collateralSelector">
          <AddButtonCreateModal function={() => addUserRoles()} />
        </div>
      </div>
      {usersRoles && usersRoles.length !== 0 ? (
        <div>
          {usersRoles.map((item, i) => {
            return <AdminsMailLabel key={i} index={i} admin={item} />;
          })}
        </div>
      ) : null}
      {errorMsg.length > 0 ? <div className="error">{errorMsg}</div> : null}
      <div className="buttonCreateCampaignRow">
        <button className="buttonCreatePod" onClick={() => createCampaign()}>
          Create campaign
        </button>
      </div>
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
    </div>
  );
};

export default CreateCampaignModal;
