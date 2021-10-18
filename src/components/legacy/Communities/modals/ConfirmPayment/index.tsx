import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import Box from "shared/ui-kit/Box";
import { useTypedSelector } from "store/reducers/Reducer";
import {
  Avatar,
  BorderRadius,
  Color,
  FontSize,
  Gradient,
  Header3,
  HeaderBold3,
  Modal,
  PrimaryButton,
  SecondaryButton,
  TabNavigation,
  Text,
} from "shared/ui-kit";
import { getJoinedCommunities } from "shared/services/API";

const Tabs = ["Wallet", "Community Funds"];

const useStyles = makeStyles(() => ({
  cardContainer: {
    borderRadius: BorderRadius.XL,
    boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: Color.White,
    cursor: "pointer",
    marginBotttom: 8,
  },
  gradientText: {
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    background: Gradient.Mint,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  selectedCommunityId: {
    border: "1px solid #00CC8F",
  },
}));

type ConfirmPaymentProps = {
  open: boolean;
  handleClose: () => void;
  payWithOwnWallet: () => void;
  payWithCommunity: (communityId: string) => void;
};

const ConfirmPayment: React.FunctionComponent<ConfirmPaymentProps> = ({
  open,
  handleClose,
  payWithOwnWallet,
  payWithCommunity,
}) => {
  const user = useTypedSelector(state => state.user);
  const classes = useStyles();
  const history = useHistory();
  const [selectedCommunityId, setSelectedCommunityId] = React.useState<string>("");
  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const [communities, setCommunities] = React.useState<any[]>([]);

  const goToWalletManager = () => {
    history.push(`/wallet`);
  };

  React.useEffect(() => {
    if (user.address) {
      getJoinedCommunities(user.address).then(resp => {
        console.log(resp);
        if (resp.success) {
          setCommunities(resp.data ?? []);
        } else {
          console.log("error getting all communities");
        }
      });
    }
  }, [user.address]);

  return (
    <Modal size="small" isOpen={open} onClose={handleClose} showCloseIcon>
      <Header3>How would you like to pay?</Header3>
      <TabNavigation
        tabs={Tabs}
        currentTab={tabIndex}
        variant="primary"
        onTabChange={setTabIndex}
        padding={0}
      />
      {tabIndex === 0 && (
        <Box mt={8}>
          <Box className={classes.cardContainer} padding={4}>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              onClick={payWithOwnWallet}
            >
              <Box display="flex" flexDirection="column">
                <HeaderBold3 noMargin>Privi Wallet</HeaderBold3>
                <Text mt={0.5} size={FontSize.XL}>
                  Buy with your Privi Wallet
                </Text>
              </Box>
              <img src={require("assets/logos/privi.png")} alt="privi" />
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" mt={7}>
            <Text>Can’t find your wallet?</Text>
            <Text ml={3} className={classes.gradientText} onClick={goToWalletManager}>
              Go to Wallet Manager
            </Text>
          </Box>
        </Box>
      )}
      {tabIndex === 1 && (
        <Box mt={8}>
          {communities.map((community, index) => (
            <Box
              className={`${classes.cardContainer} ${
                selectedCommunityId === community?.CommunityAddress && classes.selectedCommunityId
              }`}
              padding={3}
              onClick={() => setSelectedCommunityId(community?.CommunityAddress)}
            >
              <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                <HeaderBold3 noMargin>{community.Name || ""}</HeaderBold3>
                <Avatar size="large" url={community.Url} />
              </Box>
            </Box>
          ))}
          <Box display="flex" flexDirection="row" justifyContent="space-between" mt={4}>
            <SecondaryButton size="medium" onClick={handleClose}>
              Cancel
            </SecondaryButton>
            <PrimaryButton
              size="medium"
              disabled={selectedCommunityId === null}
              onClick={() => payWithCommunity(selectedCommunityId)}
            >
              Confirm
            </PrimaryButton>
          </Box>
        </Box>
      )}
    </Modal>
  );
};

export default ConfirmPayment;
