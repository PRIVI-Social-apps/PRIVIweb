import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "shared/contexts/AuthContext";
import styles from "./CreatorCard.module.scss";
import cls from "classnames";
import { UserInfo } from "store/actions/UsersInfo";
import BadgeHexagon from "shared/ui-kit/Badge-hexagon/Badge-hexagon";
import { PrimaryButton } from "shared/ui-kit";

type CreatorCardProps = {
  data: UserInfo;
};

const CreatorCard = ({ data }: CreatorCardProps) => {
  const history = useHistory();
  const { isSignedin } = useAuth();
  const [randomAvatar] = useState(getRandomImageUrl());

  return (
    <div
      className={styles.card}
      onClick={() => {
        history.push(`/profile/${data.id}`);
      }}
    >
      <div
        className={styles.userImageContainer}
        style={{
          background: `url(${randomAvatar})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className={styles.userImage}
          style={{
            backgroundImage: data.imageURL && data.imageURL !== "" ? `url(${data.imageURL})` : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {isSignedin && (
          <div className={styles.shareContainer}>
            <span className={styles.shareBtn}>
              <img src={require("assets/icons/share-icon.png")} alt="" />
            </span>
            <span className={styles.addPersonBtn}>
              <img src={require("assets/icons/personAdd.png")} alt="" />
            </span>
          </div>
        )}
      </div>
      <div className={styles.userInfo}>
        <div className={styles.userName}>{`${data.name ?? ""}`}</div>
        <div className={styles.userSlugWrapper}>
          <div className={styles.tags}>
            {data.verified && data.verified === true && (
              <img src={require("assets/icons/check_gray.png")} alt={`tick`} className={styles.tag} />
            )}
            <div className={cls(styles.tag, styles.hide, { [styles.purple]: data.level > 0 })}>
              {`level ${data.level ?? 1}`}
            </div>
          </div>
          <div className={styles.userSlug}>{`@${data.urlSlug ?? ""}`}</div>
        </div>
      </div>
      <div className={styles.userBody}>
        <div>
          <div>
            <img src={require("assets/icons/followers.png")} alt="" />
            Followers:
          </div>
          <span>{data.numFollowers || 0}</span>
        </div>
        <div>
          <div>
            <img src={require("assets/icons/likes.png")} alt="" />
            Media likes:
          </div>{" "}
          <span>{data.likes || 0}</span>
        </div>
        <div>
          <div>
            <img src={require("assets/icons/profile_view.png")} alt="" />
            Profile views:
          </div>
          <span>{data.profileViews || 0}</span>
        </div>
      </div>
      <div className={cls(styles.userFooter, { [styles.externalUser]: data.isExternalUser })}>
        {data.isExternalUser && <PrimaryButton size="small">Claim This Profile</PrimaryButton>}
        {!data.isExternalUser && (
          <>
            <div className={styles.awardsWrapper}>
              <div>
                <span aria-label="Awards" role="img">
                  🥇 Awards
                </span>
                <h4>{data.awards || 0}</h4>
              </div>
              <div>
                <span aria-label="Awards" role="img">
                  👾 Media
                </span>
                <h4>{data.myMediasCount || 0}</h4>
              </div>
              <div>
                <span aria-label="Awards" role="img">
                  🛡️️ Badges
                </span>
                {data.badges.length > 0 ? (
                  <div className={styles.badges}>
                    {data.badges
                      .filter((_, index) => index < 3)
                      .map((badge, index) => (
                        <div key={index} className="indexBadge">
                          <BadgeHexagon
                            badge={badge}
                            key={`latest-badges-${index}`}
                            style={{ width: "24px", height: "32px" }}
                          />
                        </div>
                      ))}
                    {data.badges.length > 3 && <span>+{data.badges.length - 3}</span>}
                  </div>
                ) : (
                  <h4>0</h4>
                )}
              </div>
              {/* <div>
                <span aria-label="Awards" role="img">
                  🤝 Trust
                </span>
                <h4>{(data.trust || 0) * 100 + "%"}</h4>
              </div>
              <div>
                <span aria-label="Awards" role="img">
                  ⚔️ Endorsement
                </span>
                <h4>{(data.endorsement || 0) * 100 + "%"}</h4>
              </div> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const totalImageCount = 15;

const getRandomImageUrl = () => {
  return require(`assets/creatorImages/CreatorCardBack-${Math.floor(
    Math.random() * totalImageCount + 1
  )}.png`);
};

export default CreatorCard;
