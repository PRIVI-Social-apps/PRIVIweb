import React, { useEffect, useState } from "react";

import cls from "classnames";
import { createStyles, makeStyles } from "@material-ui/core";

import { Gradient } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { useTypedSelector } from "store/reducers/Reducer";
import { getStyledTime } from "shared/functions/getStyledTime";

const useStyles = makeStyles(() =>
  createStyles({
    smallAppbar: {
      display: "flex",
      alignItems: "center",
      marginBottom: "25px",
      "& span": {
        cursor: "pointer",
        marginRight: "20px",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "18px",
        color: "#99A1B3",
      },
    },
    selectedTab: {
      color: "transparent",
      background: Gradient.Mint,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },

    offerCard: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      justifyContent: "space-between",
      background: "#FFFFFF",
      boxShadow: "0px 2px 14px rgba(0, 0, 0, 0.08)",
      borderRadius: "14px",
      padding: "24px 25px 20px",
      marginBottom: "12px",
    },
    avatarContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      marginRight: "6px",
    },
    avatar: {
      width: "48px",
      height: "48px",
      borderRadius: "24px",
      border: "2px solid #FFFFFF",
      filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    online: {
      marginTop: "-16px",
      marginLeft: "-16px",
      width: "14px",
      height: "14px",
      borderRadius: "7px",
      background: Gradient.Mint,
      border: "1.5px solid #FFFFFF",
      filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))",
    },
    title: {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "11px",
      color: "#181818",
    },
    info: {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "18px",
      color: "#181818",
      "& img": {
        wifth: "14px",
        height: "14px",
        marginRight: "7px",
      },
    },
    status: {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "11px",
      color: "#99A1B3",
    },
    pending: {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "11px",
      color: "transparent",
      background: Gradient.Mint,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    action: {
      cursor: "pointer",
      textDecoration: "underline",
      color: "#99A1B3",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "14px",
      marginBottom: "9px",
      "&:last-child": {
        margin: 0,
      },
    },

    negotiationCard: {
      display: "flex",
      flexDirection: "column",
      width: "564px",
      justifyContent: "space-between",
      background: "#FFFFFF",
      boxShadow: "0px 2px 14px rgba(0, 0, 0, 0.08)",
      borderRadius: "14px",
      padding: "24px 25px 20px",
      marginBottom: "12px",
    },
    row: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      justifyContent: "space-between",
      marginBottom: "0.5px solid #99A1B3",
      padding: "16px 0px 14px",
      transition: "all 0.25s",
      "&:first-child": {
        marginTop: "0.5px solid #99A1B3",
      },
    },
    hiddenRow: {
      height: 0,
      display: "none",
    },
    column: {
      display: "flex",
      flexDirection: "column",
      padding: "0px 8px",
    },
    borderLeft: {
      borderLeft: "1px solid #99A1B3",
    },
    actionSmall: {
      marginTop: "4px",
      textDecoration: "underline",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "11px",
      color: "black",
    },

    arrow: {
      marginLeft: "9px",
      cursor: "pointer",
    },
  })
);

export default function ReviewCommunityTokenOffersTab({ communityToken, setCommunityToken }) {
  const users = useTypedSelector(state => state.usersInfoList);

  const classes = useStyles();

  const [tab, setTab] = useState<number>(0);
  const [offers, setOffers] = useState<any[]>([]);
  const [offersSorted, setOffersSorted] = useState<any[]>([]);

  /*Offer object has:
  -userId: id of the suer who created the offer,
  -amount: number/string
  -token: string
  -startDate: Date/number
  -endDate: Date/number
  */
  useEffect(() => {
    if (communityToken.Offers && communityToken.Offers.length > 0) {
      let o = [] as any;
      let os = [] as any;

      communityToken.Offers.forEach(offer => {
        const thisUser = users.find(u => u.id === offer.userId);
        const endDate = offer.endDate ? new Date(offer.endDate) : undefined;
        const styledEndDate = endDate
          ? `${endDate.getDate() < 10 ? `0${endDate.getDate()}` : endDate.getDate()}.${
              endDate.getMonth() + 1 < 10 ? `0${endDate.getMonth() + 1}` : endDate.getMonth() + 1
            }.${endDate.getFullYear()}`
          : undefined;
        const styledStart = offer.startDate
          ? getStyledTime(new Date(offer.startDate).getTime(), new Date().getTime(), false)
          : undefined;

        o.push({ ...offer, user: thisUser, styledStart, styledEndDate });

        if (os.some(o => o.userId && o.userId === offer.userId)) {
          os[os.findIndex(o => o.userId && o.userId === offer.userId)].Offers.push({
            ...offer,
            user: thisUser,
            styledStart,
            styledEndDate,
          });
        } else {
          os.push({
            userId: offer.userId,
            Offers: [{ ...offer, user: thisUser, styledStart, styledEndDate }],
          });
        }
      });

      setOffers(o);

      os.forEach(userOffers => {
        if (userOffers.Offers && userOffers.Offers.length > 0) {
          userOffers.Offers.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
        }
      });

      setOffersSorted(os);
    }
  }, [communityToken.Offers]);

  const acceptOffer = () => {};

  const declineOffer = () => {};

  const negotiateOffer = () => {};

  return (
    <div>
      <div className={classes.smallAppbar}>
        <span onClick={() => setTab(0)} className={tab === 0 ? classes.selectedTab : undefined}>
          New offers
        </span>
        <span onClick={() => setTab(1)} className={tab === 1 ? classes.selectedTab : undefined}>
          Ongoing negotiations
        </span>
      </div>
      <div>
        {tab === 0 ? (
          offers &&
          offers.filter(offer => offer.status && offer.status.toUpperCase() === "PENDING").length > 0 ? (
            offers
              .filter(offer => offer.status && offer.status.toUpperCase() === "PENDING")
              .map((offer, index) => (
                <OfferCard
                  key={`offer-${index}`}
                  offer={offer}
                  acceptOffer={acceptOffer}
                  declineOffer={declineOffer}
                  negotiateOffer={negotiateOffer}
                />
              ))
          ) : (
            <div>No new offers to display</div>
          )
        ) : offersSorted && offersSorted.length > 0 ? (
          offersSorted.map((negotiation, index) => (
            <NegotiationCard
              key={`negotiation-${index}`}
              negotiation={negotiation}
              acceptOffer={acceptOffer}
              declineOffer={declineOffer}
              negotiateOffer={negotiateOffer}
            />
          ))
        ) : (
          <div>No negotiatons to display</div>
        )}
      </div>
    </div>
  );
}

const OfferCard = ({ offer, acceptOffer, declineOffer, negotiateOffer }) => {
  const classes = useStyles();

  return (
    <div className={classes.offerCard}>
      <div className={classes.avatarContainer}>
        <div
          className={classes.avatar}
          style={{
            backgroundImage:
              offer.user && offer.user.imageUrl && offer.user.imageUrl !== ""
                ? `url(${offer.user.imageUrl})`
                : "none",
          }}
        />
        {offer.user && offer.user.online && <div className={classes.online} />}
      </div>
      <div className={classes.column}>
        <div className={classes.title}>{offer.styledStart ?? "N/A"} ago</div>
        <div className={classes.info}>{offer.user && offer.user.name ? offer.user.name : "User name"}</div>
      </div>
      <div className={cls(classes.column, classes.borderLeft)}>
        <div className={classes.title}>Offers</div>
        <div className={classes.info}>
          {offer.token && <img src={require(`assets/tokenImages/${offer.token}.png`)} alt={offer.token} />}
          {offer.token ?? "ETH"} {offer.amount ?? "N/A"}
        </div>
      </div>
      <div className={classes.column}>
        <div className={classes.title}>Ends</div>
        <div className={classes.info}>{offer.styledEndDate ?? "N/A"}</div>
      </div>
      <div className={cls(classes.column, classes.borderLeft)}>
        <div className={classes.action} onClick={acceptOffer}>
          Accept
        </div>
        <div className={classes.action} onClick={negotiateOffer}>
          Negotiate
        </div>
        <div className={classes.action} onClick={declineOffer}>
          Decline
        </div>
      </div>
    </div>
  );
};

const NegotiationCard = ({ negotiation, acceptOffer, declineOffer, negotiateOffer }) => {
  const classes = useStyles();

  const [displayDetails, setDisplayDetails] = useState<boolean>(false);

  const executeOffer = () => {};

  const openChat = () => {};

  return (
    <div className={classes.negotiationCard}>
      {negotiation.Offers && negotiation.Offers[0] && (
        <Box
          display="flex"
          alignItems="center"
          width="100%"
          paddingBottom="20px"
          justifyContent="space-between"
        >
          <div className={classes.avatarContainer}>
            <div
              className={classes.avatar}
              style={{
                backgroundImage:
                  negotiation.Offers[0].user &&
                  negotiation.Offers[0].user.imageUrl &&
                  negotiation.Offers[0].user.imageUrl !== ""
                    ? `url(${negotiation.Offers[0].user.imageUrl})`
                    : "none",
              }}
            />
            {negotiation.Offers[0].user && negotiation.Offers[0].user.online && (
              <div className={classes.online} />
            )}
          </div>
          <div className={classes.column}>
            <div className={classes.title}>{negotiation.Offers[0].styledStart ?? "N/A"} ago</div>
            <div className={classes.info}>
              {negotiation.Offers[0].user && negotiation.Offers[0].user.name
                ? negotiation.Offers[0].user.name
                : "User name"}
            </div>
          </div>
          <div className={cls(classes.column, classes.borderLeft)}>
            <div className={classes.title}>Offers</div>
            <div className={classes.info}>
              {negotiation.Offers[0].token && (
                <img
                  src={require(`assets/tokenImages/${negotiation.Offers[0].token}.png`)}
                  alt={negotiation.Offers[0].token}
                />
              )}
              {negotiation.Offers[0].token ?? "ETH"} {negotiation.Offers[0].amount ?? "N/A"}
            </div>
          </div>
          <div className={classes.column}>
            <div className={classes.title}>Ends</div>
            <div className={classes.info}>{negotiation.Offers[0].styledEndDate ?? "N/A"}</div>
          </div>
          <div className={classes.column}>
            <div
              className={cls(
                {
                  [classes.pending]:
                    (negotiation.Offers[0].status &&
                      negotiation.Offers[0].status.toUpperCase() === "PENDING") ||
                    !negotiation.Offers[0].status,
                },
                classes.status
              )}
            >
              {negotiation.Offers[0].status
                ? negotiation.Offers[0].status.toUpperCase() === "PENDING"
                  ? "New Offer"
                  : negotiation.Offers[0].status
                : "Pending"}
            </div>
            <div
              className={classes.actionSmall}
              onClick={
                negotiation.Offers[0].status
                  ? negotiation.Offers[0].status.toUpperCase() === "ACCEPTED"
                    ? executeOffer
                    : openChat
                  : undefined
              }
            >
              {negotiation.Offers[0].status
                ? negotiation.Offers[0].status.toUpperCase() === "ACCEPTED"
                  ? "Execute"
                  : "See chat"
                : ""}
            </div>
          </div>
          {negotiation.Offers.length > 1 && (
            <img
              src={require("assets/icons/arrow.png")}
              alt="arrow"
              className={classes.arrow}
              style={{ transform: displayDetails ? "rotate(90deg)" : "rotate(270deg)" }}
              onClick={() => setDisplayDetails(!displayDetails)}
            />
          )}
        </Box>
      )}
      {displayDetails && (
        <div>
          {negotiation.Offers &&
            negotiation.Offers.length > 0 &&
            negotiation.Offers.map((offer, index) => {
              return (
                <div className={classes.row} key={`negotiation-offer-${index}`}>
                  <Box display="flex" alignItems="center" width="170px">
                    {`${offer.styledStart ?? "N/A"} ago`}
                  </Box>

                  <div className={classes.info}>
                    {offer.token && (
                      <img src={require(`assets/tokenImages/${offer.token}.png`)} alt={offer.token} />
                    )}
                    {offer.token ?? "ETH"} {offer.amount ? offer.amount : "N/A"}
                  </div>
                  <div
                    className={cls(
                      {
                        [classes.pending]:
                          (offer.status && offer.status.toUpperCase() === "PENDING") || !offer.status,
                      },
                      classes.status
                    )}
                  >
                    {offer.status ?? "pending"}
                  </div>
                </div>
              );
            })}
          <Box display="flex" justifyContent="flex-end" width="100%">
            <div className={classes.action} style={{ marginRight: "20px" }} onClick={declineOffer}>
              Decline
            </div>
            <div className={classes.action} style={{ marginRight: "20px" }} onClick={negotiateOffer}>
              Negotiate
            </div>
            <div className={classes.action} onClick={acceptOffer}>
              Accept
            </div>
          </Box>
        </div>
      )}
    </div>
  );
};
