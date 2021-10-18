import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Grid, useMediaQuery } from "@material-ui/core";

import { TitleGrandLight } from "../../index.styles";
import ModifyLevelsModal from "./modals/ModifyLevelsModal";
import ModifyRulesModal from "./modals/ModifyRulesModal";
import ModifyJoiningRulesModal from "./modals/ModifyJoiningRulesModal";
import { RootState } from "store/reducers/Reducer";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import Box from 'shared/ui-kit/Box';

const ruleCell = rule => {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {rule}
    </div>
  );
};

export default function RulesAndLevels(props) {
  const user = useSelector((state: RootState) => state.user);

  const [joiningRulesData, setJoiningRulesData] = useState<any[]>([]);
  const [rulesData, setRulesData] = useState<any[]>([]);
  const [levelsData, setLevelsData] = useState<any[]>([]);
  const [modifyJoiningRulesModal, setModifyJoiningRulesModal] = useState<boolean>(false);
  const [modifyRulesModal, setModifyRulesModal] = useState<boolean>(false);
  const [modifyLevelsModal, setModifyLevelsModal] = useState<boolean>(false);
  const [modifyJoiningRulesVisible, showModifyJoiningRulesVisible] = useState<boolean>(false);
  const [modifyRulesVisible, showModifyRulesVisible] = useState<boolean>(false);
  const [modifyLevelsVisible, showModifyLevelsVisible] = useState<boolean>(false);
  const mobileMatches = useMediaQuery("(max-width:375px)");

  const [levelsTableHeaders, setLevelsTableHeaders] = useState<Array<CustomTableHeaderInfo>>([]);
  const [levelsTableData, setLevelsTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  const [rulesTableHeaders, setRulesTableHeaders] = useState<Array<CustomTableHeaderInfo>>([
    { headerName: "RULE", headerAlign: "center" },
    { headerName: "VALUE", headerAlign: "center" },
  ]);
  const [rulesTableData, setRulesTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  const [joiningTableHeaders, setJoiningTableHeaders] = useState<Array<CustomTableHeaderInfo>>([
    { headerName: "RULE", headerAlign: "center" },
    { headerName: "VALUE", headerAlign: "center" },
  ]);
  const [joiningTableData, setJoiningTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  useEffect(() => {
    if (props.community && props.community.CommunityAddress) {
      if (user.id === props.community.Creator) {
        showModifyLevelsVisible(true);
        showModifyRulesVisible(true);
        showModifyJoiningRulesVisible(true);
      } else if (props.community && props.community.Admins && props.community.Admins.length > 0) {
        props.community.Admins.forEach(function (admin) {
          if (user.id === admin.userId) {
            showModifyLevelsVisible(true);
            showModifyRulesVisible(true);
            showModifyJoiningRulesVisible(true);
          }
        });
      }

      // set rules and levels
      setRules();
      setLevels();
      setJoiningRules();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.community]);

  useEffect(() => {
    const tableHeaders: Array<CustomTableHeaderInfo> = [];
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    if (levelsData) {
      if (mobileMatches) {
        tableHeaders.push({ headerName: "LEVEL", headerAlign: "center" });
        levelsData.map((level, index) => {
          const row: Array<CustomTableCellInfo> = [];
          row.push({
            cell: (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div
                  style={{
                    marginRight: "16px",
                    width: "20px",
                    height: "20px",
                    border: "1px solid #888",
                    color: "#888",
                    borderRadius: "10px",
                    textAlign: "center",
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ display: "grid", textAlign: "center", justifyContent: "center" }}>
                  <span>{level.Name}</span>
                  <span
                    style={{
                      color: "#707582",
                      fontSize: "14px",
                    }}
                  >
                    {level.Description}
                  </span>
                </div>
              </div>
            ),
            cellAlign: "center",
          });
          tableData.push(row);
        });
      } else {
        tableHeaders.push({ headerName: "LEVEL", headerAlign: "center" });
        tableHeaders.push({ headerName: "DESCRIPTION", headerAlign: "center" });
        levelsData.map((level, index) => {
          const row: Array<CustomTableCellInfo> = [];
          row.push(
            {
              cell: (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      marginRight: "16px",
                      width: "20px",
                      height: "20px",
                      border: "1px solid #888",
                      color: "#888",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                  >
                    {index + 1}
                  </div>
                  {level.Name}
                </div>
              ),
              cellAlign: "center",
            },
            {
              cell: level.Description,
              cellAlign: "center",
            }
          );
          tableData.push(row);
        });
      }
    }
    setLevelsTableHeaders(tableHeaders);
    setLevelsTableData(tableData);
  }, [levelsData, mobileMatches]);

  useEffect(() => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    if (rulesData) {
      rulesData.map(level => {
        const row: Array<CustomTableCellInfo> = [];
        row.push(
          {
            cell: ruleCell(level.Rule),
            cellAlign: "center",
          },
          {
            cell: level.Value,
            cellAlign: "center",
          }
        );
        tableData.push(row);
      });
    }
    setRulesTableData(tableData);
  }, [rulesData]);

  useEffect(() => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    if (joiningRulesData) {
      joiningRulesData.map(level => {
        const row: Array<CustomTableCellInfo> = [];
        row.push(
          {
            cell: ruleCell(level.Rule),
            cellAlign: "center",
          },
          {
            cell: level.Value,
            cellAlign: "center",
          }
        );
        tableData.push(row);
      });
    }
    setJoiningTableData(tableData);
  }, [joiningRulesData]);

  // set joining rules from community
  const setJoiningRules = () => {
    let joiningRules: any = [];

    let requiredTokens: any[] = props.community.RequiredTokens;
    if (requiredTokens && requiredTokens.length > 0) {
      requiredTokens.forEach(token => {
        let rule = `Required ${token.token} Token`;
        let value = token.tokenValue;
        let requiredTokenRule = {
          Rule: rule,
          Value: value,
        };

        joiningRules.push(requiredTokenRule);
      });
    }

    props.community.AdditionalRules &&
      props.community.AdditionalRules.length > 0 &&
      props.community.AdditionalRules.map((item, index) => {
        let userLevelRule = {
          Rule: item.Rule,
          Value: item.Value,
        };
        joiningRules.push(userLevelRule);
      });

    setJoiningRulesData(joiningRules);
  };

  // set rules from community
  const setRules = () => {
    // TODO: add a switch like in the createCommunity modal for the parameter "RuleBased"
    // let isCommunityRuleBased: boolean = props.community.RuleBased || true;
    let communityRules: any = [];

    // if (isCommunityRuleBased) {
    let endorsementValue = props.community.MinimumEndorsementScore;
    let trustValue = props.community.MinimumTrustScore;
    let userLevelValue = props.community.MinimumUserLevel;

    communityRules = [
      { Rule: "Minimum Endorsement Score", Value: endorsementValue },
      { Rule: "Minimum Trust Score", Value: trustValue },
      { Rule: "Minimum User Level", Value: userLevelValue },
    ];
    // }

    if (props.community.AdditionalRules && props.community.AdditionalRules.length > 0) {
      props.community.AdditionalRules.forEach(rule => {
        communityRules.push(rule);
      });
    }

    setRulesData(communityRules);
  };

  // set levels from community
  const setLevels = () => {
    let communityLevels: any[] = props.community.Levels;
    let levels: any = [];

    if (communityLevels && communityLevels.length > 0) {
      communityLevels.forEach(level => {
        levels.push(level);
      });
    }
    setLevelsData(levels);
  };

  if (props.community && props.community.CommunityAddress)
    return (
      <>
        <Box mb={12}>
          <Box mb={5} display="flex" alignItems="center" justifyContent="space-between">
            <TitleGrandLight bold fontSize="30px" disableUppercase>
              DAO Levels
            </TitleGrandLight>

            {modifyLevelsVisible && (
              <DAOButton
                onClick={() => {
                  setModifyLevelsModal(true);
                }}
              >
                Modify Levels
              </DAOButton>
            )}
          </Box>
          <CustomTable
            theme="dark"
            headers={levelsTableHeaders}
            rows={levelsTableData}
            placeholderText="No levels registered."
          />
        </Box>

        <Grid container spacing={4}>
          <Grid md={6} xs={12} item>
            <Box mb={5} display="flex" alignItems="center" justifyContent="space-between">
              <TitleGrandLight bold fontSize="30px" disableUppercase>
                DAO Rules
              </TitleGrandLight>

              {modifyRulesVisible && (
                <DAOButton
                  onClick={() => {
                    setModifyRulesModal(true);
                  }}
                >
                  Modify Rules
                </DAOButton>
              )}
            </Box>

            <CustomTable
              theme="dark"
              headers={rulesTableHeaders}
              rows={rulesTableData}
              placeholderText="No rules registered."
            />
          </Grid>
          <Grid md={6} xs={12} item>
            <Box mb={5} display="flex" alignItems="center" justifyContent="space-between">
              <TitleGrandLight bold fontSize="30px" disableUppercase>
                Joining Rules
              </TitleGrandLight>

              {modifyJoiningRulesVisible && (
                <DAOButton
                  onClick={() => {
                    setModifyJoiningRulesModal(true);
                  }}
                >
                  Modify Joining Rules
                </DAOButton>
              )}
            </Box>

            <CustomTable
              theme="dark"
              headers={joiningTableHeaders}
              rows={joiningTableData}
              placeholderText="No joining rules registered."
            />
          </Grid>
        </Grid>

        <ModifyLevelsModal
          open={modifyLevelsModal}
          community={props.community}
          onClose={() => setModifyLevelsModal(false)}
          handleRefresh={() => props.handleRefresh()}
        />
        <ModifyRulesModal
          open={modifyRulesModal}
          community={props.community}
          onClose={() => setModifyRulesModal(false)}
          handleRefresh={() => props.handleRefresh()}
        />
        <ModifyJoiningRulesModal
          open={modifyJoiningRulesModal}
          community={props.community}
          onClose={() => setModifyJoiningRulesModal(false)}
          handleRefresh={() => props.handleRefresh()}
        />
      </>
    );
  else return null;
}
