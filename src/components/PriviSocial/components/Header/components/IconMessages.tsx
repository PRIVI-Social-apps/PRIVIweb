import React from "react";

export const IconMessages: React.FunctionComponent<{ isActive: boolean }> = ({ isActive }) => (
  <svg width="26" height="26" viewBox="0 0 26 26">
    <path
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke={isActive ? "#00FF15" : "#727F9A"}
      fill="none"
      d="M1,12.3c0,1.8,0.4,3.5,1.2,5.1c0.9,1.9,2.4,3.5,4.2,4.6c1.8,1.1,3.9,1.7,6,1.7c1.8,0,3.5-0.4,5.1-1.2L25,25
	l-2.5-7.6c0.8-1.6,1.2-3.3,1.2-5.1c0-2.1-0.6-4.2-1.7-6c-1.1-1.8-2.7-3.2-4.6-4.2C15.8,1.4,14.1,1,12.3,1h-0.7
	C8.9,1.2,6.3,2.3,4.3,4.3S1.2,8.9,1,11.7V12.3z"
    />
  </svg>
);
