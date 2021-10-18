import React, { useState, useEffect } from "react";
import { trackPromise } from "react-promise-tracker";
import { useDispatch } from "react-redux";
import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { useHistory } from "react-router-dom";
import { PriviData } from "store/actions/PriviLending";
import axios from "axios";
import "./Lendings.css";
import CreditPools from "./Credit-Pools/Credit-Pools";
import Buttons from "shared/ui-kit/Buttons/Buttons";
import { updateTutorialsSeen } from "store/actions/User";
import { UserAvatar } from "shared/ui-kit/UserAvatar/UserAvatar";

const Lendings = () => {
  // STORE
  const user = useTypedSelector((state) => state.user);
  const dispatch = useDispatch();
  const reduxLendings: Map<String, PriviData> = useTypedSelector(
    (state) => state.priviLending
  );

  //highest amount (for filtering)
  const [highestAmount, setHighestAmount] = useState<number>(0);
  //PRIVI Credit filters
  const [tokens, setTokens] = useState<string[]>(["All"]);
  const [tokenFilter, setTokenFilter] = useState<string>(tokens[0]);
  const [amountFilter, setAmountFilter] = useState<number[]>([
    0,
    highestAmount,
  ]);
  const [interestFilter, setInterestFilter] = useState<number[]>([0, 100]);
  const [trustFilter, setTrustFilter] = useState<number[]>([0, 100]);
  const [endorsmentFilter, setEndorsmentFilter] = useState<number[]>([0, 100]);
  const [filteredPriviList, setFilteredPriviList] = useState<PriviData[]>([]);

  const [tabsPriviCredit, setTabsPriviCredit] = useState("Credit");

  const history = useHistory();
  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  // call backend to sync data
  useEffect(() => {
    // update token filter
    trackPromise(
      axios.get(`${URL()}/wallet/getCryptosRateAsList`).then((res) => {
        const resp = res.data;
        if (resp.success) {
          const resTokens = ["All"];
          const rateList = resp.data;
          rateList.forEach((rateObj) => {
            resTokens.push(rateObj.token);
          });
          setTokens(resTokens);
        }
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // filtering priviList
  useEffect(() => {
    let lendings: PriviData[] = [];

    reduxLendings.forEach(function (value, _) {
      if (
        value.available_qty >= amountFilter[0] &&
        value.available_qty <= amountFilter[1] &&
        value.interest * 100 >= interestFilter[0] &&
        value.interest * 100 <= interestFilter[1] &&
        value.endorsement_score * 100 >= endorsmentFilter[0] &&
        value.endorsement_score * 100 <= endorsmentFilter[1] &&
        value.trust_score * 100 >= trustFilter[0] &&
        value.trust_score * 100 <= trustFilter[1]
      ) {
        if (value.funding_uom === tokenFilter || tokenFilter === tokens[0]) {
          lendings.push(value);
        }
      }
    });
    setFilteredPriviList(lendings);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    trustFilter,
    endorsmentFilter,
    amountFilter,
    interestFilter,
    tokenFilter,
    reduxLendings,
  ]);

  useEffect(() => {
    //update highest amount
    Array.from(reduxLendings.values()).forEach((value) => {
      if (value.funding_qty > highestAmount) {
        setHighestAmount(value.funding_qty);
        setAmountFilter([0, value.funding_qty]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredPriviList]);

  const handleTabPriviCredit = (value: string) => {
    setTabsPriviCredit(value);
  };

  const handleRestartTutorials = () => {
    const body = {
      userId: user.id,
      tutorialsSeen: {
        communities: user.tutorialsSeen.communities,
        pods: user.tutorialsSeen.pods,
        creditPools: false,
      },
    };

    axios
      .post(`${URL()}/user/updateTutorialsSeen`, body)
      .then((response) => {
        if (response.data.success) {
          //update redux data aswell
          dispatch(updateTutorialsSeen(body.tutorialsSeen));
        } else {
          console.log(`Restart credit pools tutorials failed`);
        }
      })
      .catch((error) => {
        console.log(error);
        //alert('Error handling anonymous avatar update');
      });
  };

  const HeaderPriviCredit = () => {
    return (
      <div className="headerPriviCredit">
        <div className="headerSelectedTabPriviCredit">
          {tabsPriviCredit}
          {tabsPriviCredit === "Credit" ? (
            <img
              src={require("assets/icons/info_green.png")}
              alt={"info"}
              onClick={handleRestartTutorials}
            />
          ) : null}
        </div>
        <div className="headerTabsPriviCredit">
          <div className="option-buttons">
            <button
              className={tabsPriviCredit === "Credit" ? "selected" : undefined}
              id="creditPoolsTab"
              onClick={() => {
                handleTabPriviCredit("Credit");
              }}
            >
              Credit Pools
            </button>
            <button
              className={
                tabsPriviCredit === "Loan Pools" ? "selected" : undefined
              }
              id="loanPoolsTab"
              onClick={() => {
                //handleTabPriviCredit("Loan Pools");
              }}
            >
              Loan Pools
            </button>
          </div>
        </div>
        <div className="headerOptionsPriviCredit">
          {isSignedIn() ? (
            <UserAvatar
              user={user}
              onClick={() => {
                history.push(`/profile/${user.id}`);
              }}
            />
          ) : (
            <Buttons />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="lendings">
      {tabsPriviCredit === "Credit" ? (
        <CreditPools
          tabsPriviCredit={tabsPriviCredit}
          filteredPriviList={filteredPriviList}
        />
      ) : null}
    </div>
  );
};

export default Lendings;
