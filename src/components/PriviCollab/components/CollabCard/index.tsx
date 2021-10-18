import React from "react";

import { FontSize, Text, StyledDivider, PrimaryButton, SecondaryButton, IconPrimaryButton, Color } from "shared/ui-kit";
import Avatar from "shared/ui-kit/Avatar";
import Box from 'shared/ui-kit/Box';
import { useCommonStyles } from "../../index.styles";
import { collabCardStyles } from './index.styles';

type CollabType = "requested" | "accepted" | "mentioned";
type StatusType = "success" | "failed" | "completion";

const CollabCard = ({
  type = "requested",
  status = "success",
  isTrending = false,
}: {
  type?: CollabType,
  status?: StatusType,
  isTrending?: boolean,
}) => {
  const classes = collabCardStyles();
  const commonClasses = useCommonStyles();

  const hightlightClass = type === "requested" ? classes.highlightBlue : classes.highlight;
  const titleFontSize = isTrending ? FontSize.XL : FontSize.L;
  const descFontSize = isTrending ? FontSize.M : FontSize.S;
  const avatarSize = isTrending ? 39 : 27;

  return (
    <Box className={classes.container}>
      {type !== "mentioned" && (
        status === "completion" ?
          <Box className={classes.acceptLabel} display="flex" flexDirection="row" alignItems="center" mb={1}>
            <CheckIcon />
            <Text size={descFontSize} bold color={Color.White}>Accepted</Text>
          </Box>
          :
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" flexDirection="row" alignItems="center">
              {type === "requested" ?
                (
                  <>
                    <PlusIcon />
                    <Text ml={1} size={descFontSize}>Requested</Text>
                  </>
                )
                :
                (status === "success" ?
                  <>
                    <StartIcon />
                    <Text ml={1} size={descFontSize}>Succesfully finished</Text>
                  </>
                  :
                  <>
                    <MinusIcon />
                    <Text ml={1} size={descFontSize}>Failed</Text>
                  </>
                )
              }
            </Box>
            {type === "requested" && (
              <Box display="flex" flexDirection="row" alignItems="center">
                <ClockIcon />
                <Text ml={1} size={descFontSize} color={Color.Black} bold>Ends in 12h 32m 17s</Text>
              </Box>
            )}
          </Box>
      )}
      <Text size={titleFontSize} color={Color.Black}>
        I want <Text className={hightlightClass} size={titleFontSize} >@Peter</Text> and <Text className={hightlightClass} size={titleFontSize}>@Angel</Text> to <Text className={hightlightClass} size={titleFontSize}>hike in the mountain</Text> on <Text className={hightlightClass} size={titleFontSize}>Instagram</Text> during <Text className={hightlightClass} size={titleFontSize}>2 days</Text>
      </Text>
      <StyledDivider type="solid" mt={4} mb={2} />
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Box className={classes.avatarContainer} display="flex" flexDirection="row" alignItems="center">
          <Avatar size={avatarSize} image={require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")} radius={25} />
          <Avatar size={avatarSize - 10} image={require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")} />
          <Avatar size={avatarSize - 10} image={require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")} />
          <Avatar size={avatarSize - 10} image={require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")} />
          <Avatar size={avatarSize - 10} image={require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")} />
          <Text ml={1}>+ 20</Text>
        </Box>
        <Box display="flex" flexDirection="column">
          <Text size={descFontSize} color={Color.Black}>Pledged amount</Text>
          <Text size={titleFontSize} color={Color.Black} bold={true}>$470</Text>
        </Box>
      </Box>
      {status !== "completion" && <StyledDivider type="solid" mt={2} mb={4} />}
      {type !== "mentioned" ?
        status === "completion" ?
          <Box className={classes.completion} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mt={2}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <TimeIcon />
              <Box display="flex" flexDirection="column">
                <Text size={titleFontSize} color={Color.White}>Completion in</Text>
                <Text size={titleFontSize} color={Color.White}>12h 32m 17s</Text>
              </Box>
            </Box>
            <IconPrimaryButton size="small" className={classes.iconButton}><ShareIcon /></IconPrimaryButton>
          </Box>
          :
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
            {type === "requested" ?
              <PrimaryButton size="small" className={`${commonClasses.button} ${commonClasses.greenButton}`}>Pledge</PrimaryButton>
              :
              <div />
            }
            <IconPrimaryButton size="small" className={classes.iconButton}><ShareIcon /></IconPrimaryButton>
          </Box>
        :
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <SecondaryButton size="small" className={commonClasses.button}>Reject</SecondaryButton>
          <PrimaryButton size="small" className={`${commonClasses.button} ${commonClasses.greenButton}`}>Accept Pledge</PrimaryButton>
        </Box>
      }
    </Box>
  )
}

export default CollabCard;

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="8.71921" cy="8.9249" r="8.42332" fill="#707582" />
    <path d="M4.90344 9.00537L12.5342 9.00552" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.71887 5.1925L8.71872 12.8233" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = () => (
  <svg width="22" height="21" viewBox="0 0 22 21" fill="none">
    <path d="M18.6709 10.5C18.6709 14.6421 15.1451 18 10.7959 18C6.44666 18 2.9209 14.6421 2.9209 10.5C2.9209 6.35786 6.44666 3 10.7959 3C15.1451 3 18.6709 6.35786 18.6709 10.5Z" fill="#FF801A" />
    <path d="M10.7959 6.33203V10.4987L13.4209 12.9987" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ShareIcon = () => (
  <svg width="19" height="18" viewBox="0 0 19 18" fill="none">
    <path opacity="0.9" d="M12.3733 12.7701L6.57537 9.87107M6.56713 7.51654L12.3706 4.61483M17.3505 13.9453C17.3505 15.396 16.1744 16.572 14.7237 16.572C13.273 16.572 12.097 15.396 12.097 13.9453C12.097 12.4945 13.273 11.3185 14.7237 11.3185C16.1744 11.3185 17.3505 12.4945 17.3505 13.9453ZM17.3505 3.43825C17.3505 4.88896 16.1744 6.065 14.7237 6.065C13.273 6.065 12.097 4.88896 12.097 3.43825C12.097 1.98753 13.273 0.811493 14.7237 0.811493C16.1744 0.811493 17.3505 1.98753 17.3505 3.43825ZM6.84347 8.69175C6.84347 10.1425 5.66743 11.3185 4.21672 11.3185C2.766 11.3185 1.58997 10.1425 1.58997 8.69175C1.58997 7.24103 2.766 6.065 4.21672 6.065C5.66743 6.065 6.84347 7.24103 6.84347 8.69175Z" stroke="white" strokeWidth="1.5" />
  </svg>
)

const StartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M9.1889 7.95089L11.2901 6.2189C11.5872 5.97308 11.4334 5.49102 11.0443 5.4706L8.33855 5.30644C8.17439 5.29603 8.03106 5.19353 7.9694 5.03978L6.97487 2.49818C6.83153 2.13944 6.32906 2.13944 6.18572 2.49818L5.19159 5.02974C5.12993 5.18349 4.9866 5.28598 4.82244 5.29639L2.10628 5.46055C1.71711 5.48097 1.56337 5.96262 1.86045 6.20846L3.96163 7.9305C4.08455 8.033 4.14621 8.20716 4.10496 8.36091L3.41832 10.995C3.32623 11.3641 3.72581 11.6612 4.05372 11.4562L6.33949 9.9904C6.48282 9.89831 6.65739 9.89831 6.79031 9.9904L9.08603 11.4562C9.41393 11.6612 9.81392 11.3641 9.72142 10.995L9.03478 8.37085C9.00435 8.2175 9.0556 8.05335 9.18892 7.95085L9.1889 7.95089Z" fill="#707582" />
  </svg>
)

const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M6.93668 0.450928C3.32982 0.450928 0.394531 3.38638 0.394531 6.99307C0.394531 10.5998 3.32998 13.5352 6.93668 13.5352C10.5434 13.5352 13.4788 10.5998 13.4788 6.99307C13.4788 3.38638 10.5434 0.450928 6.93668 0.450928ZM2.56999 6.44804H11.2821C11.4285 6.44553 11.5698 6.50143 11.674 6.6038C11.7783 6.70679 11.8373 6.84684 11.8373 6.99318C11.8373 7.13952 11.7783 7.27955 11.674 7.38194C11.5698 7.48431 11.4285 7.54083 11.2821 7.53832H2.56999C2.42366 7.54083 2.28235 7.48431 2.1781 7.38194C2.07385 7.27957 2.01482 7.13952 2.01482 6.99318C2.01482 6.84684 2.07385 6.7068 2.1781 6.6038C2.28236 6.50143 2.42366 6.44553 2.56999 6.44804Z" fill="#707582" />
  </svg>
)

const CheckIcon = () => (
  <svg width="18" height="17" viewBox="0 0 18 17" fill="none">
    <circle cx="9.21946" cy="8.4249" r="7.89168" fill="#707582" stroke="white" strokeWidth="1.06328" />
    <path d="M6.02441 8.36323L8.1951 10.5355L12.4158 6.31482" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const TimeIcon = () => (
  <svg width="44" height="43" viewBox="0 0 44 43" fill="none">
    <path d="M38.0806 21.5025C38.0806 30.0679 30.7898 37.0115 21.7962 37.0115C12.8025 37.0115 5.51172 30.0679 5.51172 21.5025C5.51172 12.9371 12.8025 5.99353 21.7962 5.99353C30.7898 5.99353 38.0806 12.9371 38.0806 21.5025Z" fill="#FFB885" fillOpacity="0.62" />
    <path d="M21.7961 12.8827V21.4988L27.2243 26.6685" stroke="white" strokeWidth="2.06786" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
