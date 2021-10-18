import React from 'react';

import SvgIcon from "@material-ui/core/SvgIcon";

import styles from './DigitalButtons.module.scss';
import { PrimaryButton, SecondaryButton } from 'shared/ui-kit';

import { ReactComponent as ShareAltSolid } from "assets/icons/share-alt-solid.svg"
import { ReactComponent as HeartRegular } from "assets/icons/heart-regular.svg"
import { ReactComponent as BookmarkRegular } from "assets/icons/bookmark-regular.svg"
const DigitalButtons = (props: any) => {

  return (
    <div className={styles.digital_buttons}>
      <PrimaryButton size="medium" onClick={() => props.handleOpenBuy()}>Buy Fraction</PrimaryButton>
      <SecondaryButton size="medium" onClick={() => props.handleOpenCreateBuy()} >Create Buy Offer</SecondaryButton>
      <SecondaryButton size="medium" onClick={() => props.handleOpenCreateSell()} >Create Sell Offer</SecondaryButton>
      <div className={styles.share_container}>
        <SvgIcon>
          <BookmarkRegular />
        </SvgIcon>
        <SvgIcon>
          <ShareAltSolid />
        </SvgIcon>
        <SvgIcon>
          <HeartRegular />
        </SvgIcon>
      </div>
    </div>
  );
};

export default DigitalButtons;
