import { makeStyles } from "@material-ui/core";

export const cardsStyles = makeStyles(theme => ({
  cards: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 120,
    flexWrap: 'wrap',
    height: 'fit-content',
    '& > div': {
      width: '100%',
      height: 'fit-content'
    },
  },
  pills: {},
  searchPill: {
    fontFamily: 'Agrandir GrandLight',
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 20,
    lineHeight: '26px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#ffffff',
    justifyContent: 'space-between',
    background: 'linear-gradient(102.54deg, #00bfff -9.09%, #8d2eff 56.17%, #ff00c1 112.56%)',
    borderRadius: 8,
    padding: '8px 24px',
    width: 'fit-content !important',
    cursor: 'pointer',
    '& img': {
      width: 14,
      height: 14,
      marginLeft: 30
    }
  }
}));
