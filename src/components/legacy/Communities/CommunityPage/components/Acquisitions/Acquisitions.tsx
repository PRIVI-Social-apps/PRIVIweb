import React, { useEffect, useRef, useState } from "react";
import { Grid } from "@material-ui/core";
import { VirtualizedMasnory } from "shared/ui-kit/VirtualizedMasnory";

import { FontSize, Header4, HeaderBold3, HeaderBold4, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { Badge, Card, Text, useStyles, BackIcon } from "./AcquisitionsStyle";
import AcquisitionProposal from "./components/AcquisitionProposal";
import { getMemberMediaAcquisitionProposals, getMediaAcquisitionProposals } from "shared/services/API";

export default function Acquisitions({ community }) {
  const classes = useStyles();
  const [showOnGoingProposal, setShowOnGoingProposal] = useState<boolean>(false);
  const [acceptedAcquisitionProposals, setAcceptedAcquisitionProposals] = useState<any[]>([]); // founder created proposals
  const [ongingProposals, setOngingProposals] = useState<any[]>([]); // memeber created proposals
  const [declinedProposals, setDeclinedProposals] = useState<any[]>([]); // member and founder created proposals
  const [pendingApprovalProposals, setPendingApprovalProposals] = useState<any[]>([]); // founder created proposals

  const scrollRef = useRef<any>();

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
            <Text bold size={FontSize.H4} ml={1.5}>
              Back
            </Text>
          </Box>
          <HeaderBold3>Ongoing & Ended Acquisitions</HeaderBold3>
          <Grid container spacing={4}>
            <Grid item md={4} sm={12}>
              <Box mt={2.5} mb={1.5}>
                <Header4>Ongoing Proposals</Header4>
              </Box>
              <Card margin>
                {ongingProposals.map(p => (
                  <AcquisitionProposal key={`acquisition-ongoing-1`} proposal={p} handleRefresh={loadData} />
                ))}
              </Card>
            </Grid>
            <Grid item md={4} sm={12}>
              <Box mt={2.5} mb={1.5}>
                <Header4>Declined</Header4>
              </Box>
              <Card margin>
                {declinedProposals.map(p => (
                  <AcquisitionProposal key={`acquisition-declined-1`} proposal={p} handleRefresh={loadData} />
                ))}
              </Card>
            </Grid>
            <Grid item md={4} sm={12}>
              <Box mt={2.5} mb={1.5}>
                <Header4>Pending of Approval</Header4>
              </Box>
              <Card margin>
                {pendingApprovalProposals.map(p => (
                  <AcquisitionProposal key={`acquisition-pending-1`} proposal={p} handleRefresh={loadData} />
                ))}
              </Card>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mb={3}>
            <HeaderBold4>Acquisitions</HeaderBold4>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Text bold size={FontSize.M} mr={1}>
                Active Proposals
              </Text>
              <Badge>{ongingProposals.length + pendingApprovalProposals.length}</Badge>
              <Box ml={2}>
                <PrimaryButton size="medium" onClick={handleShowOngoing}>
                  Ongoing & Ended Acquisitions
                </PrimaryButton>
              </Box>
            </Box>
          </Box>
          <Box className={classes.root}>
            {acceptedAcquisitionProposals && acceptedAcquisitionProposals.length > 0 && (
              <VirtualizedMasnory
                list={acceptedAcquisitionProposals}
                loadMore={() => {
                  // setPagination(pagination + 1);
                }}
                hasMore={false}
                scrollElement={scrollRef.current}
                type={"acquisition"}
                disableClick={false}
                itemRender={undefined}
              />
            )}
          </Box>
        </>
      )}
    </div>
  );
}
