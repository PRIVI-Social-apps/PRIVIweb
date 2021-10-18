import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { subDAOPageStyles } from "./index.styles";
import General from "./Tabs/General/General";
import Discussion from "./Tabs/Discussion/Discussion";
import Dashboard from "./Tabs/Dashboard/Dashboard";
import Projects from "./Tabs/Projects/Projects";
import Blog from "./Tabs/Blog/Blog";
import Treasury from "./Tabs/Treasury/Treasury";
import Members from "./Tabs/Members/Members";
import Jarr from "./Tabs/Jarr/Jarr";
import VestingTaxation from "./Tabs/VestingTaxation/VestingTaxation";
import RulesAndLevels from "./Tabs/RulesAndLevels/RulesAndLevels";
import About from "./Tabs/About/About";
import Acquisitions from "./Tabs/Acquisitions/Acquisitions";
import DAOPageHeader from "./components/DAOPageHeader";

import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { setSelectDiscordRoom } from "store/actions/SelectedDiscordRoom";
import { sumTotalViews } from "shared/functions/totalViews";
import { TabNavigation } from "shared/ui-kit";
import { LoadingWrapper } from "shared/ui-kit/Hocs/LoadingWrapper";
import "components/legacy/Communities/CommunityPage/CommunityPage.css";
import Header from "shared/ui-kit/Header/Header";

export const communityMenuDefaultOptions = [
  "General",
  "Discussion",
  "Dashboard",
  "Projects",
  "Blog",
  "Treasury",
  "Acquisitons",
  "Members",
  "Jarr",
  "Vesting and Taxation",
  "Rules and Levels",
  "About",
];

export default function DAOPage() {
  const classes = subDAOPageStyles();
  const dispatch = useDispatch();

  const user = useTypedSelector(state => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  const history = useHistory();

  const [community, setCommunity] = useState<any>({});
  const [communityMenuSelection, setCommunityMenuSelection] = useState<string>(
    communityMenuDefaultOptions[0]
  );

  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const [followed, setFollowed] = useState<boolean>(false);
  const [status, setStatus] = React.useState<any>("");
  const [trigger, setTrigger] = React.useState<boolean>(false);
  const [joined, setJoined] = useState<boolean>(false);

  let pathName = window.location.href; // If routing changes, change to pathname
  let idUrl = pathName.split("/")[5];
  const [communityId, setCommunityId] = useState<string>("");

  // ----------------------- BALANCE STREAMING ---------------------------

  // ---------------------------------------------------------------

  // get id from url
  useEffect(() => {
    if (idUrl) {
      axios
        .get(`${URL()}/community/getIdFromSlug/${idUrl}/community`)
        .then(response => {
          if (response.data.success) {
            const id = response.data.data.id;
            setCommunityId(id);
          }
        })
        .catch(error => {
          console.log(error);
          setStatus({
            msg: "Error getting DAO id",
            key: Math.random(),
            variant: "error",
          });
        });
    }
  }, [idUrl, history.location]);

  // get data from backend
  useEffect(() => {
    if (communityId && communityId.length > 0) {
      setIsDataLoading(true);
      axios
        .get(`${URL()}/community/getCommunity/${communityId}`)
        .then(async res => {
          const resp = res.data;
          if (resp.success) {
            let data = { ...resp.data };

            sumTotalViews(data);

            if (users && users.length > 0) {
              users.forEach(user => {
                if (data.Members && data.Members.length > 0) {
                  data.Members.forEach((member, index) => {
                    if (member.id === user.id) {
                      data.Members[index].userData = {
                        name: user.name,
                        imageURL: user.imageURL,
                        level: user.level,
                        followers: user.numFollowers,
                      };
                    }
                  });
                }

                if (data.TreasuryHistory && data.TreasuryHistory.length > 0) {
                  data.TreasuryHistory.forEach((history, index) => {
                    if (history.UserId === user.id) {
                      data.TreasuryHistory[index].userData = {
                        name: user.name,
                        imageURL: user.imageURL,
                      };
                    }
                  });
                }

                if (data.TreasuryGuards && data.TreasuryGuards.length > 0) {
                  data.TreasuryGuards.forEach((member, index) => {
                    if (member.id === user.id) {
                      data.TreasuryGuards[index].userData = {
                        name: user.name,
                        imageURL: user.imageURL,
                      };
                    }
                  });
                }

                if (data.Creator && data.Creator.length > 0 && data.Creator === user.id) {
                  data.creatorInfo = {
                    name: user.name,
                    imageURL: user.imageURL,
                    id: data.Creator,
                  };
                }
              });
            }

            if (data.EthereumContractAddress && data.EthChainId) {
              // now it only support if funding tokne on niswap is eth, if other pair is spported modification to params calls and back end needed
              const res = await axios.get(
                `${URL()}/ethereum/getUniSwapPrices?chainId=${data.EthChainId}&token0Address=${
                  data.EthereumContractAddress
                }`
              );
              // console.log('communityData price', res)
              if (res && res.data) {
                const prices = res.data;
                data.UniPriceInUsd = prices && prices.priceInUsd ? prices.priceInUsd : 0.0;
                data.UniPriceInFundingToken = prices && prices.priceInEth ? prices.priceInEth : 0.0;
              }
            }

            //console.log("communityData is", data);

            setCommunity(data);
            // check if user already followed the pod
            let newFollowed = false;
            const followers: any[] = data.Followers ?? [];
            followers.forEach(followerData => {
              const id = followerData.id;
              if (id === user.id) newFollowed = true;
            });
            setFollowed(newFollowed);
            // check if user already joined the pod
            let newJoined = false;
            const joinedUsers: any[] = data.Members ?? [];
            joinedUsers.forEach(joinedUserData => {
              const id = joinedUserData.id;
              if (id === user.id) newJoined = true;
            });
            setJoined(newJoined);
          }

          setIsDataLoading(false);
        })
        .catch(() => {
          setIsDataLoading(false);
        });
    }
  }, [trigger, users, communityId]);

  const getFounders = () => {
    const creatorList: any[] = [];
    if (community) {
      Object.keys(community.FoundersMap ?? {}).forEach(a => {
        if (!creatorList.some(item => item.address === a) && users.some(item => item.address === a)) {
          creatorList.push({
            ...users.find(item => item.address === a),
            role: "Founder",
          });
        }
      });

      if (creatorList.length <= 0 && community.creatorInfo) {
        creatorList.push({
          ...community.creatorInfo,
          role: "Founder",
        });
      }

      return creatorList;
    }

    return [];
  };

  const handleTabChange = value => {
    setCommunityMenuSelection(communityMenuDefaultOptions[value]);
    if (value === 1 || value === 8) {
      dispatch(setSelectDiscordRoom(null));
    }
  };

  return (
    <>
      <Header />
      <div className={classes.daoPage}>
        <div className={classes.contentWrapper}>
          <nav onClick={() => history.push("/privi-DAO")}>
            <img src={require("assets/icons/arrow_white.png")} alt="back" />
            Back
          </nav>
          <div className={classes.headerWrapper}>
            <LoadingWrapper theme="dark" loading={isDataLoading}>
              <DAOPageHeader
                dao={community}
                joined={joined}
                following={followed}
                getFounders={getFounders}
                currentTab={communityMenuSelection}
                isFounder={getFounders().some(u => u.id == user.id || u.address === user.address)}
                setStatus={setStatus}
                handleTrigger={() => setTrigger(!trigger)}
              />
            </LoadingWrapper>
          </div>
          <div className={classes.mobileHeaderWrapper}>
            <LoadingWrapper theme="dark" loading={isDataLoading}>
              {/* TODO: Make mobile header version*/}
              <DAOPageHeader
                dao={community}
                joined={joined}
                following={followed}
                getFounders={getFounders}
                currentTab={communityMenuSelection}
                isFounder={getFounders().some(u => u.id == user.id || u.address === user.address)}
                setStatus={setStatus}
                handleTrigger={() => setTrigger(!trigger)}
              />
            </LoadingWrapper>
          </div>
          <div className={classes.content}>
            <div className={classes.appbarContainer}>
              <TabNavigation
                tabs={communityMenuDefaultOptions}
                currentTab={communityMenuDefaultOptions.indexOf(communityMenuSelection)}
                variant="primary"
                onTabChange={handleTabChange}
                padding={0}
                theme="dark"
              />
            </div>
            <LoadingWrapper theme="dark" loading={isDataLoading}>
              <>
                {communityMenuSelection === communityMenuDefaultOptions[0] ? (
                  <General
                    community={community}
                    handleRefresh={() => setTrigger(!trigger)}
                    isFounder={getFounders().some(u => u.id == user.id || u.address === user.address)}
                  />
                ) : communityMenuSelection === communityMenuDefaultOptions[1] ? (
                  <Discussion community={community} trigger={trigger} />
                ) : communityMenuSelection === communityMenuDefaultOptions[2] ? (
                  <Dashboard community={community} />
                ) : communityMenuSelection === communityMenuDefaultOptions[3] ? (
                  <Projects
                    community={community}
                    communityId={community.CommunityAddress}
                    handleRefresh={() => setTrigger(!trigger)}
                    trigger={trigger}
                  />
                ) : communityMenuSelection === communityMenuDefaultOptions[4] ? (
                  <Blog communityId={community.CommunityAddress} community={community} />
                ) : communityMenuSelection === communityMenuDefaultOptions[5] ? (
                  <Treasury
                    treasuryVoting={community.TreasuryVotingsArray || undefined}
                    community={community}
                    handleRefresh={() => setTrigger(!trigger)}
                    trigger={trigger}
                  />
                ) : communityMenuSelection === communityMenuDefaultOptions[6] ? (
                  <Acquisitions community={community} />
                ) : communityMenuSelection === communityMenuDefaultOptions[7] ? (
                  <Members community={community} />
                ) : communityMenuSelection === communityMenuDefaultOptions[8] ? (
                  <Jarr community={community} />
                ) : communityMenuSelection === communityMenuDefaultOptions[9] ? (
                  <VestingTaxation
                    community={community}
                    isFounder={getFounders().some(u => u.id == user.id || u.address === user.address)}
                  />
                ) : communityMenuSelection === communityMenuDefaultOptions[10] ? (
                  <RulesAndLevels community={community} handleRefresh={() => setTrigger(!trigger)} />
                ) : (
                  <About community={community} />
                )}
              </>
            </LoadingWrapper>
          </div>
        </div>

        {status ? <AlertMessage message={status.msg} variant={status.variant} /> : ""}
      </div>
    </>
  );
}
