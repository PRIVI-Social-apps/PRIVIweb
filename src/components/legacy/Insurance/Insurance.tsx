import './Insurance.css';
import React, { useState } from 'react';
import { useTypedSelector } from "store/reducers/Reducer";
import { useHistory } from "react-router-dom";
import Buttons from 'shared/ui-kit/Buttons/Buttons';
import InsurancePools from './Insurance-Pools/InsurancePools';
import ComingSoonModal from 'shared/ui-kit/Modal/Modals/ComingSoonModal';
import { UserAvatar } from "shared/ui-kit/UserAvatar/UserAvatar";

const Insurance = () => {
  const user = useTypedSelector((state) => state.user);
  // HOOKS
  const [insuranceTab, setInsuranceTab] = useState<number>(1);
  const [openModalComingSoon, setOpenModalComingSoon] = useState<boolean>(true);

  const history = useHistory();
  const isSignedIn = () => {
    return !!sessionStorage.getItem("token");
  };

  const handleCloseModalComingSoon = () => {
    //setOpenModalComingSoon(false);
  };


  return (
    <div className="insurance">
      <ComingSoonModal
        open={openModalComingSoon}
        handleClose={handleCloseModalComingSoon}
      />
      <div className={`header`}>
        <h2>{insuranceTab === 1 ? 'Insurance' : 'Insurers'}</h2>
        <div className="option-buttons">
          <button
            className={insuranceTab === 1 ? 'selected' : undefined}
            onClick={() => {
              setInsuranceTab(1);
            }}
          >
            Insurance Pools
          </button>
          <button
            className={insuranceTab === 2 ? 'selected' : undefined}
            onClick={() => {
              setInsuranceTab(2);
            }}
          >
            Insurers
          </button>
        </div>
        <div className="buttons">
          {isSignedIn() ? (
            <UserAvatar
              user={user}
              onClick={() => {
                history.push(`/profile/${user.id}`);
              }}
            />
          ) : (
            <Buttons />
          )}
        </div>
      </div>
      {insuranceTab === 1 ? <InsurancePools /> : null}
    </div>
  );
}

export default Insurance;
