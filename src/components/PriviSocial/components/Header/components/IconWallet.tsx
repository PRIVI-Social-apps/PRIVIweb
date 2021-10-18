import React from "react";

export const IconWallet: React.FunctionComponent<{ isActive: boolean }> = ({ isActive }) => (
  <svg width="26" height="18" viewBox="0 0 26 18">
    <path
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke={isActive ? "#00FF15" : "#727F9A"}
      fill="none"
      d="M15.7,9L15.7,9 M3.7,17h18.7c1.5,0,2.7-1.2,2.7-2.7V3.7C25,2.2,23.8,1,22.3,1H3.7C2.2,1,1,2.2,1,3.7v10.7
	C1,15.8,2.2,17,3.7,17z M25,5h-9.3c-2.2,0-4,1.8-4,4c0,2.2,1.8,4,4,4H25V5z"
    />
  </svg>
);
