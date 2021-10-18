import React, { useState } from "react";

import { Box } from "@material-ui/core";

import URL from "shared/functions/getURL";
import TreasuryTokenModal from "../modals/TreasuryTokenModal/TreasuryTokenModal";
import { Text, Card } from "../../../index.styles";

export default function TreasuryToken({ balanceObj, transactions }) {
  const [openModalTreasury, setOpenModalTreasury] = useState<boolean>(false);
  const handleOpenModalTreasury = () => {
    setOpenModalTreasury(true);
  };
  const handleCloseModalTreasury = () => {
    setOpenModalTreasury(false);
  };

  if (balanceObj)
    return (
      <>
        <Card onClick={handleOpenModalTreasury} style={{ cursor: "pointer" }}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box
              width={48}
              height={48}
              style={{
                backgroundImage: balanceObj.Token
                  ? balanceObj.Type === "CRYPTO"
                    ? `url(${require(`assets/tokenImages/${balanceObj.Token}.png`)})`
                    : `url(${URL()}/wallet/getTokenPhoto/${balanceObj.Token})`
                  : "none",
                backgroundColor: "#D10869",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 24,
              }}
            />
            <Box display="flex" flexDirection="column" ml={2} fontSize="18px" color="white">
              <Text bold>Token</Text>
              <Box mt={0.5} fontFamily="Agrandir GrandLight">
                {balanceObj.Token}
              </Box>
            </Box>
          </Box>
        </Card>
        {openModalTreasury && (
          <TreasuryTokenModal
            open={openModalTreasury}
            onClose={handleCloseModalTreasury}
            transactions={transactions}
            balanceObj={balanceObj}
          />
        )}
      </>
    );
  else return null;
}
