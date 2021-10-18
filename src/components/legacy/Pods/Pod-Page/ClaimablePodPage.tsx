import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Gradient, SecondaryButton, TabNavigation } from "shared/ui-kit";
import { createStyles } from "@material-ui/styles";
import { useTypedSelector } from "store/reducers/Reducer";
import { useHistory } from "react-router-dom";
import Stats from "./components/Claimable/Stats";
import DistributionProposals from "./components/Claimable/DistributionProposals";
import cls from "classnames";
import InvitePeopleModal from "./modals/claimable/InvitePeople";
import ClaimableChat from "./components/Claimable/Chat";
import {trackPromise} from "react-promise-tracker";
import axios from "axios";
import URL from "shared/functions/getURL";
import Box from 'shared/ui-kit/Box';

const useStyles = makeStyles(() =>
  createStyles({
    claimablePodPage: {
      overflowY: "auto",
      height: "calc(100vh - 84px)",
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    overflowHeader: {
      padding: "0px 120px",
      display: "flex",
      marginTop: "63px",
      marginBottom: "calc(-367px - 63px)",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    podImageContainer: {
      zIndex: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      marginLeft: "100px",
    },
    podImage: {
      width: "calc((100vw - 80px - 120px - 120px) / 2 - 100px)",
      height: "367px",
      borderRadius: "20px",
      background: "#949bab",
    },
    playButton: {
      alignSelf: "center",
      width: "80px",
      height: "80px",
      minHeight: "80px",
      zIndex: 3,
      opacity: 0.8,
      backgroundImage: `url(${require("assets/icons/playlist_play.png")})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      marginTop: "-223px",
      marginBottom: "133px",
    },
    claimablePodPageHeader: {
      background: "linear-gradient(90deg, rgba(0, 0, 70, 1) 0%, rgba(28, 181, 224, 1) 100%)",
      padding: "35px 50% 40px 120px",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      minHeight: "350px",
      "& nav": {
        marginTop: "24px",
        fontFamily: "Agrandir",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "25px",
        lineHeight: "32px",
        color: "white",

        "& span": {
          background: Gradient.Mint,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },
      },
      "& p": {
        color: "white",
        marginTop: "22px",
        marginBottom: 0,
      },
      "& img": {
        height: "12px",
        width: "12px",
        marginRight: "15px",
      },
    },
    freeTag: {
      background: Gradient.Mint,
      color: "white",
      padding: "7px 14px 6px",
      fontSize: "14px",
      borderRadius: "36px",
      marginRight: "6px",
    },
    chainTag: {
      background: "white",
      color: "#707582",
      padding: "7px 14px 6px",
      fontSize: "11px",
      borderRadius: "36px",
      "& img": {
        marginLeft: "0px !important",
        marginRight: "6px",
      },
    },
    name: {
      display: "flex",
      alignItems: "flex-start",
      marginBottom: "7px",
      "& h1": {
        fontFamily: "Agrandir GrandLight",
        color: "white",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "72px",
        lineHeight: "64px",
        margin: "5px 0px",
      },
      "& img": {
        marginLeft: "15px",
        width: "32px",
      },
    },
    genre: {
      fontStyle: "normal",
      fontSize: "18px",
      color: "white",
      "& b": {
        "&:last-child": {
          marginLeft: "15px",
        },
      },
    },

    creator: {
      padding: "0px 120px",
      display: "flex",
      flexDirection: "column",
      marginBottom: "27px",
      marginTop: "-24px",
    },
    creatorAvatar: {
      display: "flex",
      border: "2px solid #FFFFFF",
      width: "48px",
      height: "48px",
      borderRadius: "24px",
      filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))",
    },
    onine: {
      border: "1.5px solid #FFFFFF",
      background: Gradient.Mint,
      width: "14px",
      height: "14px",
      borderRadius: "7px",
    },

    content: {
      padding: "0px 120px 50px",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      "& button": {
        lineHeight: "inherit",
        padding: "8px",
        height: "auto",
        marginBottom: "0 !important",
      },
    },
    fundsRaised: {
      width: "240px",
      marginRight: "42px",
      background: Gradient.Mint,
      padding: "15px 20px",
      borderRadius: "6px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      "& span": {
        color: "white",
      },
      "& h3": {
        margin: "4px 0px 0px",
        fontSize: "30px",
        color: "white",
        fontWeight: 400,
      },
    },
    row: {
      display: "flex",
      width: "50%",
      marginBottom: "22px",
      "& p": {
        margin: "0px 0px 2px 0px",
        color: "#707582",
        fontSize: "14px",
      },
      "& img": {
        marginRight: "9px",
        width: "18px",
        height: "18px",
      },
    },
    borderRow: {
      justifyContent: "space-between",
      width: "100% !important",
      padding: "22px 5px 12px",
      borderTop: "1px dashed #1717174d",
      borderBottom: "1px dashed #1717174d",
      marginBottom: "30px",
    },
    column: {
      display: "flex",
      flexDirection: "column",

      "& span": {
        fontSize: "14px",
        color: "#707582",
      },
      "& h3": {
        margin: "10px 0px 0px",
        fontStyle: "normal",
        fontSize: "30px",
        color: "#181818",
        fontWeight: 400,
        "& span": {
          fontSize: "14px",
          color: "#181818",
        },
      },
    },

    artists: { display: "flex", marginBottom: "34px" },
    artistCard: {
      marginRight: "42px",
      width: "166px",
      height: "200px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "15px 10px 14px",
      background: "white",
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
      borderRadius: "20px",
      "& img": {
        width: "18px",
      },
    },
    artistImage: {
      border: "2px solid #FFFFFF",
      filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))",
      width: "72px",
      height: "72px",
      marginBottom: "16px",
    },
    artistName: {
      fontSize: "14px",
      textAlign: "center",
      marginBottom: "5px",
      color: "#181818",
    },
    artistSlug: {
      fontSize: "11px",
      fontWeight: "bold",
      textAlign: "center",
      background: Gradient.Mint,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "10px",
    },
    artistStatus: {
      marginTop: "8px",
      fontSize: "14px",
      textAlign: "center",
      color: "#707582",
    },

    appbarContainer: {
      marginTop: "60px",
      width: "100%",
      borderBottom: "3px solid #eff2f8",
      marginBottom: "46px",
    },
    selected: {
      color: "transparent",
      background: Gradient.Mint,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
  })
);

const podsMenuOptions = ["Stats", "Chat", "Distribution Proposals"];

export default function ClaimablePodPage() {
  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  const classes = useStyles();
  const history = useHistory();

  const [pod, setPod] = useState<any>([]);
  const [currentPodsMenuOptions, setCurrentPodsMenuOptions] = useState<string[]>([]);
  const [podMenuSelection, setPodMenuSelection] = useState<number>(0);

  const [trigger, setTrigger] = useState<boolean>(false);

  let pathName = window.location.href; // If routing changes, change to pathname
  let idUrl = pathName.split("/")[6];

  const [openInviteModal, setOpenInviteModal] = useState<boolean>(false);
  const handleOpenInviteModal = () => {
    setOpenInviteModal(true);
  };
  const handleCloseInviteModal = () => {
    setOpenInviteModal(false);
  };

  useEffect(() => {
    if (idUrl) {

      trackPromise(
        axios.get(`${URL()}/claimableSongs/getClaimablePod/${idUrl}`)
          .then((res) => {
            const resp = res.data;
            if (resp.success) {
              //load real info
              const podCopy = { ...resp.data };
              setCurrentPodsMenuOptions(
                podsMenuOptions /*.filter(
                  ??? no idea if we should show the tabs only to some users)*/
              );

              if (pod.Creator || pod.creator) {
                const creator = users.find(
                  u => (pod.Creator && u.id === pod.Creator) || (pod.creator && u.id === pod.creator)
                );
                podCopy.creator = creator;
              }

              podCopy.randomAvatar = require(`assets/anonAvatars/ToyFaces_Colored_BG_${Math.floor(
                Math.random() * 118 + 1
              )
                .toString()
                .padStart(3, "0")}.jpg`);
              //TODO: GET REAL VALUES
              podCopy.funds = podCopy.funds ?? 21304;
              podCopy.id = idUrl;
              console.log(podCopy);
              setPod(podCopy);
            }
          })
          .catch((error) => {
            console.log(error);
          })
      );
    }
  }, [idUrl]);

  return (
    <div className={classes.claimablePodPage}>
      <div className={classes.overflowHeader}>
        <div className={classes.podImageContainer}>
          <div
            className={classes.podImage}
            style={{
              backgroundImage: pod.HasPhoto && pod.imageURL.length > 0 ? `url(${pod.imageURL})` : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className={classes.playButton} />
        </div>
      </div>
      <div className={classes.claimablePodPageHeader}>
        {(pod.free || pod.chain) && (
          <Box display="flex" marginBottom={"20px"} alignItems="center">
            {pod.free && <div className={classes.freeTag}>🔥 Privi Free Zone</div>}
            {pod.free && <img src={require("assets/icons/info_white.png")} alt="info" />}
            {pod.chain && pod.chain === "PRIVI" && (
              <div className={classes.chainTag}>
                <img src={require(`assets/tokenImages/PRIVI.png`)} alt={"PRIVI"} />
                {"PRIVI CHAIN"}
              </div>
            )}
          </Box>
        )}
        <div className={classes.name}>
          <h1>{pod.name ?? "Pod name"}</h1>
        </div>
        <div className={classes.genre}>
          <b>Artist: </b> {pod.artist ?? "Unknown"}
          <b>Genre: </b> {pod.genre ?? "Unknown"}
        </div>
        <p>{pod.Description ?? pod.description ?? "Pod description"}</p>
      </div>

      <div className={classes.creator}>
        <div
          className={classes.creatorAvatar}
          style={{
            backgroundImage:
              pod.creator && pod.creator.imageURL && pod.creator.imageURL !== ""
                ? `url(${pod.creator.imageURL})`
                : pod.randomAvatar
                ? `url(${pod.randomAvatar})`
                : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {pod.creator && pod.creator.online && <div className={classes.onine} />}
      </div>

      <div className={classes.content}>
        <div className={classes.row}>
          <div className={classes.fundsRaised}>
            <span>🤑 Funds Raised</span>
            <h3>
              {pod.priceToken ?? "ETH"} {pod.funds ?? "N/A"}
            </h3>
          </div>
          <div className={classes.column}>
            <span>💰 Price</span>
            <h3>
              {pod.priceToken ?? "ETH"} {pod.price ?? "N/A"} <span>/per second</span>
            </h3>
          </div>
        </div>
        <div className={classes.row}>
          <img src={require("assets/icons/info_gray.png")} alt="info" />
          <p>All Artist Must Verify Their Profiles in Order to Claim Funds</p>
        </div>
        <div className={cls(classes.row, classes.borderRow)}>
          <div className={classes.column}>
            <span>📈 Owner Share</span>
            <h3>
              {pod.priceToken ?? "ETH"} {pod.ownerShare ?? "N/A"}
            </h3>
          </div>
          <div className={classes.column}>
            <span>📊 Artists Share</span>
            <h3>
              {pod.priceToken ?? "ETH"} {pod.artistsShare ?? "N/A"}
            </h3>
          </div>
          <div className={classes.column}>
            <span>🚀 Sharing Share</span>
            <h3>
              {pod.token ?? "ETH"} {pod.sharingShare ?? "N/A"}
            </h3>
          </div>
          <div className={classes.column}>
            <span>🎧 Reproductions</span>
            <h3>{pod.reproductions ?? "N/A"}</h3>
          </div>
          <div className={classes.column}>
            <span>💜 Likes</span>
            <h3>{pod.likes ?? "N/A"}</h3>
          </div>
          <div className={classes.column}>
            <span>🎶 Bitrate</span>
            <h3>{pod.format && pod.format.bitrate ? pod.format.bitrate/1000 : "N/A"} Kbps</h3>
          </div>
        </div>

        <div className={classes.artists}>
          {pod.artists &&
            pod.artists.length > 0 &&
            pod.artists.map(artist => (
              <div
                className={classes.artistCard}
                onClick={() => {
                  history.push(`/profile/${artist.id}`);
                }}
              >
                <Box width={"100%"} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                  <div
                    className={artist.artistImage}
                    style={{
                      backgroundImage:
                        artist.imageURL && artist.imageURL !== "" ? `url(${artist.imageURL})` : "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className={classes.artistName}>{`${artist.name ?? ""}`}</div>

                  <div className={classes.artistSlug}>{`@${artist.urlSlug ?? ""}`}</div>
                </Box>
                <Box width={"100%"} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                  {artist.claimStatus && (
                    <img
                      src={require(`assets/icons/${
                        artist.claimStatus.toUpperCase() === "VERIFIED"
                          ? `verified`
                          : artist.claimStatus.toUpperCase() === "PENDING"
                          ? `clock_gray`
                          : `warning_gray`
                      }.png`)}
                      alt={`tick`}
                    />
                  )}
                  {artist.claimStatus && (
                    <div className={classes.artistStatus}>
                      {artist.claimStatus.toUpperCase() === "VERIFIED"
                        ? `Verified artist`
                        : artist.claimStatus.toUpperCase() === "PENDING"
                        ? `Pending Verification`
                        : `Hasn't Claimed`}
                    </div>
                  )}
                </Box>
              </div>
            ))}
        </div>

        <Box display="flex" alignItems="center" width="100%">
          <SecondaryButton size="medium" onClick={handleOpenInviteModal}>
            Invite New People
          </SecondaryButton>
          <img
            style={{ width: "18px", margin: "0px 9px 0px 24px" }}
            src={require("assets/icons/question.png")}
            alt="question"
          />
          <Box fontSize="14px" component="p" margin={0} color="#707582" alignItems="center">
            You can <b>invite new people</b> to be part of this Pod such as music technicians , record labels
            or whoever you want.
          </Box>
          <InvitePeopleModal open={openInviteModal} handleClose={handleCloseInviteModal} />
        </Box>

        <div className={classes.appbarContainer}>
          <TabNavigation
            tabs={currentPodsMenuOptions}
            currentTab={podMenuSelection}
            variant="secondary"
            onTabChange={setPodMenuSelection}
          />
        </div>
        <div style={{ paddingBottom: "20px" }}>
          {currentPodsMenuOptions[podMenuSelection] === "Stats" ? (
            <Stats pod={pod}
                   refreshPod={() => setTrigger(!trigger)} trigger={trigger} />
          ) : currentPodsMenuOptions[podMenuSelection] === "Chat" ? (
            <ClaimableChat pod={pod}
                           refreshPod={() => setTrigger(!trigger)} trigger={trigger} />
          ) : currentPodsMenuOptions[podMenuSelection] === "Distribution Proposals" ? (
            <DistributionProposals pod={pod}
                                   refreshPod={() => setTrigger(!trigger)}
                                   trigger={trigger} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
