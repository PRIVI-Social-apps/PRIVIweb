import React, { useEffect, useState } from "react";
import axios from "axios";

import { makeStyles } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";
import { Gradient, SecondaryButton, PrimaryButton } from "shared/ui-kit";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";
import DistributionProposalModal from "components/legacy/Pods/Pod-Page/modals/claimable/DistributionProposal";

import URL from "shared/functions/getURL";
import Box from 'shared/ui-kit/Box';

const useStyles = makeStyles(() =>
  createStyles({
    proposalsContent: {
      width: "100%",
      display: "flex",
    },
    proposalsRow: {
      display: "flex",
      width: "100%",
    },
    artistsList: {
      display: "flex",
      flexDirection: "column",
      padding: "24px 22px",
      background: "#FFFFFF",
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
      borderRadius: "16px",
      minHeight: "616px",
      marginRight: "20px",
      "& h5": {
        borderBottom: "1px solid #1717171a",
        margin: "0px",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "18px",
        color: "#181818",
        paddingBottom: "16px",
      },
    },
    artistTiles: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      overflowY: "auto",
      marginBottom: "26px",
    },
    proposalTile: {
      display: "flex",
      flexDirection: "column",
      borderBottom: "1px dashed #1717174d",
      padding: "16px 0px",
      "&:last-child": {
        borderBottom: "none",
      },
    },
    artistTile: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      borderBottom: "1px dashed #1717174d",
      padding: "16px 0px",
      "&:last-child": {
        borderBottom: "1px solid #1717171a !important",
      },
    },
    column: {
      display: "flex",
      flexDirection: "column",
    },
    artistImage: {
      border: "2px solid #FFFFFF",
      marginRight: "14px",
      width: "48px",
      height: "48px",
      minWidth: "48px",
      borderRadius: "24px",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    artistName: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#181818",
      display: "flex",
      "& > div": {
        color: "white",
        fontSize: "11px",
        fontWeight: "normal",
        padding: "4px 6px 3px",
        background: Gradient.Magenta,
        borderRadius: "8px",
        marginLeft: "8px",
        width: "fit-content",
      },
    },
    artistSlug: {
      background: Gradient.Magenta,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    percent: {
      marginRight: "11px",
      fontSize: "18px",
      color: "#181818",
    },
    price: {
      fontSize: "14px",
      color: "#181818",
      "& span": {
        color: "#707582",
        marginLeft: "8px",
      },
    },
    status: {
      display: "flex",
      fontSize: "14px",
      textAlign: "right",
      color: "#707582",
      marginTop: "9px",
      "& img": {
        width: "18px",
        height: "18px",
        marginLeft: "7px",
      },
    },
    buttons: {
      marginTop: "8px",
      marginBottom: "14px",
      display: "flex",
      justifyContent: "space-between",
      columnGap: 10,
      "& button": {
        flex: 1,
        marginBottom: "0px !important",
      },
    },

    close: {
      alignSelf: "flex-end",
      marginBottom: "20px",
      width: "14px",
      height: "14px",
      cursor: "pointer",
    },
    proposalTileHeader: {
      display: "flex",
      width: "100%",
      alignItems: "flex-end",
      justifyContent: "space-between",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "18px",
      color: "#181818",
      marginBottom: "16px",
      "& span": {
        marginLeft: "8px",
        marginBottom: "2px",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "11px",
        display: "flex",
        alignItems: "center",
      },
      "& img": {
        width: "18px",
        height: "18px",
        marginLeft: "7px",
      },
      "& h6": {
        margin: 0,
        cursor: "pointer",
        fontWeight: "normal",
        fontSize: "14px",
        background: Gradient.Mint,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textDecoration: "underline",
      },
    },
    proposalHeader: {
      marginBottom: "20px",
      display: "flex",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "18px",
      color: "#707582",

      "& span": {
        fontWeight: "normal",
        fontSize: "14px",
        background: Gradient.Magenta,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
      "& img": {
        width: "18px",
        height: "18px",
        marginLeft: "7px",
      },
    },

    create: {
      minHeight: "616px",
      cursor: "pointer",
      background: "#F7F9FE",
      border: "1px dashed #727F9A",
      boxSizing: "border-box",
      borderRadius: "10px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "18px",
      textAlign: "center",
      width: "calc(100% / 3)",
      color: "#727F9A",
      "& img": {
        marginBottom: "24px",
      },
      "& span": {
        marginTop: "24px",
        fontSize: "14px",
        background: Gradient.Mint,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },

    appbarContainer: {
      width: "100%",
      marginBottom: "20px",
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
      fontSize: "18px",
      fontFamily: "Agrandir",
      textTransform: "none",
      padding: "0px 25px",
      minHeight: "auto !important",
      minWidth: "auto !important",
      marginRight: "17px",
    },
    selected: {
      color: "transparent",
      background: Gradient.Mint,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
  })
);

export const mockArtists = [
  { id: "Px04354c7d-7c9f-4786-8e86-81e5add758ab", proposer: true, percent: 0.2, claimStatus: "VERIFIED" },
  { id: "Px05ea9c6a-1732-4168-8c4e-c7ebe5048e76", percent: 0.2, claimStatus: "Pending" },
  { id: "Px0ca8bb6a-c19f-4f77-a058-ace13c772adb", percent: 0.2, claimStatus: "pending" },
  { id: "Px0cb43345-43f0-4070-972d-a24f55fed269", percent: 0.2, claimStatus: "verified" },
  { id: "Px0ebd5b2c-3110-4bf2-b670-1e1037a66905", percent: 0.2, claimStatus: "verified" },
];

export default function DistributionProposals({ pod, trigger, refreshPod }) {
  const usersList = useSelector((state: RootState) => state.usersInfoList);
  const userSelector = useSelector((state: RootState) => state.user);

  const classes = useStyles();

  //proposals -> proposals in pod
  const [proposals, setProposals] = useState<any>([]);
  // artists -> only 1 proposal in pod
  // const [artists, setArtists] = useState<any>(mockArtists);

  const [proposalsTabSelction, setProposalsTabSelection] = useState<number>(0);
  const [proposalIndexSelection, setProposalIndexSelection] = useState<number>(-1);

  const [openDistributionProposalsModal, setOpenDistributionProposalsModal] = useState<boolean>(false);
  const handleOpenDistributionProposalsModal = () => {
    setOpenDistributionProposalsModal(true);
  };
  const handleCloseDistributionProposalsModal = () => {
    setOpenDistributionProposalsModal(false);
  };

  /*useEffect(() => {
    //TODO: get artists
    if (usersList && usersList.length > 0) {
      const a = [...artists];
      a.forEach((art, index) => {
        let thisUser = usersList.find(u => u.id === art.id);
        if (thisUser) {
          a[index].name = thisUser.name;
          a[index].urlSlug = thisUser.urlSlug;
          a[index].imageURL = thisUser.imageURL;
        }
        a[index].randomAvatar = require(`assets/anonAvatars/ToyFaces_Colored_BG_${Math.floor(
          Math.random() * 118 + 1
        )
          .toString()
          .padStart(3, "0")}.jpg`);
      });

      setArtists(a);

      const p = [...proposals];
      p.forEach((proposal, i) => {
        if (proposal.artists && proposal.artists.lenght > 0) {
          proposal.artists.forEach((a, index) => {
            let thisUser = usersList.find(u => u.id === a.id);
            if (thisUser) {
              proposal[i].artists[index].name = thisUser.name;
              proposal[i].artists[index].urlSlug = thisUser.urlSlug;
              proposal[i].artists[index].imageURL = thisUser.imageURL;
            }
            proposal[i].artists[
              index
            ].randomAvatar = require(`assets/anonAvatars/ToyFaces_Colored_BG_${Math.floor(
              Math.random() * 118 + 1
            )
              .toString()
              .padStart(3, "0")}.jpg`);
          });
        }
      });

      setProposals(p);
    }
  }, [usersList]);*/

  useEffect(() => {
    getDistributionProposals();
  }, [trigger]);

  const loadData = () => {
    //TODO: load data
    //this will be called when updating artists from modal
  };

  const getDistributionProposals = () => {
    axios
      .get(`${URL()}/claimableSongs/distributionProposal/${pod.id}`)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          const MockProposal = {
            id: 1,
            artists: mockArtists
          }

          setProposals([...resp.data, MockProposal]);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const declineDistributionProposal = (proposal: any) => {
    let body: any = {
      claimableSongId: pod.id,
      distributionProposalId: proposal.id,
      artistId: userSelector.id,
    };

    axios
      .post(`${URL()}/claimableSongs/distributionProposal/declineUser`, body)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          let propos: any = [...proposals];
          let findPropos = propos.findIndex(prop => prop.id === proposal.id);
          propos[findPropos].artists = resp.data;
          setProposals(propos);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const acceptDistributionProposal = (proposal: any) => {
    let body: any = {
      claimableSongId: "",
      distributionProposalId: proposal.id,
      artistId: userSelector.id,
    };

    axios
      .post(`${URL()}/claimableSongs/distributionProposal/acceptUser`, body)
      .then(res => {
        const resp = res.data;
        if (resp.success) {
          let propos: any = [...proposals];
          let findPropos = propos.findIndex(prop => prop.id === proposal.id);
          propos[findPropos].artists = resp.data;
          setProposals(propos);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  if (pod)
    return (
      <div className={classes.proposalsContent}>
        <div className={classes.proposalsRow}>
          {proposals.length > 0 &&
            proposals.map((proposal, index) => {
              console.log(index, proposal);
              return (
                <div className={classes.artistsList} key={`proposal-${index}`}>
                  <h5>Funds Distribution Proposal</h5>
                  <div
                    className={classes.artistTiles}
                    style={
                      proposal.artists && proposal.artists.findIndex(art => art.id === userSelector.id) !== -1
                        ? { height: "calc(616px - 218px)" }
                        : { height: "100%" }
                    }
                  >
                    {proposal.artists &&
                      proposal.artists.length > 0 &&
                      proposal.artists.map((artist, index) => (
                        <ArtistTile key={`artist-${index}`} artist={artist} pod={pod} />
                      ))}
                  </div>
                  <>
                    <div className={classes.buttons}>
                      <SecondaryButton
                        size="medium"
                        onClick={() => declineDistributionProposal(proposal)}
                      >
                        Decline
                      </SecondaryButton>
                      <SecondaryButton size="medium" onClick={() => acceptDistributionProposal(proposal)}>
                        {`Accept & Sign`}
                      </SecondaryButton>
                    </div>
                    <PrimaryButton size="medium" onClick={() => {}}>
                      Place counter Proposal
                    </PrimaryButton>
                  </>
                </div>
              );
            })}
          <div className={classes.create} onClick={handleOpenDistributionProposalsModal}>
            <img src={require("assets/icons/crown.png")} alt="crown" />
            Create New Distribution Proposal
            <span>Let's get Started</span>
          </div>
        </div>

        <DistributionProposalModal
          open={openDistributionProposalsModal}
          handleClose={handleCloseDistributionProposalsModal}
          artists={pod?.common?.artists || []}
          pod={pod}
          handleUpdate={loadData}
        />
      </div>
    );
  else return null;
};

const ArtistTile = ({ artist, pod }) => {
  const usersList = useSelector((state: RootState) => state.usersInfoList);

  const classes = useStyles();
  const { convertTokenToUSD } = useTokenConversion();

  return (
    <div className={classes.artistTile}>
      <Box display="flex" alignItems="center" marginRight={"15px"}>
        <div
          className={classes.artistImage}
          style={{
            backgroundImage:
              usersList[artist.id] &&
              usersList[artist.id].imageURL &&
              usersList[artist.id].imageURL.length > 0
                ? `url(${usersList[artist.id].imageURL})`
                : usersList[artist.id] && usersList[artist.id].anonAvatar
                ? `url(${usersList[artist.id].anonAvatar})`
                : `url(${require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")})`,
          }}
        />
        <Box display="flex" flexDirection="column">
          <div className={classes.artistName}>
            {usersList[artist.id] && usersList[artist.id].name ? usersList[artist.id].name : "Artist Name"}
            {artist.proposer && <div>Proposer</div>}
          </div>
          <div className={classes.artistSlug}>
            @
            {usersList[artist.id] && usersList[artist.id].urlSlug ? usersList[artist.id].name : "Artist Name"}
          </div>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <Box display="flex">
          <div className={classes.percent}>{artist.rate ? artist.rate.toFixed() : "N/A"}%</div>
          <div className={classes.price}>
            {pod.priceToken ?? "ETH"}
            {pod.price && artist.rate ? (pod.price * artist.rate) / 100 : "N/A"}
            <span>
              ($
              {pod.priceToken && pod.price && artist.rate
                ? convertTokenToUSD(pod.priceToken, (pod.price * artist.rate) / 100)
                : "N/A"}
              )
            </span>
          </div>
        </Box>
        <div className={classes.status}>
          {artist.status && artist.status.toUpperCase() === "ACCEPTED"
            ? `Accepted`
            : artist.status && artist.status.toUpperCase() === "PENDING"
            ? `Pending`
            : `Declined`}
          <img
            src={require(`assets/icons/${
              artist.status && artist.status.toUpperCase() === "ACCEPTED"
                ? `verified_green`
                : artist.status && artist.status.toUpperCase() === "PENDING"
                ? `clock_gray`
                : `warning`
            }.png`)}
            alt={`tick`}
          />
        </div>
      </Box>
    </div>
  );
};
