import { makeStyles } from "@material-ui/core";

export const treasuryTokenModalStyles = makeStyles(() => ({
  root: {
    width: "610px !important",
  },
  modalContent: {
    padding: 20,
  },
  firstPartTreasury: {
    padding: 30,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: 'calc(100% - 60px)'
  },
  photoTreasury: {
    width: 60,
    height: 60,
    backgroundColor: 'grey',
    borderRadius: '50%',
    marginRight: 13,
  },
  infoTreasury: {
    width: 'calc(100% - 133px)',
  },
  tokenNameTreasury: {
    fontSize: 16,
    fontWeight: 500,
    color: 'rgb(8, 24, 49)',
    lineHeight: '24px',
    marginBottom: 8
  },
  headerTreasury: {
    fontSize: 14,
    fontWeight: 500,
    color: 'rgb(101, 110, 126)',
    marginBottom: 5,
  },
  valueTreasury: {
    fontSize: 18,
    fontWeight: 500,
    color: 'rgb(8, 24, 49)'
  },
  secondPartTreasury: {
    padding: 30,
    backgroundColor: 'rgb(238, 241, 244)',
  },
  headerTableTreasury: {
    fontWeight: 700,
    fontSize: 10,
    color: 'rgb(101, 110, 126)'
  },
  valueTableTreasury: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '40px',
    color: 'rgb(101, 110, 126)',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  }
}));
