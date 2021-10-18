import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { InsurerData } from '../../sample';
import './InsurerRow.css';
import UseWindowDimensions from 'shared/hooks/useWindowDimensions';
import InsurePod from './InsurePod/InsurePod';

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as PlusSolid } from "assets/icons/plus-solid.svg";
import { ReactComponent as UserSolid } from "assets/icons/user-solid.svg";

export default function InsurerRow(props: { insurer: InsurerData }) {
  const { width } = UseWindowDimensions();

  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const followInsurer = () => {
    //TODO: backend function
  };

  return (
    <div className="insurer-container">
      <Grid
        className="insurer-row"
        container
        direction="row"
        alignItems="center"
        justify="center"
        wrap="nowrap"
        spacing={width > 100 ? 10 : 5}
      >
        <Grid item>
          <div
            className="grid-insurer-photo"
            style={{
              backgroundImage: `url(${props.insurer.insurer_imageurl})`,
            }}
          ></div>
        </Grid>
        <Grid item className="grid-insurer-item">
          <h4>{props.insurer.insurer_name}</h4>
        </Grid>
        <Grid item className="grid-insurer-item">
          <div>{`${props.insurer.insured_pods} insured Pods`}</div>
        </Grid>
        <Grid item className="grid-insurer-item">
          <div className="followers">
            <span>{props.insurer.followers}</span>
            <SvgIcon><UserSolid /></SvgIcon>
          </div>
        </Grid>
        <Grid item className="grid-insurer-item">
          <div>{`${props.insurer.investors} investors`}</div>
        </Grid>
        <Grid item className="grid-insurer-item buttons">
          <button className="invest" onClick={handleOpen}>
            INSURE YOUR POD
          </button>
          <InsurePod open={open} handleClose={handleClose} />
          <button
            className="plus"
            onClick={followInsurer}
            title="Follow insurance"
          >
            <SvgIcon>
              <PlusSolid />
            </SvgIcon>
          </button>
        </Grid>
      </Grid>
    </div>
  );
}
