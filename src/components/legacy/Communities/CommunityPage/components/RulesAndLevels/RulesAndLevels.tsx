import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useMediaQuery } from "@material-ui/core";

import "./RulesAndLevels.css";
import ModifyLevelsModal from "./modals/modifyLevelsModal";
import ModifyRulesModal from "./modals/modifyRulesModal";
import ModifyJoiningRulesModal from "./modals/modifyJoiningRulesModal";
import { RootState } from "store/reducers/Reducer";
import ruleIcon from "assets/icons/rules.png";
import { PrimaryButton } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";

const ruleCell = (rule) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          backgroundImage: `url(${ruleIcon})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginRight: "16px",
          width: "20px",
          height: "20px",
          color: "#888",
          textAlign: "center",
        }}
      />
      {rule}
    </div>
  );
}

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
  const mobileMatches = useMediaQuery('(max-width:375px)');

  const [levelsTableHeaders, setLevelsTableHeaders] = useState<Array<CustomTableHeaderInfo>>([]);
  const [levelsTableData, setLevelsTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  const [rulesTableHeaders, setRulesTableHeaders] = useState<Array<CustomTableHeaderInfo>>([
    { headerName: "RULE" },
    { headerName: "VALUE" },
  ]);
  const [rulesTableData, setRulesTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);

  const [joiningTableHeaders, setJoiningTableHeaders] = useState<Array<CustomTableHeaderInfo>>([
    { headerName: "RULE" },
    { headerName: "VALUE" },
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
        tableHeaders.push({ headerName: 'LEVEL' });
        levelsData.map((level, index) => {
          const row: Array<CustomTableCellInfo> = [];
          row.push({
            cell: (
              <div style={{ display: "flex", alignItems: "center" }}>
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
                <div style={{ display: "grid" }}>
                  <span>{level.Name}</span>
                  <span className="communityDescription">{level.Description}</span>
                </div>
              </div>
            )
          });
          tableData.push(row);
        });
      } else {
        tableHeaders.push({ headerName: 'LEVEL' });
        tableHeaders.push({ headerName: 'DESCRIPTION' });
        levelsData.map((level, index) => {
          const row: Array<CustomTableCellInfo> = [];
          row.push({
            cell: (
              <div style={{ display: "flex", alignItems: "center" }}>
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
            )
          }, {
            cell: level.Description
          });
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
      rulesData.map((level) => {
        const row: Array<CustomTableCellInfo> = [];
        row.push({
          cell: ruleCell(level.Rule)
        }, {
          cell: level.Value
        });
        tableData.push(row);
      });
    }
    setRulesTableData(tableData);
  }, [rulesData]);

  useEffect(() => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    if (joiningRulesData) {
      joiningRulesData.map((level) => {
        const row: Array<CustomTableCellInfo> = [];
        row.push({
          cell: ruleCell(level.Rule)
        }, {
          cell: level.Value
        });
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
      <div className="rules_and_levels">
        {/* LEVELS */}
        <div className="flexRowBetween">
          <div className="LevelsTitle">Community Levels</div>
          {modifyLevelsVisible && (
            <div className="buttonCreateTokenomics cursor-pointer">
              <PrimaryButton
                size="medium"
                onClick={() => {
                  setModifyLevelsModal(true);
                }}
              >
                Modify Levels
              </PrimaryButton>
            </div>
          )}
        </div>
        <div className="bottom">
          <CustomTable
            headers={levelsTableHeaders}
            rows={levelsTableData}
            placeholderText="No levels registered."
          />
        </div>
        {/* RULES */}
        <div className="flexRowBetween">
          <div className="RulesTitle">Community Rules</div>
          {modifyRulesVisible && (
            <div className="buttonCreateTokenomics">
              <PrimaryButton
                size="medium"
                onClick={() => {
                  setModifyRulesModal(true);
                }}
              >
                Modify Rules
              </PrimaryButton>
            </div>
          )}
        </div>
        <div className="bottom">
          <CustomTable
            headers={rulesTableHeaders}
            rows={rulesTableData}
            placeholderText="No rules registered."
          />
        </div>
        {/* JOINING RULES */}
        <div className="flexRowBetween">
          <div className="JoiningRulesTitle">Joining Rules</div>
          {modifyJoiningRulesVisible && (
            <div className="buttonCreateTokenomics">
              <PrimaryButton
                size="medium"
                onClick={() => {
                  setModifyJoiningRulesModal(true);
                }}
              >
                Modify Joining Rules
              </PrimaryButton>
            </div>
          )}
        </div>
        <div className="bottom" style={{ marginBottom: "15px" }}>
          <CustomTable
            headers={joiningTableHeaders}
            rows={joiningTableData}
            placeholderText="No joining rules registered."
          />
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
        </div>
      </div>
    );
  else return null;
}
