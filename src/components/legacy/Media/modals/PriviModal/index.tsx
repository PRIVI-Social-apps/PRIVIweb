import React from "react";
import { Modal } from "@material-ui/core";

const PriviModal = (props: any) => {
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className={props.styles.modal}
    >
      <>
        <div className="exit" onClick={props.handleClose}>
          <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
        </div>
        {props.children}
      </>
    </Modal>
  );
};

export default PriviModal;
