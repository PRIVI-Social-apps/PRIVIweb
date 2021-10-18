import React from "react";
import Grid from "@material-ui/core/Grid";

import { DateInput } from "shared/ui-kit/DateTimeInput";
import { authorSchedulePostStyles } from "./AuthorSchedulePost.styles";
import { StyledSelectComponent } from "../Select/TokenSelect";
import Box from 'shared/ui-kit/Box';

const infoIcon = require("assets/icons/info_gray.png");
const infoIconWhite = require("assets/icons/info_white.png");

type AuthorScheduleProps = React.PropsWithChildren<{
  theme?: "dark" | "light";
  author: string | any;
  setterAuthor: (e) => void;
  schedulePost: Date;
  setterSchedulePost: (e) => void;
  authorArray: string[];
}>;

const AuthorSchedulePost = ({
  theme,
  author,
  setterAuthor,
  schedulePost,
  setterSchedulePost,
  authorArray,
}: AuthorScheduleProps) => {
  const classes = authorSchedulePostStyles();

  return (
    <Box
      width="100%"
      color={theme && theme === "dark" ? "white" : "#181818"}
      className={classes.authorDateRowBlogPost}
      fontSize="18px"
    >
      <Grid container direction="row" alignItems="flex-start" justify="flex-start" spacing={2}>
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center" mb={1}>
            <Box mr="4px">Author</Box>
            <img
              style={{ width: "12px", height: "12px" }}
              src={theme === "dark" ? infoIconWhite : infoIcon}
              alt={"info"}
            />
          </Box>

          <StyledSelectComponent
            theme={theme}
            value={author}
            onChange={event => {
              let author = event.target.value;
              setterAuthor(author);
            }}
            options={authorArray}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center">
            <Box mr="4px">Schedule post</Box>
            <img
              style={{ width: "12px", height: "12px" }}
              src={theme === "dark" ? infoIconWhite : infoIcon}
              alt={"info"}
            />
          </Box>
          <DateInput
            theme={theme}
            customStyle={{ marginTop: 8 }}
            id="date-picker-start-date"
            minDate={Date.now()}
            format="MM.dd.yyyy"
            placeholder="Select date..."
            value={schedulePost}
            onChange={(elem: any) => {
              let date = new Date(elem).getTime();
              setterSchedulePost(date);
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuthorSchedulePost;
