import React, { useState } from "react";

import URL from "shared/functions/getURL";
import { Card, useStyles } from "../TreasuryStyle";
import TreasuryTokenModal from "../../../modals/Treasury/TreasuryTokenModal";
import { Header5, HeaderBold4 } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

export default function TreasuryToken(props) {
  const classes = useStyles();

  const [openModalTreasury, setOpenModalTreasury] = useState<boolean>(false);
  const handleOpenModalTreasury = () => {
    setOpenModalTreasury(true);
  };
  const handleCloseModalTreasury = () => {
    setOpenModalTreasury(false);
  };

  if (props.balanceObj)
    return (
      <>
        <Card
          onClick={handleOpenModalTreasury}
          style={{cursor: 'pointer'}}
        >
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box width={56} height={56}
              style={{
                backgroundImage: props.balanceObj.Token
                  ? props.balanceObj.Type === "CRYPTO"
                    ? `url(${require(`assets/tokenImages/${props.balanceObj.Token}.png`)})`
                    : `url(${URL()}/wallet/getTokenPhoto/${props.balanceObj.Token
                    })`
                  : "none",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 24,
              }}
            />
            <Box display="flex" flexDirection="column" ml={2}>
              <Header5 className={classes.darkColor}>{props.balanceObj.Token}</Header5>
              <HeaderBold4 noMargin>{props.balanceObj.Amount.toFixed(3)}</HeaderBold4>
            </Box>
          </Box>
        </Card>
        {
          openModalTreasury && (
            <TreasuryTokenModal
              open={openModalTreasury}
              onClose={handleCloseModalTreasury}
              transactions={props.transactions}
              balanceObj={props.balanceObj}
            />
          )
        }
      </>
    );
  else return null;
}
