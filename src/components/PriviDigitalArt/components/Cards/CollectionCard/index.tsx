import React from "react";
import cls from "classnames";

import { collectionCardStyles } from './index.styles';
import Box from 'shared/ui-kit/Box';

export default function CollectionCard({ item, heightFixed }) {
  const classes = collectionCardStyles();

  return (
    <div className={classes.card} onClick={() => {}}>
      {heightFixed ? (
        <div
          className={cls(classes.image, classes.fixed)}
          style={{
            backgroundImage:
              item.imageURL && item.imageURL !== ""
                ? `url(${require(`assets/collectionImages/${item.name}.png`)})`
                : "none",
          }}
        />
      ) : (
        <img src={require(`assets/collectionImages/${item.name}.png`)} alt={item.name} className={classes.image} />
      )}
      <div className={classes.info}>
        <div
          className={classes.avatar}
          style={{
            backgroundImage:
              item.imageURL && item.imageURL !== ""
                ? `url(${require(`assets/collectionImages/${item.name}.png`)})`
                : "none",
          }}
        />
        <Box display="flex" flexDirection="column">
          <div className={classes.black}>{item.name}</div>
          {item.description && <div className={classes.gray}>{item.description}</div>}
        </Box>
      </div>
    </div>
  );
}
