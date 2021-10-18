import React, { useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Divider, Grid } from "@material-ui/core";

type RequestAssistanceTokenOfferBarProps = {
  variant?: "primary" | "secondary";
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      background: "#FFFFFF",
      boxShadow: "0px 2px 14px rgb(0 0 0 / 8%)",
      borderRadius: 14,
      padding: 20,
    },
    wrapper: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-around",
    },
    item: {
      padding: "0, 15px",
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    userPhoto: {
      marginRight: "10px",
      minWidth: "40px",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "#5a5a5a",
      position: "relative",
    },
    userOnline: {
      color: "green",
      fontSize: "30px",
      position: "absolute",
      right: "-6px",
      bottom: "-13px",
    },
    userData: {
      display: "flex",
      flexDirection: "column",
      "& span": {
        color: "#181818",
        fontSize: 11,
        fontWeight: 400,
        marginBottom: 3
      },
      "& h4": {
        margin: 0,
        fontSize: 18,
        fontWeight: 400,
      },
    },
    tokenInfo: {
      display: "flex",
      alignItems: "center",
    },
    tokenData: {
      display: "flex",
      flexDirection: "column",
      "& span": {
        color: "#181818",
        fontSize: 11,
        fontWeight: 400,
        marginBottom: 3
      },
      "& h4": {
        margin: 0,
        fontSize: 18,
        fontWeight: 400,
      },
      "&:first-of-type": {
        marginRight: 15,
      }
    },
    buttons: {
      "& a": {
        color: "#99A1B3",
        fontSize: 14,
        borderBottom: "1px solid #99A1B3",
      },
      "& a:hover": {
        color: "#23D0C6",
        cursor: "pointer",
      },
    },
    secondarybuttons: {
      "& span": {
        color: "#99A1B3",
        fontSize: 11,
        display: "block",
      },
      "& a": {
        color: "#181818",
        fontSize: 14,
        borderBottom: "1px solid #99A1B3",
      },
      "& a:hover": {
        color: "#23D0C6",
        cursor: "pointer",
      },
    },
    secondary: {
      display: "flex",
      alignItems: "center",
    },
    arrow: {
      cursor: "pointer",
      marginLeft: 5,
    },
    tokenHistory: {
      display: "flex",
      flexDirection: "column",
      marginTop: 30,
    },
    history: {
      borderBottom: "1px solid #99A1B3",
      margin: "0 10px",
      width: "100%",

      "& span": {
        fontSize: 13,
        color: "#99A1B3",
      },
      "& h4": {
        fontSize: 18,
        color: "#99A1B3",
        margin: 0,
        fontWeight: 400,
      },

      "&:first-of-type": {
        borderTop: "1px solid #99A1B3",
      }
    },
    status: {
      textAlign: "right",
    },
    transaction: {
      display: "flex",
      "& h4:first-of-type": {
        marginRight: 10,
      },
    },
    tokenButtons: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      margin: "20px 0",

      "& a": {
        color: "#99A1B3",
        margin: "0 20px",
        fontSize: 14,
        borderBottom: "1px solid #99A1B3",
      },
      "& a:hover": {
        color: "#23D0C6",
        cursor: "pointer",
      },
    }
  })
);

export default function RequestAssistanceTokenOfferBar({
  variant = "primary"
}: RequestAssistanceTokenOfferBarProps) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleArrowClick = () => {
    setExpanded(!expanded);
  }

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <div className={classes.item}>
          <div className={classes.userInfo}>
            <div
              className={classes.userPhoto}
              style={{
                backgroundImage: `url(${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              <span
                className={classes.userOnline}
              >
                ●
              </span>
            </div>
            <div className={classes.userData}>
              <span>5 days ago</span>
              <h4>User Name</h4>
            </div>
          </div>
        </div>
        <Divider
          orientation="horizontal"
          style={{ height: "20px", color: "#99A1B3", width: "1px" }}
        />
        <div className={classes.item}>
          <div className={classes.tokenInfo}>
            <div className={classes.tokenData}>
              <span>Offers</span>
              <h4>ETH 0.05456</h4>
            </div>
            <div className={classes.tokenData}>
              <span>Ends</span>
              <h4>03.29.2012</h4>
            </div>
          </div>
        </div>
        <Divider
          orientation="horizontal"
          style={{ height: "20px", color: "#99A1B3", width: "1px" }}
        />
        <div className={classes.item}>
          {variant === "primary" ? (
            <div className={classes.buttons}>
              <a>Accept</a><br/>
              <a>Negociate</a><br/>
              <a>Decline</a>
            </div>
          ) : (
            <div className={classes.secondary}>
              <div className={classes.secondarybuttons}>
                <span>Accepted</span>
                <a>Execute</a>
              </div>
              <div onClick={handleArrowClick} className={classes.arrow}>
                <img src={require(`assets/icons/${expanded ? 'arrow-up.svg' : 'arrow-down.svg'}`)} alt="" />
              </div>
            </div>
          )}
        </div>
      </div>
      {expanded &&
        <div className={classes.tokenHistory}>
          <Grid container spacing={3} className={classes.history}>
            <Grid item xs={12} sm={3}>
              <span>5 days ago</span>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.transaction}>
              <h4>ETH 0.05456</h4>
              <h4>03.29.2012</h4>
            </Grid>
            <Grid item xs={12} sm={3}>
              <span className={classes.status}>Declined</span>
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.history}>
            <Grid item xs={12} sm={3}>
              <span>5 days ago</span>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.transaction}>
              <h4>ETH 0.05456</h4>
              <h4>03.29.2012</h4>
            </Grid>
            <Grid item xs={12} sm={3}>
              <span className={classes.status}>Declined</span>
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.history}>
            <Grid item xs={12} sm={3}>
              <span>5 days ago</span>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.transaction}>
              <h4>ETH 0.05456</h4>
              <h4>03.29.2012</h4>
            </Grid>
            <Grid item xs={12} sm={3}>
              <span className={classes.status}>Declined</span>
            </Grid>
          </Grid>
          <div className={classes.tokenButtons}>
            <a>Accept</a>
            <a>Negociate</a>
            <a>Decline</a>
          </div>
        </div>
      }
    </div>
  );
}
