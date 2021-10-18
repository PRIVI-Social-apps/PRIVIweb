import { Grid } from "@material-ui/core";
import React from "react";
import Moment from "react-moment";

import { Avatar } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

import { ReactComponent as ReplyIcon } from "assets/icons/reply_one.svg";
import { ReactComponent as ReplyButtonIcon } from "assets/icons/reply_button.svg";

import { discussionCardStyles } from "./index.styles";
import { useHistory } from "react-router-dom";
import { useTypedSelector } from "store/reducers/Reducer";

export default function DiscussionCard({ item }) {
    const classes = discussionCardStyles();
    const history = useHistory();

    const users = useTypedSelector(state => state.usersInfoList);

    return (
        <div className={classes.content}>
            <Grid container>
                <Grid item xs={12} sm={4} md={3}>
                    <div className={classes.flexBox}>
                        <div className={classes.avatarBox}>
                            <Avatar
                                size="small"
                                url={
                                    users.find(user => user.id === item.creatorId)?.imageUrl ??
                                    require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")
                                }
                            />
                            <div className={classes.online} />
                        </div>
                        <Box ml={2}>
                            <div className={classes.title}>{item.title}</div>
                            <Moment format="ddd DD MMM, YYYY" className={classes.subtitle}>
                                {item.date}
                            </Moment>
                        </Box>
                    </div>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                    <div className={classes.title}>{item.title}</div>
                    <Box className={classes.subtitle} mt={2}>
                        {item.shortDescription}
                    </Box>
                    <Box
                        className={classes.flexBox}
                        justifyContent="space-between"
                        onClick={() => history.push(`/privi-data-new/governance/discussions/${item.discussionId}`)}
                    >
                        <div className={classes.flexBox}>
                            <ReplyIcon />
                            <Box className={classes.subtitle} ml={1}>{`${item.replies?.length || 0} Replies`}</Box>
                        </div>
                        <div className={classes.buttonBox}>
                            <Box className={classes.subtitle} mr={1}>
                                Reply
                            </Box>
                            <ReplyButtonIcon />
                        </div>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}
