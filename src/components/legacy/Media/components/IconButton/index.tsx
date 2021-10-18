import React, { FC } from "react";
import cls from "classnames";
import Button, { IconButtonProps } from "@material-ui/core/IconButton";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core/SvgIcon";

import styles from "./index.module.scss";

interface IIconButton extends Partial<IconButtonProps> {
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> | string;
  rounded?: boolean;
  variant?: string;
  title?: string;
  selected?: boolean;
}

const IconButton: FC<IIconButton> = ({
  Icon,
  variant = "",
  rounded = false,
  title,
  selected = false,
  ...otherProps
}) => {
  const classes = cls(styles.iconButton, variant, {
    [styles.rounded]: rounded,
    [styles.withTitle]: title,
  });

  return (
    <Button
      className={classes}
      {...otherProps}
      style={{
        backgroundColor: selected ? "#64c99f4d" : "transparent",
      }}
    >
      {typeof Icon === "string" ? (
        <img src={Icon} alt="icon" height="30" />
      ) : (
        <Icon />
      )}
      {title && <div className={styles.title}>{title}</div>}
    </Button>
  );
};

export default IconButton;
