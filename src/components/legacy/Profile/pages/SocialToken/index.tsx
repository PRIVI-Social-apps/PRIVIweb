import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";

import { makeStyles } from "@material-ui/core";
import { Gradient, PrimaryButton, TabNavigation } from "shared/ui-kit";

import { useTypedSelector } from "store/reducers/Reducer";
import { sumTotalViews } from "shared/functions/totalViews";
import URL from "shared/functions/getURL";
import PerksRewardsTab from "./components/PerksRewardsTab";
import DetailsTab from "./components/DetailsTab";
import SocialTokenContext from "./context";
import PerkPage from "./PerkPage";
import HistoryTab from "./components/HsitoryTab";
import { AirdropTokensModal } from "../../modals/AirdropTokensModal/AirdropTokensModal";
import CreateBadgeModal from "../../modals/Create-badge/CreateBadgeModal";
import AddPerksModal from "./modals/AddPerksModal";
import LoadingIndicator from "shared/ui-kit/LoadingIndicator/LoadingIndicator";
import Box from 'shared/ui-kit/Box';

export const useSocialTokenStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    padding: "0px 120px",
    overflowY: "auto",
    maxHeight: "calc(100vh - 82px)",
    "& nav": {
      marginTop: "36px",
      marginBottom: "34px",
      color: "transparent",
      background: Gradient.Mint,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: "14px",
      cursor: "pointer",
    },
    "& ::-webkit-scrollbar-thumb": {
      background: "#707582",
      opacity: "50%",
    },
    "& ::-webkit-scrollbar-track": {
      background: "#EFF2F8",
    },
    "& button": {
      "& img": {
        marginRight: "6px",
        width: "15.75px",
        heighgt: "15.35px",
        verticalAlign: "center",
      },
    },
  },
  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
    "& h1": {
      margin: 0,
      fontFamily: "Agrandir GrandLight",
      fontWeight: "normal",
      fontSize: "56px",
      lineHeight: "48px",
      color: "#181818",
    },
    "& span": {
      marginLeft: "5px",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "22px",
      marginBottom: "-15px",
    },
    "& button": {
      marginBottom: "0x !important",
    },
  },
  tokenImage: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    marginRight: "5px",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  appbarContainer: {
    marginTop: "60px",
    width: "100%",
    borderBottom: "3px solid #eff2f8",
    marginBottom: "46px",
  },
  appbar: {
    marginLeft: 0,
    backgroundColor: "transparent !important",
    boxShadow: "none !important",
    marginBottom: "-3px",
  },
  tabs: {
    marginLeft: 0,
    backgroundColor: "transparent !important",
    boxShadow: "none !important",
  },
  tab: {
    whiteSpace: "inherit",
    marginLeft: 0,
    color: "#abb3c4",
    boxShadow: "none !important",
    fontWeight: "bold",
    fontSize: "25px",
    fontFamily: "Agrandir",
    textTransform: "none",
    padding: "0px",
    minHeight: "auto !important",
    minWidth: "auto !important",
    marginRight: "42px",
  },
  selectedTab: {
    color: "transparent",
    background: Gradient.Mint,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  content: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    paddingBottom: "20px",
    "& span": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "14px",
      color: "#707582",
    },
    "& h5": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "18px",
      color: "#707582",
      margin: 0,
    },
    "& p": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "14px",
      color: "#949BAB",
      marginTop: "0px",
      marginBottom: "15px",
    },
    "& b": {
      marginBottom: "2px",
      fontSize: "14px",
      color: "#949BAB",
    },
    "& h2": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "40px",
      color: "#181818",
      margin: 0,
    },
  },
  infoRow: {
    borderBottom: "1px solid #6f748033",
    padding: "0px 0px 18px",
    display: "flex",
    width: "100%",
    marginBottom: "42px",
    justifyContent: "space-between",
    "& > div": {
      marginRight: "68px",
      "&:last-child": {
        marginRight: "0px !important",
      },
      "& > div": {
        marginRight: "68px",
      },
      "& button": {
        marginBottom: "0px !important",
      },
    },
  },

  label: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "22px",
    color: "#181818",
    marginBottom: "25px",
    marginTop: "40px",
  },

  inputContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "485px",
    background: "#F7F9FE",
    border: "1px solid #E0E4F3",
    borderRadius: "6px",
    color: "#ABB3C4",
    paddingRight: "18px",
    height: "40px",
    marginRight: "20px",
    "& input": {
      border: "none",
      margin: 0,
      background: "transparent",
      width: "100%",
      padding: "12.5px 18px 10.5px",
      outline: "none",
    },
    "& img": {
      width: "17px",
      height: "17px",
    },
  },
  slider: {
    width: "210px",
  },

  about: {
    width: "100%",
    padding: "32px 0px 24px",
    borderTop: "1px dashed #6f748033",
    borderBottom: "1px solid #6f748033",
    marginBottom: "24px",
  },
  network: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "11px",
    width: "fit-content",
    color: "#707582",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "6px 11px 4px",
    border: "1px solid #707582",
    borderRadius: " 14px",
  },

  notFound: {
    width: "100%",
    padding: "120px",
    "& nav": {
      marginTop: "36px",
      marginBottom: "34px",
      color: "transparent",
      background: Gradient.Mint,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: "14px",
      cursor: "pointer",
      width: "fit-content",
    },
  },
}));

const pathName = window.location.href;
const tokenSymbol = pathName.split("/")[7];

export default function SocialToken() {
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  const classes = useSocialTokenStyles();
  const history = useHistory();

  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [socialToken, setSocialToken] = useState<any>(false);
  const [menuSelection, setMenuSelection] = useState<number>(0);

  const [selectedPerk, setSelectedPerk] = useState<any>(null);
  const [triggerPerks, setTriggerPerks] = useState<any>(false);

  const [openAirdropTokenModal, setOpenAirdropTokenModal] = useState<boolean>(false);
  const [openCreateBadgeModal, setOpenCreateBadgeModal] = useState<boolean>(false);
  const [openAddPerksModal, setOpenAddPerksModal] = useState<boolean>(false);

  const tabOptions = ["Perks & Rewards", "Details", "History"];

  const handleOpenAirdropTokenModal = () => {
    setOpenAirdropTokenModal(true);
  };
  const handleOpenCreateBadgeModal = () => {
    setOpenCreateBadgeModal(true);
  };
  const handleOpenAddPerksModal = () => {
    setOpenAddPerksModal(true);
  };
  const handleCloseAirdropTokenModal = () => {
    setOpenAirdropTokenModal(false);
  };
  const handleCloseCreateBadgeModal = () => {
    setOpenCreateBadgeModal(false);
  };
  const handleCloseAddPerksModal = () => {
    setOpenAddPerksModal(false);
  };

  useEffect(() => {
    if (users && users.length > 0) {
      loadData();
    }
  }, [users, window.location.href]);

  const loadData = async () => {
    setLoading(true);
    Axios.get(`${URL()}/social/getSocialToken/${tokenSymbol}`)
      .then(res => {
        const resp = res.data;

        if (resp.success) {
          sumTotalViews({ tokenSymbol });

          const newSocialToken = resp.data;
          const holdersInfo = newSocialToken.HoldersInfo ?? [];
          const newOwners: any[] = [];
          newSocialToken.creatorInfo = users.find(
            u =>
              newSocialToken.Creator &&
              (newSocialToken.Creator === u.id || newSocialToken.Creator === u.address)
          );
          if (
            (newSocialToken.Creator && newSocialToken.Creator === user.address) ||
            (newSocialToken.Creator && newSocialToken.Creator === user.id)
          ) {
            setIsCreator(true);
          }

          if (holdersInfo.length > 0) {
            holdersInfo.forEach(holderInfo => {
              const foundUser = users.find(u => u.address == holderInfo.Address);
              if (foundUser) {
                newOwners.push({
                  imageURL: foundUser.imageUrl,
                  name: foundUser.name,
                  urlSlug: foundUser.urlSlug,
                  verified: foundUser.verified,
                  level: foundUser.level,
                  online: true,
                });
              }
            });
          }
          newSocialToken.owners = newOwners;
          newSocialToken.imageURL = newSocialToken.HasPhoto ? `${URL()}/social/getPhoto/${tokenSymbol}` : "";
          setSocialToken(newSocialToken);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
      });
  };

  if (loading)
    return (
      <Box alignItems="center" className={classes.notFound}>
        <LoadingIndicator />
      </Box>
    );
  else if (socialToken)
    return (
      <SocialTokenContext.Provider
        value={{
          selectedPerk: selectedPerk,
          setSelectedPerk: setSelectedPerk,
        }}
      >
        {selectedPerk ? (
          <PerkPage isCreator={isCreator} token={socialToken.FundingToken} />
        ) : (
          <div className={classes.root}>
            <nav onClick={() => history.push(`/profile/${pathName.split("/")[5]}`)}>{`< back`}</nav>
            <div className={classes.header}>
              <Box display="flex" alignItems="center">
                <div
                  className={classes.tokenImage}
                  style={{
                    backgroundImage:
                      socialToken && socialToken.imageURL && socialToken.imageURL !== ""
                        ? `url(${socialToken.imageURL})`
                        : "none",
                  }}
                />
                <h1 style={{ fontWeight: 800, marginRight: "52px" }}>{socialToken.TokenSymbol ?? "Name"}</h1>
                <h1>{`${socialToken.FundingToken ?? "ETH"} ${socialToken.Price ?? "N/A"}`}</h1>
                <span
                  style={{
                    color:
                      socialToken.pctChange && socialToken.pctChange < 0
                        ? "#65CB63"
                        : socialToken.pctChange && socialToken.pctChange > 0
                        ? "#F43E5F"
                        : "#707582",
                  }}
                >
                  {socialToken.pctChange && socialToken.pctChange > 0
                    ? "+"
                    : socialToken.pctChange && socialToken.pctChange < 0
                    ? "-"
                    : ""}
                  {socialToken.pctChange
                    ? socialToken.pctChange.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })
                    : 0}
                  %
                </span>
              </Box>
              <Box display="flex" alignItems="center">
                {menuSelection === 0 && isCreator && (
                  <PrimaryButton size="medium" onClick={handleOpenCreateBadgeModal}>
                    Create Badge
                  </PrimaryButton>
                )}
                {menuSelection === 0 && isCreator && (
                  <PrimaryButton size="medium" onClick={handleOpenAddPerksModal}>
                    Add Perks
                  </PrimaryButton>
                )}
                {menuSelection === 1 && isCreator && (
                  <PrimaryButton size="medium" onClick={handleOpenAirdropTokenModal}>
                    Airdrop
                  </PrimaryButton>
                )}
              </Box>
            </div>
            <div className={classes.appbarContainer}>
              <TabNavigation
                tabs={tabOptions}
                currentTab={menuSelection}
                variant="primary"
                onTabChange={setMenuSelection}
              />
            </div>
            <div className={classes.content}>
              {menuSelection === 0 ? (
                <PerksRewardsTab
                  socialToken={socialToken}
                  isCreator={isCreator}
                  setTriggerPerks={setTriggerPerks}
                  triggerPerks={triggerPerks}
                />
              ) : menuSelection === 1 ? (
                <DetailsTab socialToken={socialToken} isCreator={isCreator} />
              ) : (
                <HistoryTab socialToken={socialToken} />
              )}
            </div>
            {isCreator && (
              <AirdropTokensModal
                open={openAirdropTokenModal}
                handleClose={handleCloseAirdropTokenModal}
                community={undefined}
                socialToken={socialToken}
              />
            )}
            {isCreator && (
              <CreateBadgeModal
                handleRefresh={() => {}}
                open={openCreateBadgeModal}
                onCloseModal={handleCloseCreateBadgeModal}
              />
            )}
            {/* {isCreator && ( */}
              <AddPerksModal
                open={openAddPerksModal}
                handleClose={handleCloseAddPerksModal}
                socialToken={socialToken}
                handleRefresh={() => {
                  setTriggerPerks(!triggerPerks);
                }}
              />
            {/* )} */}
          </div>
        )}
      </SocialTokenContext.Provider>
    );
  else
    return (
      <div className={classes.notFound}>
        <p>Social token not found ):</p>
        <nav onClick={() => history.push(`/profile/${pathName.split("/")[5]}`)}>{`go back`}</nav>
      </div>
    );
}

