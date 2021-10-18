import React from "react";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { convertObjectToJsx } from "shared/functions/commonFunctions";
import { signPayload } from "shared/services/WalletSign";
import { IAPIRequestProps } from "shared/services/API/interfaces";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";

interface IPriviSignatureRequestProps {
  open: boolean;
  payload: IAPIRequestProps;
  handleClose: () => void;
  handleError?: () => void;
  handleSigned: (signature: string) => void;
}

const PriviSignatureRequest: React.FC<IPriviSignatureRequestProps> = ({
  open,
  payload,
  handleClose,
  handleSigned,
}) => {
  const [status, setStatus] = React.useState<any>("");

  const handleConfirmSign = async () => {
    console.log("handleConfirmSign called");
    try {
      const { signature } = await signPayload(payload.Function, payload.Address, payload.Payload);
      handleSigned(signature);
    } catch (e) {
      setStatus({
        msg: "collab creation failed",
        key: Math.random(),
        variant: "error",
      });
      handleClose();
    }
  };

  return (
    <>
      <SignatureRequestModal
        open={open}
        address={payload.Address}
        transactionFee="0.0000"
        detail={convertObjectToJsx(payload.Payload)}
        handleOk={handleConfirmSign}
        handleClose={handleClose}
      />
      {status && <AlertMessage key={Math.random()} message={status.message} variant={status.variant} />}
    </>
  );
};

export default PriviSignatureRequest;
