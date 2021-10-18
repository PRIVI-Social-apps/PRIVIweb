import React from "react";

export const IconSearch: React.FunctionComponent<{ isActive: boolean }> = ({ isActive }) => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path
      fill={isActive ? "#00FF15" : "#727F9A"}
      d="M22.5,23.5c0.3,0.3,0.8,0.3,1.1,0s0.3-0.8,0-1.1L22.5,23.5z M19.7,10.7c0,4.9-4,9-9,9v1.5
	c5.8,0,10.5-4.7,10.5-10.5H19.7z M10.7,19.7c-4.9,0-9-4-9-9H0.3c0,5.8,4.7,10.5,10.5,10.5V19.7z M1.8,10.7c0-4.9,4-9,9-9V0.3
	C4.9,0.3,0.3,4.9,0.3,10.7H1.8z M10.7,1.8c4.9,0,9,4,9,9h1.5c0-5.8-4.7-10.5-10.5-10.5V1.8z M23.5,22.5l-5.4-5.4l-1.1,1.1l5.4,5.4
	L23.5,22.5z"
    />
  </svg>
);
