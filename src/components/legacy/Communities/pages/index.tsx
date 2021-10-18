import React from "react";
import Buttons from "shared/ui-kit/Buttons/Buttons";
import CommunityPayment from "./CommunityPayment";

const CommunitiesMock = () => {
  return (
    <>
      <div className="communities-page">
        <div className={`header`}>
          <div className="buttons">
            <Buttons />
          </div>
        </div>
        <CommunityPayment />
      </div>
    </>
  );
};

export default CommunitiesMock;
