import { useStreaming } from "shared/contexts/StreamingContext";
import React from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "shared/ui-kit";
import { MediaCollection } from "../../elements";
import { Pricing } from "./Pricing";
import { SidebarParticipants } from "./SidebarParticipants";
import { SidebarStats } from "./SidebarStats";

export const Sidebar: React.FunctionComponent = () => {
  const { participants, currentStreaming } = useStreaming();

  return (
    <>
      <Accordion defaultExpanded>
        <AccordionSummary>💰 Price</AccordionSummary>
        <AccordionDetails>
          <Pricing />
        </AccordionDetails>
      </Accordion>
      {currentStreaming && (
        <SidebarStats
          views={currentStreaming.views}
          likes={currentStreaming.likes}
          shares={currentStreaming.shares}
        />
      )}
      <Accordion defaultExpanded>
        <AccordionSummary>🔍 Media Details</AccordionSummary>
        <AccordionDetails>
          <SidebarParticipants
            allStreamers={participants.allStreamers}
            allModerators={participants.allModerators}
            onlineWatchers={participants.onlineWatchers}
            description={currentStreaming?.description ?? ""}
          />
        </AccordionDetails>
      </Accordion>
      <MediaCollection />
    </>
  );
};
