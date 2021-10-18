import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { Avatar } from "shared/ui-kit";
import { UserInfo } from "store/actions/UsersInfo";
import styles from "../../elements.module.scss";
import { ParticipantModal } from "./ParticipantModal";

type SidebarParticipantsProps = {
  allStreamers: UserInfo[];
  allModerators: UserInfo[];
  onlineWatchers: UserInfo[];
  description: string;
};

const StreamerViews: React.FunctionComponent<{
  totalStreamers: UserInfo[];
}> = ({ totalStreamers }) => {
  const classes = useStyles();

  return totalStreamers.length === 1 ? (
    <div>
      <div className={styles.creatorInfo}>
        <img
          src={totalStreamers[0].imageURL}
          style={{
            objectFit: "cover",
          }}
          alt="Avatar"
        />
        <div className={styles.personalInfo}>
          <div className={styles.creatorFullName}>{totalStreamers[0].name}</div>
          <div className={styles.creatorOtherInfo}>
            <div className={styles.creatorAlias}>@{totalStreamers[0].urlSlug}</div>
            {totalStreamers[0].verified ? (
              <img
                className={styles.userVerified}
                src={require("assets/icons/check_gray.png")}
                alt={`tick`}
              />
            ) : null}
            <div className={styles.userLevel}>{`level ${totalStreamers[0].level ?? 1}`}</div>
          </div>
        </div>
      </div>
      <div className={styles.followSection}>
        <div className={styles.followArtist} onClick={() => {}}>
          Follow Artist
        </div>
        <div className={styles.chatWithCreator} onClick={() => {}}>
          <img src={require("assets/icons/message_darkblue.png")} alt={`tick`} />
        </div>
      </div>
    </div>
  ) : (
    <div className={classes.avatarContainer}>
      {totalStreamers.map(user => (
        <img key={user.id} className={styles.avatar} src={user.imageURL} />
      ))}
    </div>
  );
};

export const SidebarParticipants: React.FunctionComponent<SidebarParticipantsProps> = ({
  allStreamers,
  allModerators,
  onlineWatchers,
  description,
}) => {
  const [isViewAll, setViewAll] = useState(false);
  const classes = useStyles();

  const onCloseViewAll = async () => {
    setViewAll(false);
  };

  const openViewAll = async () => {
    setViewAll(true);
  };

  return (
    <>
      <div className={classes.divider}></div>
      <div>
        <p className={classes.sectionTitle}>Creators</p>
        {allStreamers.length > 1 ? (
          <p onClick={() => openViewAll()} className={classes.sectionViewAll}>
            View All Participants
          </p>
        ) : null}
      </div>
      <div className={classes.container}>
        <StreamerViews totalStreamers={allStreamers}></StreamerViews>
      </div>

      <div className={classes.divider}></div>
      <div className={classes.sectionContainer}>
        <p className={classes.sectionTitle}>Viewers &amp; Moderators</p>
        <p className={classes.sectionViewAll} onClick={openViewAll}>
          View All
        </p>
      </div>
      <div className={classes.sectionContainer}>
        {allModerators.map(user => (
          <Avatar key={user.id} url={user.imageURL} size="medium" />
        ))}
        {onlineWatchers.map(user => (
          <Avatar key={user.id} url={user.imageURL} size="small" />
        ))}
      </div>
      <div className={classes.divider}></div>
      <div className={classes.sectionContainer}>
        <p className={classes.sectionTitle}>Description</p>
      </div>
      <div className={classes.sectionContainer}>
        <p className={classes.description}>{description}</p>
      </div>

      <ParticipantModal
        isOpen={isViewAll}
        onClose={onCloseViewAll}
        streamers={allStreamers}
        moderates={allModerators}
        viewers={onlineWatchers}
      />
    </>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    paddingBottom: "16px",
  },
  divider: {
    width: "100%",
    border: "1px dashed #181818",
    opacity: "0.3",
    marginBottom: "10px",
  },
  avatarContainer: {
    marginLeft: "25px",
  },
  avatar: {
    marginLeft: "-25px",
    width: "50px",
    height: "50px",
    borderRadius: "25px",
  },
  sectionContainer: {
    display: "flex",
    marginBottom: "10px",
  },
  sectionTitle: {
    margin: "0px",
    flex: 1,
    fontSize: "14px",
    color: "#707582",
    fontWeight: "bold",
  },
  sectionViewAll: {
    margin: "0px",
    fontSize: "14px",
    color: "#23D0C6",
    cursor: "pointer",
  },
  description: {
    margin: "0px",
    fontSize: "14px",
    color: "#707582",
  },
}));
