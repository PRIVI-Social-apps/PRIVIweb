import React from "react";

import { Avatar, Color, StyledDivider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

export default function SaluteItem(props) {
  if (props.item)
    return (
      <Box display="flex" flexDirection="column" color="white" fontSize="18px" mb={2}>
        <Box display="flex" alignItems="center">
          <Avatar
            noBorder
            url={
              props.item.userData && props.item.userData.imageURL && props.item.userData.imageURL.length > 0
                ? `${props.item.userData.imageURL}`
                : "none"
            }
            size="medium"
          />

          {!props.cred && (
            <Box ml={"-16px"} width="32px" height="32px">
              <div style={{ cursor: "pointer", width: "32px" }} className="hex">
                <img
                  className="hex"
                  src={props.item.BadgeURL ? `${props.item.BadgeURL}` : "none"}
                  alt="hexagon content"
                  width="32px"
                  height="32px"
                />
              </div>
            </Box>
          )}
          <Box ml={1}>{`${props.item.userData && props.item.userData.name ? props.item.userData.name : ""} ${
            !props.cred ? props.item.Action : `has ${props.item.Creds} creds`
          }`}</Box>
        </Box>
        <Box width="100%">
          <StyledDivider color={Color.White} type="solid" />
        </Box>
      </Box>
    );
  else return null;
}
