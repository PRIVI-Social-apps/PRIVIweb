import React from 'react';
import './Social-token.css'

import { formatNumber } from "shared/functions/commonFunctions";

const SocialToken = React.memo((props: any) => {
    return (
        <div className="socialToken">
            <div className="photoSocialToken"
                style={{
                    backgroundImage: `url(${props.socialToken.Url}?${Date.now()})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}>

            </div>
            <div className="nameSocialToken">
                {props.socialToken.TokenName}
            </div>
            <div className="valueSocialToken">
                {formatNumber(props.socialToken.UserBalance, props.socialToken.TokenSymbol, 4)}
            </div>
        </div>
    )
});

export default SocialToken;
