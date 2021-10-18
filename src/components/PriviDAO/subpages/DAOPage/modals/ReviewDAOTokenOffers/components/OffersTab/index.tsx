import React, { useEffect, useState } from "react";
import { Box, createStyles, Grid, makeStyles } from "@material-ui/core";
import cls from "classnames";
import { useTypedSelector } from "store/reducers/Reducer";
import { getStyledTime } from "shared/functions/getStyledTime";

const useStyles = makeStyles(() =>
  createStyles({
    offerCard: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      justifyContent: "space-between",
      background: "rgba(255, 255, 255, 0.16)",
      boxShadow: "0px 2px 14px rgba(0, 0, 0, 0.08)",
      padding: "16px 24px",
    },
    avatarContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      marginRight: "8px",
    },
    avatar: {
      width: "40px",
      height: "40px",
      borderRadius: "24px",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    title: {
      fontFamily: "Agrandir GrandLight",
    },
    status: {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "16px",
      color: "transparent",
      background: "linear-gradient(151.11deg, #C932C3 6.74%, #EF8732 90.8%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    action: {
      cursor: "pointer",
      textDecoration: "underline",
      color: "#A306BA",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "14px",
      marginRight: "24px",
    },

    negotiationCard: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      justifyContent: "space-between",
      background: "rgba(255, 255, 255, 0.16)",
      boxShadow: "0px 2px 14px rgba(0, 0, 0, 0.08)",
      padding: "16px 24px",
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
      width: "5px",
      height: "10px",
      cursor: "pointer",
    },
  })
);

export default function ReviewDAOTokenOffersTab({ communityToken, setCommunityToken }) {
  const users = useTypedSelector(state => state.usersInfoList);

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
    <Box color="white" fontSize="18px">
      <Box display="flex" alignItems="center" mb={3}>
        {["Offers", "Chat"].map((name, index) => (
          <Box
            color={index === tab ? "white" : "#707582"}
            key={name}
            onClick={() => setTab(index)}
            mr={3}
            style={{ cursor: "pointer" }}
          >
            {name}
          </Box>
        ))}
      </Box>
      <div>
        {tab === 0 ? (
          offers &&
          offers.filter(offer => offer.status && offer.status.toUpperCase() === "PENDING").length > 0 ? (
            <Grid container spacing={3}>
              {offers
                .filter(offer => offer.status && offer.status.toUpperCase() === "PENDING")
                .map((offer, index) => (
                  <Grid item xs={12} md={6} key={`offer-${index}`}>
                    <OfferCard
                      offer={offer}
                      acceptOffer={acceptOffer}
                      declineOffer={declineOffer}
                      negotiateOffer={negotiateOffer}
                    />
                  </Grid>
                ))}
            </Grid>
          ) : (
            <div>No new offers to display</div>
          )
        ) : offersSorted && offersSorted.length > 0 ? (
          <Grid container spacing={3}>
            {offersSorted.map((negotiation, index) => (
              <Grid item xs={12} md={6} key={`negotiation-${index}`}>
                <NegotiationCard
                  negotiation={negotiation}
                  acceptOffer={acceptOffer}
                  declineOffer={declineOffer}
                  negotiateOffer={negotiateOffer}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <div>No negotiatons to display</div>
        )}
      </div>
    </Box>
  );
}

const OfferCard = ({ offer, acceptOffer, declineOffer, negotiateOffer }) => {
  const classes = useStyles();

  return (
    <Box color="white" fontSize="18px" className={classes.offerCard}>
      <Box display="flex" justifyContent="flex-end" fontSize="10px" mb={"-10px"}>
        {offer.styledStart ?? "N/A"} ago
      </Box>
      <Box display="flex" alignItems="center" mb={2}>
        <div
          className={classes.avatar}
          style={{
            backgroundImage:
              offer.user && offer.user.imageUrl && offer.user.imageUrl !== ""
                ? `url(${offer.user.imageUrl})`
                : "none",
          }}
        />
        <div className={classes.title}>{offer.user && offer.user.name ? offer.user.name : "User name"}</div>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
        <Box mb={1}>
          Offers {offer.token ?? "ETH"} {offer.amount ?? "N/A"}
        </Box>
        <Box>Ends {offer.styledEndDate ?? "N/A"}</Box>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center">
        <div className={classes.action} onClick={acceptOffer}>
          Accept
        </div>
        <div className={classes.action} onClick={negotiateOffer}>
          Negotiate
        </div>
        <div className={classes.action} onClick={declineOffer}>
          Decline
        </div>
      </Box>
    </Box>
  );
};

const NegotiationCard = ({ negotiation, acceptOffer, declineOffer, negotiateOffer }) => {
  const classes = useStyles();

  const [displayDetails, setDisplayDetails] = useState<boolean>(false);

  const executeOffer = () => {};

  const openChat = () => {};

  return (
    <Box color="white" fontSize="18px" className={classes.negotiationCard}>
      <Box display="flex" justifyContent="flex-end" fontSize="10px" mb={"-10px"}>
        {negotiation.Offers[negotiation.Offers.length - 1].styledStart ?? "N/A"} ago
      </Box>
      <Box display="flex" width="100%" justifyContent="space-between" alignItems="center" mb={2}>
        <div className={classes.status}>
          {negotiation.Offers[negotiation.Offers.length - 1].status
            ? negotiation.Offers[negotiation.Offers.length - 1].status.toUpperCase() === "PENDING"
              ? "New Offer"
              : negotiation.Offers[negotiation.Offers.length - 1].status
            : "Pending"}
        </div>

        {negotiation.Offers.length > 1 ? (
          <img
            src={require("assets/icons/arrow_white_right.png")}
            alt="arrow"
            className={classes.arrow}
            style={{ transform: displayDetails ? "rotate(90deg)" : "rotate(270deg)" }}
            onClick={() => setDisplayDetails(!displayDetails)}
          />
        ) : (
          <div />
        )}
      </Box>
      {negotiation.Offers && negotiation.Offers[negotiation.Offers.length - 1] && (
        <Box display="flex" flexDirection="column" width="100%" mb={2}>
          <Box display="flex" alignItems="center" mb={2}>
            <div
              className={classes.avatar}
              style={{
                backgroundImage:
                  negotiation.Offers[negotiation.Offers.length - 1].user &&
                  negotiation.Offers[negotiation.Offers.length - 1].user.imageUrl &&
                  negotiation.Offers[negotiation.Offers.length - 1].user.imageUrl !== ""
                    ? `url(${negotiation.Offers[negotiation.Offers.length - 1].user.imageUrl})`
                    : "none",
              }}
            />
            <div className={classes.title}>
              {negotiation.Offers[negotiation.Offers.length - 1].user &&
              negotiation.Offers[negotiation.Offers.length - 1].user.name
                ? negotiation.Offers[negotiation.Offers.length - 1].user.name
                : "User name"}
            </div>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Box mb={1}>
              Offers {negotiation.Offers[negotiation.Offers.length - 1].token ?? "ETH"}{" "}
              {negotiation.Offers[negotiation.Offers.length - 1].amount ?? "N/A"}
            </Box>
            <Box>Ends {negotiation.Offers[negotiation.Offers.length - 1].styledEndDate ?? "N/A"}</Box>
          </Box>
          <div
            className={classes.action}
            onClick={
              negotiation.Offers[negotiation.Offers.length - 1].status
                ? negotiation.Offers[negotiation.Offers.length - 1].status.toUpperCase() === "ACCEPTED"
                  ? executeOffer
                  : openChat
                : undefined
            }
          >
            {negotiation.Offers[negotiation.Offers.length - 1].status
              ? negotiation.Offers[negotiation.Offers.length - 1].status.toUpperCase() === "ACCEPTED"
                ? "Execute"
                : "See chat"
              : ""}
          </div>
        </Box>
      )}
      {displayDetails && (
        <>
          {negotiation.Offers &&
            negotiation.Offers.length > 0 &&
            negotiation.Offers.map((offer, index) => (
              <Box
                display="flex"
                flexDirection="column"
                width="100%"
                mb={2}
                key={`negotiation-offer-${index}`}
              >
                <Box display="flex" width="100%" justifyContent="space-between" alignItems="center" mb={2}>
                  <div className={classes.status}>
                    {offer.status
                      ? offer.status.toUpperCase() === "PENDING"
                        ? "New Offer"
                        : offer.status
                      : "Pending"}
                  </div>
                  <Box display="flex" justifyContent="flex-end" fontSize="10px">
                    {offer.styledStart ?? "N/A"} ago
                  </Box>
                </Box>

                <Box display="flex" flexDirection="column" alignItems="center">
                  <Box mb={1} color="#707582">
                    Offers {offer.token ?? "ETH"} {offer.amount ? offer.amount : "N/A"}
                  </Box>
                  <Box mb={1} color="#707582">
                    Ends {offer.styledEndDate ?? "N/A"}
                  </Box>
                </Box>
              </Box>
            ))}
        </>
      )}

      <Box display="flex" alignItems="center" justifyContent="center">
        <div className={classes.action} onClick={acceptOffer}>
          Accept
        </div>
        <div className={classes.action} onClick={negotiateOffer}>
          Negotiate
        </div>
        <div className={classes.action} onClick={declineOffer}>
          Decline
        </div>
      </Box>
    </Box>
  );
};
