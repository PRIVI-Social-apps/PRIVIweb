import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import { useHistory } from "react-router-dom";
import { useTypedSelector } from "store/reducers/Reducer";
import axios from "axios";
import URL from "shared/functions/getURL";
import BorrowModal from "../../Credit-Pool-Page/components/BorrowModal";
import LoanModal from "../../Credit-Pool-Page/components/LoanModal";
import "./Pool-Card.css";

const PoolCard = (props: any) => {
  const history = useHistory();

  /* Modals*/
  const [openBorrow, setOpenBorrow] = useState<boolean>(false);

  const handleOpenBorrow = () => {
    setOpenBorrow(true);
  };

  const handleCloseBorrow = () => {
    setOpenBorrow(false);
  };

  const [openLoan, setOpenLoan] = useState<boolean>(false);

  const handleOpenLoan = () => {
    setOpenLoan(true);
  };

  const handleCloseLoan = () => {
    setOpenLoan(false);
  };

  return (
    <div
      className={props.trending ? "poolCard trendingColorPoolCard" : "poolCard"}
    >
      <div
        className="clickable"
        onClick={() => {
          history.push(`/lendings/credit-pools/${props.pool.CreditAddress}`);
        }}
      >
        <div className="firstRowPoolCard">
          <div
            className="poolProfilePhoto"
            style={{
              backgroundImage: props.pool.LendingToken
                ? `url(${require(`assets/tokenImages/${props.pool.LendingToken}.png`)})`
                : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            className={
              props.trending
                ? "nameScoresPool trendingColorPool"
                : "nameScoresPool"
            }
          >
            <div>
              {props.pool.CreditName ? props.pool.CreditName : "Credit Pool"}
            </div>
            <div className="flexRow">
              <div
                className={
                  props.trending
                    ? "trustScorePoolCard trendingColorPool"
                    : "trustScorePoolCard"
                }
              >
                <div className="valueScorePoolCard">
                  {props.pool.TrustScore * 100}%
                </div>
                <div className="labelScorePoolCard">TRUST</div>
              </div>
              <div className="endorsementScorePoolCard">
                <div className="valueScorePoolCard">
                  {props.pool.EndorsementScore * 100}%
                </div>
                <div className="labelScorePoolCard">ENDORSEMENT</div>
              </div>
            </div>
          </div>
        </div>
        <div className="secondRowPoolCard">
          <div
            className={
              props.trending
                ? "labelTokensRequiredPoolCard trendingColorPool"
                : "labelTokensRequiredPoolCard"
            }
          >
            TOKENS
            <br />
            REQUIRED
          </div>
        </div>
        <div className="thirdRowPoolCard">
          <div
            className={
              props.trending
                ? "labelColPoolCard trendingColorPool"
                : "labelColPoolCard"
            }
          >
            <div className="valueThirdRowPoolCard">
              {props.pool.Interest * 100}%
            </div>
            <div className="labelThirdRowPoolCard">INTEREST</div>
          </div>
          {props.pool.CollateralsAccepted &&
            props.pool.CollateralsAccepted.length > 0 ? (
            <div
              className={
                props.trending
                  ? "labelColPoolCard trendingColorPool"
                  : "labelColPoolCard"
              }
            >
              <div className="valueThirdRowPoolCard">
                {props.pool.CollateralsAccepted[0]}{" "}
                {props.pool.CollateralsAccepted.length > 1
                  ? `, ${props.pool.CollateralsAccepted[1]}`
                  : ""}
              </div>
              <div className="labelThirdRowPoolCard">COLLATERALS</div>
            </div>
          ) : null}
          <div
            className={
              props.trending
                ? "labelColPoolCard trendingColorPool"
                : "labelColPoolCard"
            }
          >
            <div className="valueThirdRowPoolCard">{props.pool.TotalViews ? props.pool.TotalViews : 0}</div>
            <div className="labelThirdRowPoolCard">VIEWS</div>

          </div>
        </div>
      </div>
      <div className="fourthRowPoolCard">
        {props.trending ? (
          <div className="buttonsContainerPoolCardTrending">
            <div
              className="lendButtonPoolCardTrending cursor-pointer"
              onClick={() => handleOpenLoan()}
            >
              Lend
            </div>
            <div
              className="borrowButtonPoolCardTrending cursor-pointer"
              onClick={() => handleOpenBorrow()}
            >
              Borrow
            </div>
          </div>
        ) : (
          <div className="buttonsContainerPoolCard">
            <div
              className="lendButtonPoolCard cursor-pointer"
              onClick={() => handleOpenLoan()}
            >
              Lend
            </div>
            <div
              className="borrowButtonPoolCard cursor-pointer"
              onClick={() => handleOpenBorrow()}
            >
              Borrow
            </div>
          </div>
        )}
        <BorrowModal
          open={openBorrow}
          handleClose={handleCloseBorrow}
          refreshPool={props.handleRefresh}
          pool={props.pool}
          userBalances={props.userBalances}
        />
        <LoanModal
          open={openLoan}
          handleClose={handleCloseLoan}
          refreshPool={props.handleRefresh}
          pool={props.pool}
          userBalances={props.userBalances}
        />
      </div>
      <div
        className="fifthRowPoolCard clickable"
        onClick={() => {
          history.push(`/lendings/credit-pools/${props.pool.CreditAddress}`);
        }}
      >
        {props.trending ? (
          <div className="lendersBorrowersPoolCard">
            <div
              className="labelLendersBorrowersPoolCardTrending"
              id="lendersValuesPoolCard"
            >
              <span className="valueLendersBorrowersPoolCardTrending">
                {props.pool.Lenders ? props.pool.Lenders.length : 0}
              </span>
              &nbsp; LENDERS
            </div>
            <div className="labelLendersBorrowersPoolCardTrending">
              <span className="valueLendersBorrowersPoolCardTrending">
                {props.pool.Borrowers ? props.pool.Borrowers.length : 0}
              </span>
              &nbsp; BORROWERS
            </div>
          </div>
        ) : (
          <div className="lendersBorrowersPoolCard">
            <div
              className="labelLendersBorrowersPoolCard"
              id="lendersValuesPoolCard"
            >
              <span className="valueLendersBorrowersPoolCard">
                {props.pool.Lenders ? props.pool.Lenders.length : 0}
              </span>
              &nbsp; LENDERS
            </div>
            <div className="labelLendersBorrowersPoolCard">
              <span className="valueLendersBorrowersPoolCard">
                {props.pool.Borrowers ? props.pool.Borrowers.length : 0}
              </span>
              &nbsp; BORROWERS
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoolCard;
