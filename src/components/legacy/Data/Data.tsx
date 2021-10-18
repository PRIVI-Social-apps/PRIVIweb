import "./Data.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "../../../store/reducers/Reducer";
import axios from "axios";
import URL from "shared/functions/getURL";
import Buttons from "shared/ui-kit/Buttons/Buttons";
import Graph from "shared/ui-kit/Page-components/Graph";
import { sampleGraphData } from "../Wallet/sampleData";
import CreateCampaignModal from "./modals/Create-Campaign-Modal/Create-Campaign-Modal";
import { FormControl, AppBar, Tabs, Tab, Backdrop, Fade, Modal, Tooltip } from "@material-ui/core";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { UserAvatar } from "shared/ui-kit/UserAvatar/UserAvatar";

//import ComingSoonModal from 'shared/ComingSoonModal';
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as PlusSolid } from "assets/icons/plus-solid.svg";
const pauseIcon = require("assets/icons/pause_icon.png");
const editIcon = require("assets/icons/edit_square_icon.png");
const hexagonEmpty = require("assets/icons/hexagon_empty.png");
const badgePhoto = require("assets/icons/badge.png");

const timeArray = ["Last 7 days", "Last 30 days", "Last 12 month"];

interface Data {
  x: any;
  y: number;
}

const PriviData = () => {
  // STORE
  const userSelector = useSelector((state: RootState) => state.user);

  // HOOKS
  const [allCampaign, setAllCampaigns] = useState<any>([]);
  const [campaignShow, setCampaignShow] = useState<any>([]);
  const [campaignsPodLength, setCampaignsPodLength] = useState<number>(0);
  const [campaignsPoolsLength, setCampaignsPoolsLength] = useState<number>(0);
  const [campaignsCommunititesLength, setCampaignsCommunititesLength] = useState<number>(0);
  const [infoPriviData, setInfoPriviData] = useState<any>({});
  const [tabsCampaignsValue, setTabsCampaignsValue] = useState(0);
  const [timeSelector, setTimeSelector] = useState<string>("Last 7 days");
  const [firstGraphSelected, setFirstGraphSelected] = useState<number>(0);
  const [secondGraphSelected, setSecondGraphSelected] = useState<number>(0);
  const [openModalCreateCampaign, setOpenModalCreateCampaign] = useState<boolean>(false);

  const [last7DaysTotal, setLast7DaysTotal] = useState<any>({
    impressions: 0,
    users: 0,
    clicks: 0,
  });
  const [last30DaysTotal, setLast30DaysTotal] = useState<any>({
    impressions: 0,
    users: 0,
    clicks: 0,
  });
  const [last12monthsTotal, setLast12monthsTotal] = useState<any>({
    impressions: 0,
    users: 0,
    clicks: 0,
  });
  const [last7DaysData, setLast7DaysData] = useState<any>({
    impressions: [] as Data[],
    users: [] as Data[],
    clicks: [] as Data[],
  });
  const [last30DaysData, setLast30DaysData] = useState<any>({
    impressions: [] as Data[],
    users: [] as Data[],
    clicks: [] as Data[],
  });
  const [last12monthsData, setLast12monthsData] = useState<any>({
    impressions: [] as Data[],
    users: [] as Data[],
    clicks: [] as Data[],
  });

  const history = useHistory();
  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  /*const [openModalComingSoon, setOpenModalComingSoon] = useState<boolean>(true);

  const handleCloseModalComingSoon = () => {
    //setOpenModalComingSoon(false);
  };*/

  // FUNCTIONS
  useEffect(() => {
    if (userSelector && userSelector.id && userSelector.id.length > 0) {
      loadCampaigns();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelector]);

  const loadCampaigns = () => {
    axios
      .get(`${URL()}/privi-data/getInfo/${userSelector.id}`)
      .then(response => {
        if (response.data.success) {
          setInfoPriviData(response.data.data);
        }
      })
      .catch(error => {
        console.log(error);
        //alert("Error getInfo");
      });
    axios
      .get(`${URL()}/privi-data/getCampaigns/${userSelector.id}`)
      .then(response => {
        if (response.data.success) {
          const campaigns = response.data.data;
          setAllCampaigns(campaigns);
          setCampaignShow(campaigns);

          let pods = 0;
          let pools = 0;
          let communities = 0;

          campaigns.forEach(campaign => {
            if (campaign.ItemType === "Pod") {
              pods += 1;
            } else if (campaign.ItemType === "Pool") {
              pools += 1;
            } else if (campaign.ItemType === "Community") {
              communities += 1;
            }
          });

          setCampaignsPodLength(pods);
          setCampaignsPoolsLength(pools);
          setCampaignsCommunititesLength(communities);

          if (campaigns.length > 0) {
            let last7 = {
              impressions: [] as Data[],
              users: [] as Data[],
              clicks: [] as Data[],
            };
            let last30 = {
              impressions: [] as Data[],
              users: [] as Data[],
              clicks: [] as Data[],
            };
            let last12Month = {
              impressions: [] as Data[],
              users: [] as Data[],
              clicks: [] as Data[],
            };
            let last7Count = {
              impressions: 0,
              users: 0,
              clicks: 0,
            };
            let last30Count = {
              impressions: 0,
              users: 0,
              clicks: 0,
            };
            let last12MonthCount = {
              impressions: 0,
              users: 0,
              clicks: 0,
            };

            last30.clicks.length = 30;
            last30.users.length = 30;
            last30.impressions.length = 30;
            last7.clicks.length = 7;
            last7.users.length = 7;
            last7.impressions.length = 7;

            for (let i = 0; i < 30; i++) {
              campaigns.forEach(campaign => {
                last30Count.clicks = last30Count.clicks + campaign.Last30DaysClicks[i].Clicks;
                last30.clicks[i] = {
                  x: campaign.Last30DaysClicks[i].Date,
                  y: last30.clicks[i] ? last30.clicks[i].y : 0 + campaign.Last30DaysClicks[i].Clicks,
                };
                if (i < 7) {
                  last7Count.clicks = last7Count.clicks + campaign.Last30DaysClicks[i].Clicks;
                  last7.clicks[i] = {
                    x: campaign.Last30DaysClicks[i].Date,
                    y: last7.clicks[i] ? last7.clicks[i].y : 0 + campaign.Last30DaysClicks[i].Clicks,
                  };
                }

                last30Count.impressions = last30Count.impressions + campaign.Last30DaysImpressions[i].Impressions;
                last30.impressions[i] = {
                  x: campaign.Last30DaysImpressions[i].Date,
                  y: last30.impressions[i]
                    ? last30.impressions[i].y
                    : 0 + campaign.Last30DaysImpressions[i].Impressions,
                };
                if (i < 7) {
                  last7Count.impressions = last7Count.impressions + campaign.Last30DaysImpressions[i].Impressions;
                  last7.impressions[i] = {
                    x: campaign.Last30DaysImpressions[i].Date,
                    y: last7.impressions[i]
                      ? last7.impressions[i].y
                      : 0 + campaign.Last30DaysImpressions[i].Impressions,
                  };
                }

                last30Count.users = last30Count.users + campaign.Last30DaysUsers[i].Users;
                last30.users[i] = {
                  x: campaign.Last30DaysUsers[i].Date,
                  y: last30.users[i] ? last30.users[i].y : 0 + campaign.Last30DaysUsers[i].Users,
                };
                if (i < 7) {
                  last7Count.users = last7Count.users + campaign.Last30DaysUsers[i].Users;
                  last7.users[i] = {
                    x: campaign.Last30DaysUsers[i].Date,
                    y: last7.users[i] ? last7.users[i].y : 0 + campaign.Last30DaysUsers[i].Users,
                  };
                }
              });
            }

            last12Month.clicks.length = 12;
            last12Month.users.length = 12;
            last12Month.impressions.length = 12;

            for (let i = 0; i < 12; i++) {
              campaigns.forEach(campaign => {
                last12MonthCount.clicks = last12MonthCount.clicks + campaign.Last12MonthClicks[i].Clicks;
                last12Month.clicks[i] = {
                  x: campaign.Last12MonthClicks[i].Date,
                  y: last12Month.clicks[i] ? last12Month.clicks[i].y : 0 + campaign.Last12MonthClicks[i].Clicks,
                };

                last12MonthCount.impressions =
                  last12MonthCount.impressions + campaign.Last12MonthImpressions[i].Impressions;
                last12Month.impressions[i] = {
                  x: campaign.Last12MonthImpressions[i].Date,
                  y: last12Month.impressions[i]
                    ? last12Month.impressions[i].y
                    : 0 + campaign.Last12MonthImpressions[i].Impressions,
                };

                last12MonthCount.users = last12MonthCount.users + campaign.Last12MonthUsers[i].Users;
                last12Month.users[i] = {
                  x: campaign.Last12MonthUsers[i].Date,
                  y: last12Month.users[i] ? last12Month.users[i].y : 0 + campaign.Last12MonthUsers[i].Users,
                };
              });
            }

            setLast30DaysData(last30);
            setLast30DaysTotal(last30Count);
            setLast7DaysData(last7);
            setLast7DaysTotal(last7Count);
            setLast12monthsData(last12Month);
            setLast12monthsTotal(last12MonthCount);
          } else {
            const emptyData = [
              { x: 0, y: 0 },
              { x: 1, y: 0 },
            ];
            setLast30DaysData({
              impressions: emptyData,
              users: emptyData,
              clicks: emptyData,
            });
            setLast7DaysData({
              impressions: emptyData,
              users: emptyData,
              clicks: emptyData,
            });
            setLast12monthsData({
              impressions: emptyData,
              users: emptyData,
              clicks: emptyData,
            });
          }
        }
      })
      .catch(error => {
        console.log(error);
        //alert("Error getCampaigns");
      });
  };

  const handleChangeCampaignsValue = (event, newValue) => {
    switch (newValue) {
      case 0:
        setCampaignShow(allCampaign);
        break;
      case 1:
        let podsCampaigns = allCampaign.filter((item, i) => item.ItemType === "Pod");
        setCampaignShow(podsCampaigns);
        break;
      case 2:
        let poolsCampaigns = allCampaign.filter((item, i) => item.ItemType === "Pool");
        setCampaignShow(poolsCampaigns);
        break;
      case 3:
        let communitiesCampaigns = allCampaign.filter((item, i) => item.ItemType === "Community");
        setCampaignShow(communitiesCampaigns);
        break;
    }
    setTabsCampaignsValue(newValue);
  };

  const handleChangeTimeSelector = event => {
    const value = event.target.value;
    setTimeSelector(value);
  };

  const handleOpenModalCreateCampaign = () => {
    setOpenModalCreateCampaign(true);
  };

  const handleCloseModalCreateCampaign = () => {
    setOpenModalCreateCampaign(false);
  };

  const HeaderPriviData = () => {
    return (
      <div className="headerPriviData">
        <div className="headerLabelPriviData">
          PRIVI Data
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
            className="tooltipHeaderInfo"
            title={``}
          >
            <img src={require("assets/icons/info_green.png")} alt={"info"} />
          </Tooltip>
        </div>

        <div className="headerOptionsPriviData">
          {isSignedIn() ? (
            <UserAvatar
              user={userSelector}
              onClick={() => {
                history.push(`/profile/${userSelector.id}`);
              }}
            />
          ) : (
            <Buttons />
          )}
        </div>
      </div>
    );
  };

  const SubHeaderPriviData = () => {
    return (
      <div className="subHeaderData">
        <div className="firstRowSubHeaderData">
          <div className="firstColumnSubHeaderData">
            <div className="columnValuesSubHeaderData">
              <div className="headerFirstRowSubHeaderData">Active campaigns</div>
              <div className="mainValueFirstRowSubHeaderData">{infoPriviData.ActiveCampaigns || 0}</div>
            </div>
            <div className="columnValuesSubHeaderData">
              <div className="headerFirstRowSubHeaderData">Total spent</div>
              <div className="valueFirstRowSubHeaderData">{infoPriviData.TotalSpent || 0} pDATA</div>
            </div>
            <div className="columnValuesSubHeaderData">
              <div className="headerFirstRowSubHeaderData">Pods started</div>
              <div className="valueFirstRowSubHeaderData">{infoPriviData.PodsStarted || 0}</div>
            </div>
            <div className="columnValuesSubHeaderData">
              <div className="headerFirstRowSubHeaderData">Credit started</div>
              <div className="valueFirstRowSubHeaderData">{infoPriviData.CreditStarted || 0}</div>
            </div>
            <div className="columnValuesSubHeaderData">
              <div className="headerFirstRowSubHeaderData">Communities started</div>
              <div className="valueFirstRowSubHeaderData">{infoPriviData.CommunitiesStarted || 0}</div>
            </div>
            <div className="columnValuesSubHeaderData">
              <div className="headerFirstRowSubHeaderData">Governance groups</div>
              <div className="valueFirstRowSubHeaderData">{infoPriviData.governanceGroup || 0}</div>
            </div>
          </div>
          <div className="secondColumnSubHeaderData">
            <button className="buttonSubHeaderData" onClick={handleOpenModalCreateCampaign}>
              <SvgIcon className="marginRightPlusIconData">
                <PlusSolid />
              </SvgIcon>
              Create campaigns
            </button>
          </div>
        </div>
        <div className="secondRowSubHeaderData">
          <div className="paperGraphPriviData marginLeftPaperGraph">
            <div className="rowPaperGraphPriviData">
              <div className="valuesColPaperGraphPriviData">
                {firstGraphSelected === 0 ? (
                  <SelectedFirstGraphsOptions
                    id={0}
                    title="Impressions"
                    value={
                      timeSelector === timeArray[0]
                        ? last7DaysTotal.impressions
                        : timeSelector === timeArray[1]
                          ? last30DaysTotal.impressions
                          : last12monthsTotal.impressions
                    }
                    perCent={+23}
                  />
                ) : (
                  <FirstGraphsOptions
                    id={0}
                    title="Impressions"
                    value={
                      timeSelector === timeArray[0]
                        ? last7DaysTotal.impressions
                        : timeSelector === timeArray[1]
                          ? last30DaysTotal.impressions
                          : last12monthsTotal.impressions
                    }
                    perCent={+23}
                  />
                )}
                {firstGraphSelected === 1 ? (
                  <SelectedFirstGraphsOptions
                    id={1}
                    title="Users"
                    value={
                      timeSelector === timeArray[0]
                        ? last7DaysTotal.users
                        : timeSelector === timeArray[1]
                          ? last30DaysTotal.users
                          : last12monthsTotal.users
                    }
                    perCent={+12}
                  />
                ) : (
                  <FirstGraphsOptions
                    id={1}
                    title="Users"
                    value={
                      timeSelector === timeArray[0]
                        ? last7DaysTotal.users
                        : timeSelector === timeArray[1]
                          ? last30DaysTotal.users
                          : last12monthsTotal.users
                    }
                    perCent={+12}
                  />
                )}
                {firstGraphSelected === 2 ? (
                  <SelectedFirstGraphsOptions
                    id={2}
                    title="Clicks"
                    value={
                      timeSelector === timeArray[0]
                        ? last7DaysTotal.impressions
                        : timeSelector === timeArray[1]
                          ? last30DaysTotal.impressions
                          : last12monthsTotal.impressions
                    }
                    perCent={+33}
                  />
                ) : (
                  <FirstGraphsOptions
                    id={2}
                    title="Clicks"
                    value={
                      timeSelector === timeArray[0]
                        ? last7DaysTotal.clicks
                        : timeSelector === timeArray[1]
                          ? last30DaysTotal.clicks
                          : last12monthsTotal.clicks
                    }
                    perCent={+33}
                  />
                )}
              </div>
              <div className="selectorColPaperGraphPriviData">
                <div className="selectorPaperGraphPriviData">
                  <FormControl>
                    <StyledSelect
                      disableUnderline
                      value={timeSelector}
                      className="selectTimeGraphDataModal"
                      onChange={handleChangeTimeSelector}
                    >
                      {timeArray.map((item, i) => {
                        return (
                          <StyledMenuItem key={i} value={item}>
                            {item}
                          </StyledMenuItem>
                        );
                      })}
                    </StyledSelect>
                  </FormControl>
                </div>
              </div>
            </div>
            <div className="graphPriviData">
              <Graph
                data={
                  firstGraphSelected === 0
                    ? timeSelector === timeArray[0]
                      ? last7DaysData.impressions
                      : timeSelector === timeArray[1]
                        ? last30DaysData.impressions
                        : last12monthsData.impressions
                    : firstGraphSelected === 1
                      ? timeSelector === timeArray[0]
                        ? last7DaysData.users
                        : timeSelector === timeArray[1]
                          ? last30DaysData.users
                          : last12monthsData.users
                      : firstGraphSelected === 2
                        ? timeSelector === timeArray[0]
                          ? last7DaysData.clicks
                          : timeSelector === timeArray[1]
                            ? last30DaysData.clicks
                            : last12monthsData.clicks
                        : sampleGraphData
                }
                type={""}
              />
            </div>
          </div>
          <div className="paperGraphPriviData">
            <div className="rowPaperGraphPriviData">
              <div className="secondGraphColsPriviData">
                <div className="titleSelectedFirstGraphsOptions">Volume of trading</div>
                <div className="valueSelectedFirstGraphsOptions">483,384.30 pDATA</div>
              </div>
              <div className="secondGraphColsPriviData alignRightFlexPriviData">
                {secondGraphSelected === 0 ? (
                  <div className="selectedSecondGraphPriviData">3m</div>
                ) : (
                  <div className="labelSecondGraphPriviData" onClick={() => setSecondGraphSelected(0)}>
                    3m
                  </div>
                )}
                {secondGraphSelected === 1 ? (
                  <div className="selectedSecondGraphPriviData">6m</div>
                ) : (
                  <div className="labelSecondGraphPriviData" onClick={() => setSecondGraphSelected(1)}>
                    6m
                  </div>
                )}
                {secondGraphSelected === 2 ? (
                  <div className="selectedSecondGraphPriviData">1Y</div>
                ) : (
                  <div className="labelSecondGraphPriviData" onClick={() => setSecondGraphSelected(2)}>
                    1Y
                  </div>
                )}
                {secondGraphSelected === 3 ? (
                  <div className="selectedSecondGraphPriviData">All time</div>
                ) : (
                  <div className="labelSecondGraphPriviData" onClick={() => setSecondGraphSelected(3)}>
                    All time
                  </div>
                )}
              </div>
            </div>
            <div className="graphPriviData">
              <Graph data={sampleGraphData} type={""} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SelectedFirstGraphsOptions = (props: any) => {
    return (
      <div className="selectedFirstGraphsOptions">
        <div className="titleSelectedFirstGraphsOptions">{props.title}</div>
        <div className="valueSelectedFirstGraphsOptions">{props.value}</div>
        <div className={props.perCent > 0 ? "positiveSelectedPerCentValue" : "negativeSelectedPerCentValue"}>
          {props.perCent}%
        </div>
      </div>
    );
  };

  const FirstGraphsOptions = (props: any) => {
    return (
      <div className="firstGraphsOptions" onClick={() => setFirstGraphSelected(props.id)}>
        <div className="titleSelectedFirstGraphsOptions">{props.title}</div>
        <div className="valueSelectedFirstGraphsOptions">{props.value}</div>
        <div className={props.perCent > 0 ? "positiveSelectedPerCentValue" : "negativeSelectedPerCentValue"}>
          {props.perCent}%
        </div>
      </div>
    );
  };

  const SmallSquaresValuesPriviData = () => {
    return (
      <div className="smallSquaresValuesPriviData">
        <div className="smallSquarePriviData">
          <div className="titleSmallSquarePriviData">Wallet amount</div>
          <div className="valueSmallSquarePriviData">19.23 pDATA</div>
          <div className="tokenRowSmallSquarePriviData">
            <img
              src={require("assets/tokenImages/KAVA.png")}
              className="iconTokenRowSmallSquarePriviData"
              alt={"token"}
            />
            + 32 tokens
          </div>
        </div>
        <div className="smallSquarePriviData">
          <div className="headerSmallSquarePriviData">
            <div className="titleSmallSquarePriviData">Github forks</div>
            <div className="valueTitleSmallSquarePriviData">362</div>
          </div>
          <div className="graphSmallSquarePriviData">
            <Graph data={sampleGraphData} type={""} />
          </div>
        </div>
        <div className="smallSquarePriviData">
          <div className="headerSmallSquarePriviData">
            <div className="titleSmallSquarePriviData">Twitter followers</div>
            <div className="valueTitleSmallSquarePriviData">2,283</div>
          </div>
          <div className="graphSmallSquarePriviData">
            <Graph data={sampleGraphData} type={""} />
          </div>
        </div>
        <div
          className="smallSquarePriviData"
          style={{
            marginRight: "0px",
          }}
        >
          <div className="titleSmallSquarePriviData">Current level</div>
          <div className="levelRowSmallSquarePriviData">
            <div className="labelValueRowSmallSquarePriviData">{userSelector.level || 1}</div>
            <div className="hexagonsRowSmallSquarePriviData">
              <HexagonLevel emptyBadge={true} />
              <HexagonLevel emptyBadge={false} />
              <HexagonLevel emptyBadge={true} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const HexagonLevel = (props: any) => {
    return (
      <div className="heaxgonLevelPriviData">
        {props.emptyBadge ? (
          <img className="emptyHexagon"
            src={hexagonEmpty}
            alt={"hexagon"} />
        ) : (
          <div className="hex">
            <img className="hexagonPhoto"
              src={badgePhoto}
              alt="hexagon-content" />
          </div>
        )}
      </div>
    );
  };

  const SquareCampaignPriviData = (props: any) => {
    return (
      <div className="squareCampaignPriviData">
        <div className="headerSquareCampaignPriviData">
          <div className="firstColHeaderSquareCampaignPriviData">
            <div
              className="photoHeaderSquareCampaignPriviData"
              style={{
                backgroundImage: props.campaign.HasPhoto
                  ? `url(${URL()}/privi-data/getCampaignPhoto/${props.campaign.Id})`
                  : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
          <div className="secondColHeaderSquareCampaignPriviData">
            <div className="rowSecondColHeaderSquareCampaignPriviData">
              <div className="nameSecondColHeaderSquareCampaignPriviData">{props.campaign.Name}</div>
              <div className="buttonEditSecondColHeaderSquareCampaignPriviData">
                <img src={editIcon} className="editIconSquareCampaignPriviData" alt={"edit"} />
              </div>
            </div>
            <div className="rowSecondColHeaderSquareCampaignPriviData">
              <div className="colRowSecondColHeaderSquareCampaignPriviData">
                <div className="dateCampaignsSquareCampaignPriviData">
                  {new Date(props.campaign.DateStart).getDate() < 10
                    ? `0${new Date(props.campaign.DateStart).getDate()}`
                    : new Date(props.campaign.DateStart).getDate()}
                  .
                  {new Date(props.campaign.DateStart).getMonth() + 1 < 10
                    ? `0${new Date(props.campaign.DateStart).getMonth() + 1}`
                    : new Date(props.campaign.DateStart).getMonth() + 1}
                  .{new Date(props.campaign.DateStart).getFullYear()}
                </div>
                <div className="labelDateCampaignsSquareCampaignPriviData">CAMPAIGN START</div>
              </div>
              <div className="colRowSecondColHeaderSquareCampaignPriviData">
                <div className="dateCampaignsSquareCampaignPriviData">
                  {new Date(props.campaign.DateExpiration).getDate() < 10
                    ? `0${new Date(props.campaign.DateExpiration).getDate()}`
                    : new Date(props.campaign.DateExpiration).getDate()}
                  .
                  {new Date(props.campaign.DateExpiration).getMonth() + 1 < 10
                    ? `0${new Date(props.campaign.DateExpiration).getMonth() + 1}`
                    : new Date(props.campaign.DateExpiration).getMonth() + 1}
                  .{new Date(props.campaign.DateExpiration).getFullYear()}
                </div>
                <div className="labelDateCampaignsSquareCampaignPriviData">CAMPAIGN END</div>
              </div>
            </div>
            <div className="rowSecondColHeaderSquareCampaignPriviData">
              <img src={pauseIcon} className="pauseIconSquareCampaignPriviData" alt={"pause"} />
              <div className="statusSquareCampaignPriviData">Pause campaign</div>
            </div>
          </div>
        </div>
        <div className="rowBodySquareCampaignPriviData">
          <div className="itemBodySquareCampaignPriviData">
            <div className="labelBodySquareCampaignPriviData">Impressions</div>
            <div className="valueBodySquareCampaignPriviData">{props.campaign.NumImpressions}</div>
          </div>
          <div className="itemBodySquareCampaignPriviData">
            <div className="labelBodySquareCampaignPriviData">Clicks</div>
            <div className="valueBodySquareCampaignPriviData">{props.campaign.NumClicks}</div>
          </div>
          <div className="itemBodySquareCampaignPriviData">
            <div className="labelBodySquareCampaignPriviData">Spent</div>
            <div className="valueBodySquareCampaignPriviData">{props.campaign.Spent} pDATA</div>
          </div>
        </div>
        <div className="graphBodySquareCampaignPriviData">
          <Graph data={sampleGraphData} type={""} />
        </div>
      </div>
    );
  };

  return (
    <div className="priviDataPage">
      <div className="privi-data-content">
        <SubHeaderPriviData />

        <SmallSquaresValuesPriviData />

        <div className="bodyPriviDataPage">
          <div className="labelTitlePriviData">Campaigns</div>
          <AppBar position="static" className="appBarPriviData">
            <Tabs
              value={tabsCampaignsValue}
              className="tabsPod"
              onChange={handleChangeCampaignsValue}
              TabIndicatorProps={{ style: { background: "#64c89e" } }}
            >
              <Tab label={"All campaigns "} />
              <Tab label={`Pods ${campaignsPodLength > 0 ? `(${campaignsPodLength})` : ""}`} />
              <Tab label={`Pools ${campaignsPoolsLength > 0 ? `(${campaignsPoolsLength})` : ""}`} />
              <Tab label={`Communities ${campaignsCommunititesLength > 0 ? `(${campaignsCommunititesLength})` : ""}`} />
            </Tabs>
          </AppBar>

          <div className="squaresCampaignPriviData">
            {campaignShow.map((item, i) => {
              return <SquareCampaignPriviData campaign={item} key={i} />;
            })}
          </div>
        </div>

        <Modal
          className="modalCampaign modal"
          open={openModalCreateCampaign}
          onClose={handleCloseModalCreateCampaign}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModalCreateCampaign}>
            <CreateCampaignModal onCloseModal={handleCloseModalCreateCampaign} handleRefresh={loadCampaigns} />
          </Fade>
        </Modal>
      </div>
      {/*<ComingSoonModal
            open={openModalComingSoon}
            handleClose={handleCloseModalComingSoon}
        />*/}
    </div>
  );
};

export default PriviData;
