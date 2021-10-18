import React from 'react';
import {FacebookIcon} from "shared/ui-kit/Icons";
import {FacebookShareButton} from "react-share";

const FacebookIconComponent = (props: any) => {
    const { socialToken, community } = props
    const text = socialToken
        ? "Check out my new PRIVI Social Token!"
        : community
            ? "Check out this PRIVI Community!"
            : ""
    const name = socialToken?.name || community?.Name
    const description = socialToken?.description || community?.description
    return (
        <FacebookShareButton
            quote={
                `${text}` +
                "\n\n" +
                name +
                "\n" +
                description +
                "\n\n"
            }
            url={window.location.href}
            hashtag="PRIVI"
        >
            <FacebookIcon />
        </FacebookShareButton>
    );
};

export default FacebookIconComponent;
