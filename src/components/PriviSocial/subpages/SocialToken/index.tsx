import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core";
import { Gradient, PrimaryButton, TabNavigation, Color } from "shared/ui-kit";

import { useTypedSelector } from "store/reducers/Reducer";
import { sumTotalViews } from "shared/functions/totalViews";
import URL from "shared/functions/getURL";
import PerksRewardsTab from "./components/PerksRewardsTab";
import DetailsTab from "./components/DetailsTab";
import SocialTokenContext from "./context";
import PerkPage from "./PerkPage";
import HistoryTab from "./components/HsitoryTab";
import { AirdropTokensModal } from "./modals/AirdropTokensModal/AirdropTokensModal";
import CreateBadgeModal from "./modals/Create-badge/CreateBadgeModal";
import AddPerksModal from "./modals/AddPerksModal";
import LoadingIndicator from "shared/ui-kit/LoadingIndicator/LoadingIndicator";
import Box from "shared/ui-kit/Box";
import { getOwnSocialToken } from "shared/services/API";
import { formatNumber } from "shared/functions/commonFunctions";

export const useSocialTokenStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    overflowY: "auto",
    maxHeight: "calc(100vh - 82px)",
    "& nav": {
      marginTop: "36px",
      marginBottom: "34px",
      color: "transparent",
      background: "#727F9A",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: "14px",
      cursor: "pointer",
      width: "fit-content",
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
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    background: "#F6F8FF",
    boxShadow: "0px 3px 7px rgba(0, 0, 0, 0.12)",
    borderRadius: 26,
    padding: 40,
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
    "& h1": {
      margin: 0,
      fontFamily: "Agrandir",
      fontWeight: "bold",
      fontSize: "70px",
      marginTop: theme.spacing(2),
      lineHeight: "54px",
      color: "#707582",
      [theme.breakpoints.down("sm")]: {
        fontSize: "40px",
        marginTop: theme.spacing(1),
      },
      [theme.breakpoints.down("xs")]: {
        fontSize: "30px",
        marginTop: theme.spacing(0.5),
      },
    },
    "& h2": {
      margin: 0,
      fontFamily: "Agrandir",
      fontWeight: 300,
      fontSize: "56px",
      marginTop: theme.spacing(1.5),
      lineHeight: "48px",
      color: "#707582",
      [theme.breakpoints.down("sm")]: {
        fontSize: "30px",
        marginTop: theme.spacing(1),
      },
      [theme.breakpoints.down("xs")]: {
        fontSize: "20px",
        marginTop: theme.spacing(0),
      },
    },
    "& span": {
      marginLeft: "5px",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "22px",
      marginBottom: "-15px",
      [theme.breakpoints.down("sm")]: {
        fontSize: "20px",
        marginBottom: "-10px",
      },
      [theme.breakpoints.down("xs")]: {
        fontSize: "20px",
        marginBottom: 0,
      },
    },
  },
  headerValueBox: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  tokenImage: {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    marginRight: "12px",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    [theme.breakpoints.down("sm")]: {
      width: "40px",
      height: "40px",
    },
    [theme.breakpoints.down("xs")]: {
      width: "30px",
      height: "30px",
    },
  },
  buttonsBox: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",

    "& button": {
      background: "#707582",
      border: "1.5px solid #727F9A",
      boxSizing: "border-box",
      backdropFilter: "blur(10px)",
      borderRadius: "6px",
    },

    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      "& > button": {
        width: "100%",
        marginLeft: "0px !important",
        marginBottom: theme.spacing(1),
      },
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: "row",
      marginTop: theme.spacing(2),
      "& > button": {
        marginLeft: "8px !important",
      },
    },
  },
  appbarContainer: {
    margin: "64px 0px",
    width: "100%",
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
      fontWeight: 800,
      fontSize: "18px",
      color: "#707582",
    },
    "& h5": {
      fontWeight: 800,
      fontSize: "18px",
      color: "#707582",
      margin: "0px 0px 16px 0px",
    },
    "& p": {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "14px",
      color: "#707582",
      margin: 0,
    },
    "& b": {
      marginBottom: "2px",
      fontSize: "14px",
      color: "#949BAB",
    },
    "& h2": {
      margin: "16px 0 0 0",
      fontFamily: "Agrandir",
      fontWeight: 800,
      fontSize: "40px",
      color: "#707582",
      [theme.breakpoints.down("xs")]: {
        fontSize: "28px",
        margin: "8px 0 0 0",
      },
    },
  },
  infoRow: {
    background: "#F6F8FF",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    borderRadius: 24,
    padding: 24,
    display: "flex",
    width: "100%",
    marginBottom: "80px",
    justifyContent: "space-between",
    "& > div": {
      "& button": {
        marginBottom: "0px !important",
      },
    },
    [theme.breakpoints.down("xs")]: {
      flexWrap: "wrap",
    },
  },

  label: {
    fontWeight: 800,
    fontSize: "22px",
    color: Color.GrayDark,
    marginBottom: "25px",
    marginTop: "40px",
    [theme.breakpoints.down("xs")]: {
      marginTop: "20px",
    },
  },

  inputContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
      fontSize: 14,
      "&::placeholder": {
        color: "#ABB3C4",
      },
    },
    "& img": {
      width: "17px",
      height: "17px",
    },

    [theme.breakpoints.down("sm")]: {
      marginRight: 0,
    },
  },
  slider: {
    width: "210px",
  },

  sliderBox: {
    display: "flex",
    alignItems: "flex-end",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(2),
    },
  },

  about: {
    width: "100%",
    padding: "0px 0px 24px",
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

let pathName = window.location.href;
const tabOptions = ["Perks & Rewards", "Details", "History"];

export default function SocialToken() {
  const params: any = useParams();
  const user = useTypedSelector(state => state.user);

  const classes = useSocialTokenStyles();
  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);
  const [socialToken, setSocialToken] = useState<any>(null);
  const [menuSelection, setMenuSelection] = useState<number>(0);

  const [selectedPerk, setSelectedPerk] = useState<any>(null);
  const [triggerPerks, setTriggerPerks] = useState<any>(false);

  const [openAirdropTokenModal, setOpenAirdropTokenModal] = useState<boolean>(false);
  const [openCreateBadgeModal, setOpenCreateBadgeModal] = useState<boolean>(false);
  const [openAddPerksModal, setOpenAddPerksModal] = useState<boolean>(false);

  const isCreator = socialToken && socialToken.Creator == user.address;

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
    if (params && params.id) {
      loadData();
    }
  }, [params?.id]);

  const loadData = async () => {
    setLoading(true);
    getOwnSocialToken(params.id)
      .then(resp => {
        if (resp.success) {
          const newSocialToken = resp.data;
          sumTotalViews({ tokenSymbol: newSocialToken.TokenSymbol });
          newSocialToken.imageURL = newSocialToken.HasPhoto
            ? `${URL()}/social/getPhoto/${newSocialToken.TokenSymbol}`
            : "";
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
            <nav onClick={() => history.push(`/privi-social/${pathName.split("/")[5]}`)}>{`< Back`}</nav>
            <div className={classes.header}>
              <Box className={classes.headerValueBox}>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <div
                    className={classes.tokenImage}
                    style={{
                      backgroundImage:
                        socialToken && socialToken.imageURL && socialToken.imageURL !== ""
                          ? `url(${socialToken.imageURL})`
                          : "url(https://uploadsdev.ams3.digitaloceanspaces.com/users/Pxd83daf14-8909-4584-9124-f29934910547.mp4?1625161366176)", /// should be updated to "none" or default image
                    }}
                  />
                  <h1 style={{ marginRight: 36 }}>{socialToken.TokenSymbol ?? "Name"}</h1>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <h2 style={{ marginRight: 5 }}>
                    {formatNumber(socialToken.Price ?? 0, socialToken.FundingToken ?? "Privi", 4)}
                  </h2>
                  <span
                    style={{
                      color:
                        socialToken.PriceChangePct && socialToken.PriceChangePct < 0
                          ? "#F43E5F"
                          : socialToken.PriceChangePct && socialToken.PriceChangePct > 0
                            ? "#65CB63"
                            : "#707582",
                    }}
                  >
                    {socialToken.PriceChangePct && socialToken.PriceChangePct > 0 && "+"}
                    {socialToken.PriceChangePct ? (socialToken.PriceChangePct * 100).toFixed(2) : "0.00"}%
                  </span>
                </Box>
              </Box>
              <Box className={classes.buttonsBox}>
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
                theme="green"
                size="large"
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
                <DetailsTab socialToken={socialToken} isCreator={isCreator} handleRefresh={loadData} />
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
                handleRefresh={() => { }}
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
