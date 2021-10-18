import React from "react"
import classnames from "classnames"
import { Box, makeStyles, Popper, Paper, Grow, ClickAwayListener, MenuList, MenuItem } from "@material-ui/core"
import { Color, FontSize, PrimaryButton, SecondaryButton, StyledDivider } from "shared/ui-kit";
import { Text } from "../ui-kit";
import { priviMusicDaoPageStyles } from "components/PriviMusicDao/index.styles";
import { BorrowIcon, RepayIcon, UnstakeIcon } from "../Icons/SvgIcons";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(() => ({
  removeCard: {
    background: 'linear-gradient(0deg, #F4F8FC, #F4F8FC), #F0F6FB',
  },
  paper: {
    background: Color.White,
    boxShadow: "0px 8px 24px -5px rgba(71, 78, 104, 0.19), 0px 41px 65px -11px rgba(36, 46, 60, 0.1)",
    borderRadius: 20,
    padding: "19px 16px"
  },
  menuItem: {
    width: 230,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    transition: "none",
    color: Color.MusicDAODark,
    "& > svg": {
      marginRight: 16,
      fill: Color.MusicDAODark,
    },
    "&:hover": {
      background: "linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D",
      borderRadius: 12,
      color: Color.MusicDAOGreen
    },
    "&:hover > svg": {
      fill: Color.MusicDAOGreen,
    }
  },
  manageButton: {
    minWidth: '180px !important',
  },
  menuButton: {
    minWidth: '60px !important',
  },
  primaryButton: {
    borderRadius: '29px !important',
    height: '40px !important',
    background: '#2D3047 !important',
    fontWeight: 600,
    fontSize: '14px !important',
    lineHeight: '18px !important',
    color: '#FFFFFF !important',
    marginLeft: '0 !important',
    flex: 1,
  },
  secondaryButton: {
    border: '1px solid rgba(84, 101, 143, 0.3) !important',
    background: 'transparent !important',
    borderRadius: '29px !important',
    height: '40px !important',
    fontWeight: 600,
    fontSize: '14px !important',
    lineHeight: '18px !important',
    color: '#2D3047 !important',
    marginLeft: '0 !important',
    flex: 1,
  }
}));

export default function LiquidityPositionCard({ data }) {
  const classes = useStyles();
  const commonClasses = priviMusicDaoPageStyles();

  const history = useHistory();
  const anchorMenuRef = React.useRef<any>(null);

  const [openMenu, setOpenMenu] = React.useState<boolean>(false);

  const handleOpenMenu = () => {
    setOpenMenu(true);
  }

  const handleCloseMenu = () => {
    setOpenMenu(false);
  }

  const handleListKeyDownMenu = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenMenu(false);
    }
  };

  return (
    <Box className={classnames(commonClasses.card, data.type === 'Remove' && classes.removeCard)} pt={5} pb={3} px={3}>
      <Text size={FontSize.H4_5} bold>Liquidity Position</Text>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mt={3}>
        <Text>Pool</Text>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Text mr={2} bold>USDT</Text>
          <img src={require("assets/tokenImages/USDT.png")} alt="token" width={28} />
        </Box>
      </Box>
      <StyledDivider type="solid" margin={2} />
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Text>Liquidity</Text>
        <Text bold>$ 1.456</Text>
      </Box>
      <StyledDivider type="solid" margin={2} />
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Text>Interval</Text>
        <Text bold>12-24hours</Text>
      </Box>
      <StyledDivider type="solid" margin={2} />
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Text>Date</Text>
        <Text bold>23/06/2021</Text>
      </Box>
      <StyledDivider type="solid" margin={2} />
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Text>Rewards Accumulated</Text>
        <Text bold>245 USDT</Text>
      </Box>
      <StyledDivider type="solid" margin={2} />
      {data.type === "Add" && data.status === 1 && (
        <>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
            <Text>Borrowed Liquidity</Text>
            <Text bold>22244 USDT</Text>
          </Box>
          <StyledDivider type="solid" margin={2} />
        </>
      )}
      <Box px={3} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" gridColumnGap={20} mt={2}>
        {data.type === "Add" && (
          data.status === 0 ?
            <>
              <SecondaryButton size="medium" className={classes.secondaryButton}>Unstake</SecondaryButton>
              <PrimaryButton size="medium" className={classes.primaryButton}>Borrow</PrimaryButton>
            </>
            :
            <>
              <SecondaryButton size="medium" className={classnames(classes.secondaryButton, classes.manageButton)} onClick={() => history.push('/privi-music-dao/liquidity/position/123456')}>Manage</SecondaryButton>
              <SecondaryButton size="medium" className={classnames(classes.secondaryButton, classes.menuButton)} onClick={handleOpenMenu}>
                <svg width="23" height="5" viewBox="0 0 23 5" fill="none" ref={anchorMenuRef}>
                  <path d="M4.51985 2.43119C4.51985 3.57758 3.59052 4.50691 2.44413 4.50691C1.29774 4.50691 0.368408 3.57758 0.368408 2.43119C0.368408 1.2848 1.29774 0.355469 2.44413 0.355469C3.59052 0.355469 4.51985 1.2848 4.51985 2.43119Z" fill="#2D3047" />
                  <path d="M13.5198 2.43119C13.5198 3.57758 12.5905 4.50691 11.4441 4.50691C10.2977 4.50691 9.36841 3.57758 9.36841 2.43119C9.36841 1.2848 10.2977 0.355469 11.4441 0.355469C12.5905 0.355469 13.5198 1.2848 13.5198 2.43119Z" fill="#2D3047" />
                  <path d="M22.5198 2.43119C22.5198 3.57758 21.5905 4.50691 20.4441 4.50691C19.2977 4.50691 18.3684 3.57758 18.3684 2.43119C18.3684 1.2848 19.2977 0.355469 20.4441 0.355469C21.5905 0.355469 22.5198 1.2848 22.5198 2.43119Z" fill="#2D3047" />
                </svg>
              </SecondaryButton>
              <Popper
                open={openMenu}
                anchorEl={anchorMenuRef.current}
                transition
                disablePortal={false}
                style={{ position: "inherit" }}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                      position: "inherit",
                    }}
                  >
                    <Paper className={classes.paper}>
                      <ClickAwayListener onClickAway={handleCloseMenu}>
                        <MenuList
                          autoFocusItem={openMenu}
                          id="menu-list-grow"
                          onKeyDown={handleListKeyDownMenu}
                        >
                          <MenuItem className={classes.menuItem}>
                            <RepayIcon />
                            Repay
                          </MenuItem>
                          <MenuItem className={classes.menuItem}>
                            <BorrowIcon />
                            Borrow
                          </MenuItem>
                          <MenuItem className={classes.menuItem}>
                            <UnstakeIcon />
                            Unstake
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </>
        )}
        {data.type === "Remove" && (
          <SecondaryButton size="medium" className={classes.secondaryButton}>Unstake</SecondaryButton>
        )}
      </Box>
    </Box>
  )
}
