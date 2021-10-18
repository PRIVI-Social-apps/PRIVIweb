import React from 'react';
import {TwitterIcon} from "shared/ui-kit/Icons";
import {TwitterShareButton} from "react-share";

const TwitterIconComponent = (props: any) => {
    const { socialToken, community } = props
    const text = socialToken
        ? "Check out my new PRIVI Social Token!"
        : community
            ? "Check out this PRIVI Community!"
            : ""
    const name = socialToken?.name || community?.Name
    const description = socialToken?.description || community?.description
    return (
        <TwitterShareButton
            title={
                `${text}` +
                "\n\n" +
                name +
                "\n" +
                description +
                "\n\n"
            }
            url={window.location.href}
            hashtags={["PRIVI"]}
        >
            <TwitterIcon />
        </TwitterShareButton>
    );
};

export default TwitterIconComponent;
