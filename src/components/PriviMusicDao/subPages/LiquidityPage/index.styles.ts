import { makeStyles } from "@material-ui/core";
import { Color } from "shared/ui-kit";

export const useStyles = makeStyles((theme) => ({
  container: {
    background: "linear-gradient(180deg, rgba(243, 254, 247, 0) 49.94%, #F0F5F8 96.61%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)",
    width: '100%',
    height: "100%",
  },
  content: {
    width: '100%',
    maxWidth: 1440,
    margin: 'auto',
    padding: '80px 50px',
    [theme.breakpoints.down("sm")]: {
      padding: '65px 25px',
    },
    [theme.breakpoints.down("xs")]: {
      padding: '30px 15px',
    },
  },
  table: {
    borderRadius: 12,
    background: Color.White,
    marginBottom: 40,
    "& .MuiTableCell-root": {
      fontSize: 14,
      color: Color.MusicDAODark
    },
    "& .MuiTableCell-root.MuiTableCell-head": {
      borderBottom: `1px solid ${Color.MusicDAOGreen}`,
    },
    "& .MuiTableCell-head": {
      fontWeight: "bold",
    },
  },
  headerTitle: {
    fontSize: 58,
    fontWeight: 800,
    marginBlock: 0,
    marginBottom: 8,
    color: Color.White,
    [theme.breakpoints.down("sm")]: {
      fontSize: 52,
      marginBottom: 25,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 40,
      marginBottom: 15,
    },
  },
  headerSecond: {
    fontSize: 30,
    fontWeight: 800,
    color: Color.White,
    [theme.breakpoints.down("sm")]: {
      fontSize: 26,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 20,
    },
  },
  headerSubTitle: {
    fontSize: 26,
    fontWeight: 400,
    marginBlock: 0,
    marginBottom: 26,
    lineHeight: "39px",
    color: Color.White,
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      fontSize: 22,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
  descriptionGroup: {
    width: '100%',
    maxWidth: 1200,
    margin: 'auto',
    paddingRight: 30,
  },
  description: {
    fontSize: '20px !important',
    color: '#FFFFFF !important',
    [theme.breakpoints.down("sm")]: {
      fontSize: '16px !important',
    },
  },
  descriptionLogo: {
    width: 110,
    minWidth: 110,
    height: 110,
  },
  header2: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 30,
    marginTop: 30,
    [theme.breakpoints.down("sm")]: {
      fontSize: 22,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 20,
    },
  },
  tableHightlight: {
    fontWeight: 600,
    fontSize: "16px !important",
    color: `${Color.MusicDAOGreen} !important`,
  },
  transactionOption: {
    minWidth: 242,
    justifyContent: "flex-end",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "flex-start",
    },
  },
  card: {
    padding: '20px 40px',
    [theme.breakpoints.down("sm")]: {
      padding: '20px 28px',
    },
    [theme.breakpoints.down("xs")]: {
      padding: '20px 12px',
    },
  },
  statsCard: {
    padding: '20px 45px',
    [theme.breakpoints.down("xs")]: {
      padding: '20px 24px',
    },
  },
  poolOptions: {
    display: 'flex',
    alignItems: 'center',
    columnGap: 14,
    rowGap: 10,
    "& > button": {
      width: 205,
      height: 48,
      borderRadius: 48,
      border: 'none !important',
      marginLeft: '0px !important'
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: 'row',
      justifyContent: "space-between",
      "& > button": {
        flex: 1,
      },
    },
  },
  poolTitle: {
    justifyContent: 'space-between',
    alignItem: 'center',
    [theme.breakpoints.down("xs")]: {
      flexDirection: 'column',
      alignItem: 'space-between',
    },
  },
  poolsGroup: {
    overflowX: 'auto',
    width: 'calc(100% + 100px)',
    marginLeft: -50,
    padding: '0px 50px',
    [theme.breakpoints.down("sm")]: {
      width: 'calc(100% + 50px)',
      marginLeft: -25,
      padding: '0px 25px',
    },
    [theme.breakpoints.down("xs")]: {
      width: 'calc(100% + 30px)',
      marginLeft: -15,
      padding: '0px 15px',
    },
    "&::-webkit-scrollbar-thumb": {
      background: '#5cdabd',
    }
  },
  poolItem: {
    width: 320,
    minWidth: 320,
    maxWidth: 320
  },
  manageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5) !important'
  },
  divider: {
    "& > div": {
      opacity: 0.1,
    }
  },
  poolRewards: {
    flexDirection: 'row',
    [theme.breakpoints.down("xs")]: {
      flexDirection: 'column',
    },
  },
  poolRewardsSelect: {
    [theme.breakpoints.down("xs")]: {
      width: '100%',
      justifyContent: 'space-between'
    },
  },
  poolRewardsButtons: {
    "& > div": {
      display: 'flex',
      alignItems:' center',
      minWidth: 180,
      height: 40,
      "& > button": {
        flex: 1,
        height: 32,
      }
    },
    [theme.breakpoints.down("xs")]: {
      width: '100%',
      justifyContent: 'flex-end'
    },
  },
  arrowIcons: {
    width: 30,
    height: 30,
    cursor: 'pointer',
    "& > path": {
      stroke: '#77788E',
    },
    "&:last-child": {
      transform: 'rotate(180deg)',
    }
  },
  showAllButton: {
    border: '1px solid #65CB63 !important',
  }
}));
