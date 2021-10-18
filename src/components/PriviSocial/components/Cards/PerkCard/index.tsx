import { SocialPrimaryButton } from "components/PriviSocial/index.styles";
import React, { useState } from "react";
import Box from "shared/ui-kit/Box";
import { perkCardStyles } from "./index.styles";
import cls from "classnames";

export default function PerkCard({ item, heightFixed }: { item: any; heightFixed?: boolean }) {
  const classes = perkCardStyles();

  const [countDown, setCountDown] = React.useState<any>({});

  const [openCreateBadgeModal, setOpenCreateBadgeModal] = useState<boolean>(false);
  const [openAddRewardsModal, setOpenAddRewardsModal] = useState<boolean>(false);
  const handleOpenCreateBadgeModal = () => {
    setOpenCreateBadgeModal(true);
  };
  const handleOpenAddRewardsModal = () => {
    setOpenCreateBadgeModal(true);
  };
  const handleCloseCreateBadgeModal = () => {
    setOpenCreateBadgeModal(false);
  };
  const handleCloseAddRewardsModal = () => {
    setOpenCreateBadgeModal(false);
  };

  React.useEffect(() => {
    if (item?.EndDate) {
      let addADayDate: Date = new Date();
      addADayDate.setDate(addADayDate.getDate() + 1);

      const timerId = setInterval(() => {
        const now = new Date();
        let delta = Math.floor(
          item?.EndDate
            ? new Date(item?.EndDate).getTime() - now.getTime()
            : (addADayDate.getTime() - now.getTime()) / 1000
        ); // diff in secs

        if (delta < 0) {
          setCountDown({
            hours: 0,
            minutes: 0,
            seconds: 0,
          });
          clearInterval(timerId);
        } else {
          let days = Math.floor(delta / 86400);
          delta -= days * 86400;

          // calculate (and subtract) whole hours
          let hours = Math.floor(delta / 3600) % 24;
          delta -= hours * 3600;

          // calculate (and subtract) whole minutes
          let minutes = Math.floor(delta / 60) % 60;
          delta -= minutes * 60;

          // what's left is seconds
          let seconds = delta % 60;
          setCountDown({
            days,
            hours,
            minutes,
            seconds,
          });
        }
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [item?.EndDate]);

  const handleClickCard = () => {};

  return (
    <div className={classes.card}>
      {item?.Trending && (
        <div className={classes.topActions}>
          <div className={classes.trending}>🔥 Trending Perk</div>
        </div>
      )}
      <div className={classes.header} style={{ minHeight: "270px" }}>
        <div
          onClick={handleClickCard}
          style={
            item.dimensions && !heightFixed
              ? {
                  height: 0,
                  paddingBottom: `${
                    (item?.dimensions.height / item?.dimensions.width) * 100 >= 120
                      ? (item?.dimensions.height / item?.dimensions.width) * 100
                      : 120
                  }%`,
                }
              : {
                  height: "269",
                }
          }
        >
          <div className={classes.aspectRatioWrapper}>
            {!item?.ImageURL ? (
              <div className={classes.image} />
            ) : (
              <img
                className={cls(classes.image, classes.img)}
                src={`${item?.ImageURL}?${Date.now()}`}
                alt={item?.itemName}
              />
            )}
          </div>
          <div className={classes.aspectRatioWrapper}></div>
        </div>
      </div>
      <div className={classes.bottomContent}>
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" mb={3}>
          <Box fontWeight={700}>{item?.Description ?? "Perk Title"}</Box>

          <Box fontSize="16px">
            <b>{item?.Redeemed ?? 0} Redeemed</b> / {item?.TotalRedeem ?? 0}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" mb={3}>
          <Box>
            <Box fontSize="14px" fontWeight={800} mb={0.5}>
              🤑 Redeem cost
            </Box>
            <Box fontWeight={800} fontSize="22px">
              {item?.Cost ?? 0}
            </Box>
          </Box>
          <Box>
            <Box fontSize="14px" fontWeight={800} mb={0.5}>
              🚀 Shares
            </Box>
            <Box fontWeight={800} fontSize="22px">
              {item?.TotalShares ?? 0}
            </Box>
          </Box>
          <Box>
            <Box fontSize="14px" fontWeight={800} mb={0.5}>
              ⏰ Ends on
            </Box>
            <Box fontWeight={800} fontSize="22px">
              {countDown.hours}h {countDown.minutes}m {countDown.seconds}s
            </Box>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <SocialPrimaryButton onClick={handleOpenCreateBadgeModal}>Create Badge</SocialPrimaryButton>
          <SocialPrimaryButton onClick={handleOpenAddRewardsModal}>Add Rewards</SocialPrimaryButton>
        </Box>
      </div>
    </div>
  );
}
