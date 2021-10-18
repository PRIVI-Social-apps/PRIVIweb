import styled from "styled-components";
import { Grid } from "@material-ui/core";

export const OwnerWrapper = styled.div`
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.1);
  background: #fff;
  border-radius: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  margin: 15px 15px 0 0;

  &:hover {
    cursor: pointer;
  }
`;

export const UserPicture = styled.div<{ imageUrl: string }>`
  background-size: cover;
  height: 72px;
  width: 72px;
  min-width: 72px;
  min-height: 72px;
  border-radius: 50%;
  margin-right: 15px;
  background-color: #5a5a5a;
  background-image: url(${({ imageUrl }) => imageUrl});
  filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2)) !important;
  border: 2px solid white;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;

export const OnlineSpot = styled.span`
  background: conic-gradient(
    from 111.31deg at 50% 51.67%,
    #b1ff00 -118.12deg,
    #00ff15 110.62deg,
    #b1ff00 241.88deg,
    #00ff15 470.63deg
  );
  width: 15px;
  height: 15px;
  border: 2px solid #ffffff;
  box-sizing: border-box;
  filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2));
  border-radius: 50%;
`;

export const UserName = styled.h5`
  font-size: 18px;
  font-weight: 400;
  margin: 0;
  color: #707582;
  font-family: "Agrandir";
`;
export const GridItem = styled(Grid)``;

export const ProfileLabel = styled.div`
  border: 1px solid #707582;
  border-radius: 35px;
  font-size: 11px;
  color: #707582;
  margin-left: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px 1px;
}
`;
