import { makeStyles } from "@material-ui/core";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import { Color } from "shared/ui-kit";

export const swapHistoryStyles = makeStyles(theme => ({
  date: {
    color: "rgba(101, 110, 126, 0.7)",
  },
  externalLink: {
    verticalAlign: "middle",
  },
  flexBox: {
    display: "flex",
    alignItems: "center",
  },
  circle: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#FFD43E",
    marginRight: "8px",
  },
  container: {
    borderRadius: "8px",
    overflow: "hidden",
  },
  headerbig: {
    color: Color.MusicDAODark,
    fontSize: "22px",
    fontWeight: 800,
    lineHeight: "130%",
    fontFamily: "Agrandir Grandlight",
  },
  break: {
    overflowWrap: "anywhere",
  },
  tableContainer: {
    borderRadius: "12px",
    backgroundColor: "white",

    "& tr": {
      "& th:first-child": {
        borderTopLeftRadius: "12px",
      },

      "& th:last-child": {
        borderTopRightRadius: "12px",
      },
    },

    "& tr:last-child": {
      "& td:first-child": {
        borderBottomLeftRadius: "12px",
      },

      "& td:last-child": {
        borderBottomRightRadius: "12px",
      },
    },
  },
  title: {
    "& > div": {
      "&:last-child": {
        "& div": {
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          border: "none",
          fontWeight: 600,
          color: Color.Black,
        },
        width: "210px",
      },
    },
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: "8px",
    "& > div": {
      display: "flex",
      alignItems: "center",
    },
    "& .MuiInputBase-root": {
      marginLeft: "8px",
      background: "transparent",
      padding: 0,
      paddingRight: "8px",
      width: "fit-content",
      "& *": {
        fontFamily: "Montserrat",
        color: Color.MusicDAODark,
        fontSize: "14px",
      },
      "& .MuiSelect-select": {
        paddingRight: "8px",
      },
      "& svg": {
        marginTop: "4px",
      },
    },
    "& *": {
      fontFamily: "Montserrat",
      color: Color.MusicDAODark,
      fontSize: "14px",
    },
    "& button": {
      background: "transparent",
      padding: "12px",
      width: "calc(6px + 2 * 16px)",
      borderRadius: "50%",
      "&:hover": {
        background: "rgba(46, 49, 72, 0.2)",
      },
      "&:disabled": {
        opacity: 0.5,
        cursor: "not-allowed",
      },
      "& img": {
        width: "6px",
        height: "12px",
      },
      "&:first-child": {
        marginRight: "8px",
        "& img": {
          transform: "rotate(180deg)",
        },
      },
    },
  },
}));

export const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      fontFamily: "Montserrat",
      fontSize: "14px",
      border: "none",
      fontWeight: 800,
      padding: "24px",
      color: Color.MusicDAODark,
      background: "white",
      borderBottom: "1px solid #4218B5",
    },
    body: {
      fontSize: "13px",
      fontFamily: "Montserrat",
      borderBottom: "1px solid #0000001a",
      background: "white",
      color: "#54658F",
      padding: "22px 12px 16px",
      "&:nth-child(2n)": {
        background: "#eef2f64d",
      },
    },
  })
)(TableCell);
