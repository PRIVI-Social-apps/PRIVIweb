import React from "react";
import classnames from "classnames";

import { StackedCarousel } from "shared/ui-kit/StackedCarousel/StackedCarousel";

import styles from "./Discover.module.css";

//Should be removed later
const MOCK_DATA = [
  {
    id: 1,
    image: 'https://is2-ssl.mzstatic.com/image/thumb/Music114/v4/a8/6a/fb/a86afb61-45b2-8665-31b4-e483d4f00f4b/886447854761.jpg/400x400cc.jpg',
  },
  {
    id: 2,
    image: 'https://is5-ssl.mzstatic.com/image/thumb/Music114/v4/7d/f5/a1/7df5a127-16e0-af72-197b-b8ac25793526/886443615229.jpg/400x400cc.jpg',
  },
  {
    id: 3,
    image: 'https://is5-ssl.mzstatic.com/image/thumb/Music128/v4/23/68/ca/2368ca17-73eb-5f50-2b4c-7751ee1e5ba9/00602498682616.rgb.jpg/400x400cc.jpg',
  },
  {
    id: 4,
    image: 'https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/31/be/64/31be64fb-b71c-9483-6bd9-96cebff8ce4c/093624940371.jpg/400x400cc.jpg',
  },
  {
    id: 5,
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music/v4/03/da/3a/03da3a2d-4911-bece-8a66-1e47379c4d91/00094636694757.jpg/400x400cc.jpg'
  },
  {
    id: 6,
    image: 'https://is2-ssl.mzstatic.com/image/thumb/Music114/v4/a8/6a/fb/a86afb61-45b2-8665-31b4-e483d4f00f4b/886447854761.jpg/400x400cc.jpg',
  },
  {
    id: 7,
    image: 'https://is5-ssl.mzstatic.com/image/thumb/Music114/v4/7d/f5/a1/7df5a127-16e0-af72-197b-b8ac25793526/886443615229.jpg/400x400cc.jpg',
  },
  {
    id: 8,
    image: 'https://is5-ssl.mzstatic.com/image/thumb/Music128/v4/23/68/ca/2368ca17-73eb-5f50-2b4c-7751ee1e5ba9/00602498682616.rgb.jpg/400x400cc.jpg',
  },
  {
    id: 9,
    image: 'https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/31/be/64/31be64fb-b71c-9483-6bd9-96cebff8ce4c/093624940371.jpg/400x400cc.jpg',
  },
  {
    id: 10,
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Music/v4/03/da/3a/03da3a2d-4911-bece-8a66-1e47379c4d91/00094636694757.jpg/400x400cc.jpg'
  }
]

const DISCOVER_CATEGORY = {
  claimable: 'Claimable',
  music: 'Music',
  video: 'Video',
  digitalArt: 'Digtal Art'
};

export default function DiscoverSection() {
  return (
    <div className={styles.container}>
      {Object.keys(DISCOVER_CATEGORY).map(key => (
        <div
          key={key}
          className={
            classnames(styles.categoryContiner, styles[key])
          }
        >
          <div className={styles.title}>{DISCOVER_CATEGORY[key]}</div>
          <div className={styles.content}>
            <StackedCarousel items={MOCK_DATA} type={key} />
          </div>
        </div>
      ))}
    </div>
  );
}


