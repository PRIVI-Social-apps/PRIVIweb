import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";

import { BackIcon, Card, Badge, Text, useStyles, TitleGrandLight } from "../../index.styles";
import AcquisitionProposal from "./components/AcquisitionProposal";
import Cards from "components/PriviDAO/components/Cards";
import { DAOButton } from "components/PriviDAO/components/DAOButton";
import { FontSize } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { getMemberMediaAcquisitionProposals, getMediaAcquisitionProposals } from "shared/services/API";

export default function Acquisitions({ community }) {
  const classes = useStyles();

  const [showOnGoingProposal, setShowOnGoingProposal] = React.useState<boolean>(false);
  const [acceptedAcquisitionProposals, setAcceptedAcquisitionProposals] = useState<any[]>([]); // founder created proposals
  const [ongingProposals, setOngingProposals] = useState<any[]>([]); // memeber created proposals
  const [declinedProposals, setDeclinedProposals] = useState<any[]>([]); // member and founder created proposals
  const [pendingApprovalProposals, setPendingApprovalProposals] = useState<any[]>([]); // founder created proposals

  const scrollRef = React.useRef<any>();

  useEffect(() => {
    loadData();
  }, [community.CommunityAddress]);

  const loadData = async () => {
    if (community.CommunityAddress) {
      // load member media acquisition proposals
      const newDeclinedProposals: any[] = [];
      const newAcceptedAcquisitionProposals: any[] = [];
      const newOngingProposals: any = [];
      const newPendingApprovalProposals: any = [];
      const resp1 = await getMemberMediaAcquisitionProposals(community.CommunityAddress);
      if (resp1?.success) {
        const data = resp1.data;
        data.forEach(datum => {
          switch (datum?.Result) {
            case "pending":
              newOngingProposals.push(datum);
              break;
            case "declined":
              newDeclinedProposals.push(datum);
              break;
          }
        });
      }
      // load founder media acquisition proposals
      const resp2 = await getMediaAcquisitionProposals(community.CommunityAddress);
      if (resp2?.success) {
        const data: any[] = resp2.data ?? [];
        data.forEach(datum => {
          switch (datum?.Result) {
            case "pending":
              newPendingApprovalProposals.push(datum);
              break;
            case "accepted":
              newAcceptedAcquisitionProposals.push(datum);
              break;
            case "declined":
              newDeclinedProposals.push(datum);
              break;
          }
        });
      }
      setDeclinedProposals(newDeclinedProposals);
      setAcceptedAcquisitionProposals(newAcceptedAcquisitionProposals);
      setOngingProposals(newOngingProposals);
      setPendingApprovalProposals(newPendingApprovalProposals);
    }
  };

  const handleShowOngoing = () => {
    setShowOnGoingProposal(true);
  };

  const handleHideOngoing = () => {
    setShowOnGoingProposal(false);
  };

  return (
    <div ref={scrollRef}>
      {showOnGoingProposal ? (
        <>
          <Box
            className={classes.back}
            display="flex"
            flexDirection="row"
            alignItems="center"
            mb={3}
            onClick={handleHideOngoing}
          >
            <BackIcon />
            <Text bold ml={6}>
              Back
            </Text>
          </Box>
          <TitleGrandLight disableUppercase fontSize="30px" bold mb={5}>
            {"Acquisitions"}
          </TitleGrandLight>
          <Grid container spacing={4}>
            <Grid item md={4} sm={12}>
              <Box mb={5} display="flex" alignItems="center" justifyContent="space-between">
                <TitleGrandLight>Ongoing</TitleGrandLight>
              </Box>

              {ongingProposals.map(p => (
                <Card>
                  <AcquisitionProposal
                    type="ongoing"
                    key={`acquisition-ongoing-1`}
                    proposal={p}
                    handleRefresh={loadData}
                  />
                </Card>
              ))}
            </Grid>
            <Grid item md={4} sm={12}>
              <Box mb={5} display="flex" alignItems="center" justifyContent="space-between">
                <TitleGrandLight>Declined</TitleGrandLight>
              </Box>
              {declinedProposals.map(p => (
                <Card>
                  <AcquisitionProposal
                    type="declined"
                    key={`acquisition-declined-1`}
                    proposal={p}
                    handleRefresh={loadData}
                  />
                </Card>
              ))}
            </Grid>
            <Grid item md={4} sm={12}>
              <Box mb={5} display="flex" alignItems="center" justifyContent="space-between">
                <TitleGrandLight>Pending of Approval</TitleGrandLight>
              </Box>

              {pendingApprovalProposals.map(p => (
                <Card>
                  <AcquisitionProposal
                    type="pending"
                    key={`acquisition-pending-1`}
                    proposal={p}
                    handleRefresh={loadData}
                  />
                </Card>
              ))}
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mb={3}>
            <TitleGrandLight disableUppercase fontSize="30px" bold mb={5}>
              Acquisitions
            </TitleGrandLight>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Badge>{ongingProposals.length + pendingApprovalProposals.length}</Badge>
              <Text bold size={FontSize.L} ml={0.5}>
                Active Proposals
              </Text>
              <Box ml={3}>
                <DAOButton onClick={handleShowOngoing}>{`Ongoing & Ended Acquisitions`}</DAOButton>
              </Box>
            </Box>
          </Box>
          <Cards cards={acceptedAcquisitionProposals} cardType="Acquisition" />
        </>
      )}
    </div>
  );
}
