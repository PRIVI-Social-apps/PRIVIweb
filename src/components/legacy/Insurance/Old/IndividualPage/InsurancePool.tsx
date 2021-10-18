import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import LiquidityDepthGraph from "./component/LiquidityDepthGraph";

//import { useHistory } from 'react-router-dom';
//import axios from 'axios';
//import URL from 'shared/functions/getURL';
import { useTypedSelector } from "store/reducers/Reducer";
//import { useDispatch } from 'react-redux';
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

import { PoolData, poolRows } from "../sample";
import Invest from "../InsurancePools/InsuranceCard/Invest/Invest";

import "./InsurancePool.css";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as UserSolid } from "assets/icons/user-solid.svg";

export default function InsurancePool(props: any) {
  //const dispatch = useDispatch();
  const user = useTypedSelector(state => state.user);
  // const history = useHistory();
  const [status, setStatus] = React.useState<any>("");
  const [followed, setFollowed] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(false); // use to trigger useEffect to query data from backend each time some operation is done

  //const matches = useMediaQuery('(min-width:768px)');

  const [pool, setPool] = useState<PoolData>();
  const [openInvest, setOpenInvest] = useState<boolean>(false);

  const handleOpenInvest = () => {
    setOpenInvest(true);
  };

  const handleCloseInvest = () => {
    setOpenInvest(false);
  };

  const handleFollow = async () => {
    // follow
    if (!followed) {
      //TODO: FOLLOW
    }
    // unfollow
    else {
      //TODO: UNFOLLOW
    }
  };

  // used to query from backend the needed data for this page
  useEffect(() => {
    let pathName = window.location.href; // If routing changes, change to pathname
    let idUrl = pathName.split("/")[5];
    // get pool complete data -> TODO: get from backend

    setPool(poolRows.filter(value => value.id === idUrl)[0]);
  }, []);

  const PoolTransactionHistoryTableHearder = () => {
    return (
      <div className={"table-header"}>
        <Grid container spacing={2}>
          <Grid item xs={2} sm={2}>
            <b>TYPE</b>
          </Grid>
          <Grid item xs={2} sm={2}>
            <b>AMOUNT</b>
          </Grid>
          <Grid item xs={2} sm={2}>
            <b>FROM</b>
          </Grid>
          <Grid item xs={2} sm={2}>
            <b>TO</b>
          </Grid>
          <Grid item xs={2} sm={2}>
            <b>DATE</b>
          </Grid>
        </Grid>
      </div>
    );
  };

  const PoolTransactionHistoryTableBody = props => {
    return (
      <div className={"table-body"}>
        <Grid container spacing={2}>
          <Grid item xs={2} sm={2}>
            <p>{props.transaction.type}</p>
          </Grid>
          <Grid item xs={2} sm={2}>
            <p>{`${props.transaction.amount} ${props.transaction.token}`}</p>
          </Grid>
          <Grid item xs={2} sm={2}>
            <p>{props.transaction.from}</p>
          </Grid>
          <Grid item xs={2} sm={2}>
            <p>{props.transaction.to}</p>
          </Grid>
          <Grid item xs={2} sm={2}>
            <p>{props.transaction.date}</p>
          </Grid>
        </Grid>
      </div>
    );
  };

  const PoolsTransactionHistoryTable = () => {
    return (
      <div className={"transaction-table"}>
        <PoolTransactionHistoryTableHearder />
        {pool?.transactions.map(transaction => {
          return <PoolTransactionHistoryTableBody transaction={transaction} />;
        })}
      </div>
    );
  };

  return pool ? (
    <div className={"insurance-pool-page-container"}>
      <div className={"insurance-pool-page"}>
        <div className="buttons">
          <button onClick={handleFollow}>{followed ? "UNFOLLOW" : "FOLLOW"}</button>
          <button className="invest" onClick={handleOpenInvest}>
            INVEST
          </button>
          <Invest open={openInvest} handleClose={handleCloseInvest} pool={pool} />
        </div>
        <div className="top-container">
          <div className="insurer">
            <div className="main-info">
              <div
                className="image"
                style={{
                  backgroundImage: `url("${pool?.insurer_imageurl}")`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <h3>{pool?.insurer_name}</h3>
            </div>
            <div className="data">
              <p>{`Inscription fee: ${pool?.inscription_fee}`}</p>
              <p>{`Subscription fee: ${pool?.subscription_fee}`}</p>
              <p>{`Frequency: ${pool?.frequency}`}</p>
            </div>
          </div>
          <div className="pod">
            <div className="main-info">
              <div
                className="image"
                style={{
                  backgroundImage: `url("${pool?.pod_imageurl}")`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <h3>{pool?.pod_name}</h3>
            </div>
            <div className="data">
              <p>
                <SvgIcon><UserSolid /></SvgIcon>
                <span>{` Pod followers: ${pool?.pod_followers}`}</span>
              </p>
              <p>
                <SvgIcon><UserSolid /></SvgIcon>
                <span>{` Pod insurers: ${pool?.pod_insurers}`}</span>
              </p>
              <p>{`Insurance depth: ${pool?.insurance_depth}`}</p>
              <p>{`Insured amount: ${pool?.insured_amount}`}</p>
            </div>
          </div>
        </div>
        <div className="graph-container">
          <h3>LIQUIDITY DEPTH HISTORY</h3>
          <LiquidityDepthGraph />
        </div>
        <div className="transaction-table-container">
          <h3>TRANSACTION HISTORY</h3>
          <PoolsTransactionHistoryTable />
        </div>
        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}
      </div>
    </div>
  ) : (
    <div className="container">
      <h3>Insurance pool not found</h3>
    </div>
  );
}
