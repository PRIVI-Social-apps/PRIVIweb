import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Divider from "@material-ui/core/Divider";
import { Slider } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import "./ActionBar.css";
import { DropDownIcon } from "shared/ui-kit/Icons";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const ActionBar = ({ insurer, popularity, apr, trust, endors }) => {
  const useStyles = makeStyles(theme => ({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    icon: {
      verticalAlign: "bottom",
      height: 20,
      width: 20,
    },
    details: {
      alignItems: "center",
    },
    column: {
      flexBasis: "33.33%",
    },
    helper: {
      borderLeft: `2px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 2),
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    formControl: {
      margin: theme.spacing(1),
      width: 150,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const scoreMark = [
    {
      value: 0,
      label: "0%",
    },
    {
      value: 100,
      label: "100%",
    },
  ];

  const classes = useStyles();

  const StyledSlider = withStyles({
    root: {
      color: "black",
    },
    valueLabel: {
      color: "grey",
    },
  })(Slider);

  return (
    <div className="actionbar-container">
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<DropDownIcon />} aria-controls="panel1c-content" id="panel1c-header">
          <div className={classes.column}>Filter insurances ...</div>
        </AccordionSummary>
        <Divider />
        <AccordionDetails className={classes.details}>
          <div className="container v">
            <div className="container">
              <label>
                By Insurer:
                <FormControl className={classes.formControl}>
                  <InputWithLabelAndTooltip
                    transparent
                    placeHolder="Search by name"
                    onInputValueChange={insurer.handle}
                    type="text"
                  />
                </FormControl>
              </label>
            </div>
            <div className="container v">
              <div className="container">
                <p>Popularity</p>
                <div className="slider">
                  <StyledSlider
                    defaultValue={popularity.value}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                    step={1}
                    aria-labelledby="range-slider"
                    marks={scoreMark}
                    onChangeCommitted={popularity.handle}
                  />
                </div>
                <p>% APR</p>
                <div className="slider">
                  <StyledSlider
                    defaultValue={apr.value}
                    valueLabelDisplay="auto"
                    step={1}
                    aria-labelledby="range-slider"
                    marks={scoreMark}
                    onChangeCommitted={apr.handle}
                  />
                </div>
              </div>
              <div className="container">
                <p>Trust score</p>
                <div className="slider">
                  <StyledSlider
                    defaultValue={trust.value}
                    valueLabelDisplay="auto"
                    step={1}
                    aria-labelledby="range-slider"
                    marks={scoreMark}
                    onChangeCommitted={trust.handle}
                  />
                </div>
                <p>Endors score</p>

                <div className="slider">
                  <StyledSlider
                    defaultValue={endors.value}
                    valueLabelDisplay="auto"
                    step={1}
                    aria-labelledby="range-slider"
                    marks={scoreMark}
                    onChangeCommitted={endors.handle}
                  />
                </div>
              </div>
            </div>
          </div>
        </AccordionDetails>
        <Divider />
      </Accordion>
    </div>
  );
};

export default ActionBar;
