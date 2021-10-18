import React from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import SvgIcon from "@material-ui/core/SvgIcon";
import { setSelectedUser } from "store/actions/SelectedUser";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";
import { podCardStyles } from "./index.styles";

import { ReactComponent as UserSolid } from "assets/icons/user-solid.svg";
import { useTypedSelector } from "store/reducers/Reducer";
import { musicDaoFruitPod } from "shared/services/API";

export default function PodCard({ pod }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const styles = podCardStyles();

  const user = useTypedSelector(state => state.user);

  const parentNode = React.useRef<any>();

  const handleFruit = type => {
    musicDaoFruitPod(user.id, pod.PodAddress, type).then(res => {
      if (res.success) {
        const itemCopy = { ...pod };
        itemCopy.fruits = [
          ...(itemCopy.fruits || []),
          { userId: user.id, fruitId: type, date: new Date().getTime() },
        ];
      }
    });
  };

  return (
    <Box className={styles.podCard}>
      <Box className={styles.podImageContent}>
        <div
          className={styles.podImage}
          style={{
            backgroundImage:
              pod.ImageUrl
                ? `url(${pod.ImageUrl})`
                : `url(${getRandomImageUrl()})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
          }}
          ref={parentNode}
        ></div>
        {pod.CreatorImageUrl ? (
          <Box
            className={styles.avatar}
            style={{
              backgroundImage: `url(${pod.CreatorImageUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
            }}
            onClick={() => {
              if (pod.CreatorId) {
                history.push(`/profile/${pod.CreatorId}`);
                dispatch(setSelectedUser(pod.CreatorId));
              }
            }}
          />
        ) : (
          <Box
            className={styles.avatar}
            onClick={() => {
              if (pod.CreatorId) {
                history.push(`/profile/${pod.CreatorId}`);
                dispatch(setSelectedUser(pod.CreatorId));
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <SvgIcon>
              <UserSolid />
            </SvgIcon>
          </Box>
        )}
        <Box className={styles.socialButtons}>
          <FruitSelect fruitObject={pod} parentNode={parentNode.current} onGiveFruit={handleFruit} />
        </Box>
      </Box>
      <Box className={styles.podInfo}>
        <Box
          className={styles.podInfoName}
          px={2}
          onClick={() => {
            history.push(`/privi-music-dao/pods/${pod.PodAddress}`);
          }}
        >
          {pod.Name}
        </Box>
        <Box className={styles.podMainInfo}>
          <Box className={styles.divider} />
          <Box className={styles.flexBox}>
            <Box>Reproductions:</Box>
            <Box>{pod.Reproductions ?? 0}</Box>
          </Box>
          <Box className={styles.divider} />
          <Box className={styles.podMainInfoContent}>
            <Box>
              <span>Price</span>
              <p>${pod.PriceInUsd ?? 0}</p>
            </Box>
            <Box>
              <span>Investors share</span>
              <p>{(pod.InvestorDivident ?? 0) * 100}%</p>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const getRandomImageUrl = () => {
  return require(`assets/podImages/${Math.floor(Math.random() * 15 + 1)}.png`);
};
