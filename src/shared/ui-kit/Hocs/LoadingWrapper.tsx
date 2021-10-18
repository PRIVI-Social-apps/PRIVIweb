import React from "react";
import { CircularProgress } from "@material-ui/core";
import styled from "styled-components";

interface ILoadingWrapperProps {
  loading: boolean;
  theme?: "dark" | "light" | "green";
}

export const LoadingWrapper: React.FC<ILoadingWrapperProps> = ({ children, loading, theme }) => {
  return loading ? (
    <LoaderDiv>
      <CircularProgress
        style={{
          color: theme && theme === "dark" ? "#D810D6" : theme && theme === "green" ? "#B1FF00" : "#27e8d9",
        }}
      />
    </LoaderDiv>
  ) : (
    <>{children}</>
  );
};

const LoaderDiv = styled("div")`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
`;
