import React, { useEffect, useState } from 'react';

import styles from './DigitalArtInfo.module.scss';
import cls from 'classnames';
import ArtistCard from 'components/legacy/Media/components/Cards/ArtistCard';
import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers/Reducer';
import RenderInputWithTooltip from '../RenderInputWithTooltip/RenderInputWithTooltip';
import RadialChart from '../RadialChart/RadialChart';

import { formatNumber } from "shared/functions/commonFunctions";

const DigitalArtInfo = (props: any) => {
  const users = useSelector((state: RootState) => state.usersInfoList);
  const dummyData = [
    { name: "Creator Fraction", data: 50 },
    { name: "Fractions For Sale", data: 25 },
    { name: "Sold Fractions", data: 25 },
  ];

  // the data neede for this component
  const [media, setMedia] = useState<any>({
    Name: '',
    Description: 'No description (mock data)',
    CollectionName: 'About Collection Name (mock data)',
    CollectionDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in aliquam ex, et tristique massa. Fusce ultricies elementum orci, ut mattis tortor blandit eu. (mock data)',
    CollectionImgUrl: 'none',
    Views: 0,
    MainOwner: undefined,
    Collabs: [],
    Fraction: 0,
    InterestRate: 0,
    Price: 0,
    BuyBackPrice: 0,
    FundingToken: '',
    Royalty: 0,

  });


  // TODO: for now its only adapted to independent media strucutre, need also adapt to pod medias
  useEffect(() => {
    if (props.media) {
      console.log('--props.media--', props.media);
      const newMedia = { ...media };
      if (props.media.MediaName) newMedia.Name = props.media.MediaName;
      if (props.media.Description) newMedia.Description = props.media.Description;
      if (props.media.TotalViews) newMedia.TotalViews = props.media.TotalViews;
      if (props.media.CreatorId) {
        const foundUser = users.find((user) => user.id == props.media.CreatorId);
        if (foundUser) newMedia.MainOwner = foundUser;
      }
      // this might be called differently
      if (props.media.Collabs) {
        const newCollabs: any = [];
        props.media.Collabs.forEach((collabId) => {
          const foundUser = users.find((user) => user.id == collabId);
          newCollabs.push(foundUser);
        });
        newMedia.Collabs = newCollabs;
      }

      if (props.media.Fractionalise) {
        if (props.media.Fractionalise.Fraction) newMedia.Fraction = props.media.Fractionalise.Fraction;
        if (props.media.Fractionalise.InterestRate) newMedia.InterestRate = props.media.Fractionalise.InterestRate;
        if (props.media.Fractionalise.FundingToken) newMedia.FundingToken = props.media.Fractionalise.FundingToken;
        if (props.media.Fractionalise.InitialPrice) newMedia.Price = props.media.Fractionalise.InitialPrice;
        if (props.media.Fractionalise.BuyBackPrice) newMedia.BuyBackPrice = props.media.Fractionalise.BuyBackPrice;
      }
      if (props.media.NftConditions && props.media.NftConditions.Royalty) newMedia.Royalty = props.media.NftConditions.Royalty;

      setMedia(newMedia);
    }
  }, [props.media])

  return (
    <div className={styles.digital_container}>
      <div className={styles.digital_info_wrapper}>
        <h1>{media.Name}</h1>
        <p className={styles.description}>{media.Description} </p>
        <div className={styles.fractional_info}>
          <div className={styles.fractional_info_percent}>
            Fractionalised: {media.Fraction * 100}%
          </div>
          <div className={styles.fractional_info_views}>
            <img src={require('assets/icons/profile_view.png')} alt="" />
            {media.TotalViews || 1}
          </div>
        </div>
        <div className={styles.owner_rates_wrapper}>
          <div className={styles.owner_wrapper}>
            <h2>Main Owner</h2>
            {media.MainOwner ?
              <ArtistCard artist={media.MainOwner} key={media.MainOwner.id ?? '0'} /> : null
            }
          </div>
          <div className={styles.rates_wrapper}>
            <h2>Rates</h2>
            <div className={styles.rate_info}>
              <div className={styles.rate_data}>
                <RenderInputWithTooltip
                  name={"💰 Interest Rate"}
                  info={"Interest Rate"}
                  type={"text"}
                  width={-1}
                />
                <h3>{media.InterestRate * 100}%</h3>
              </div>
              <div className={styles.rate_data}>
                <RenderInputWithTooltip
                  name={"👑 Creator Royalty"}
                  info={"Creator Royalty"}
                  type={"text"}
                  width={-1}
                />
                <h3>{media.Royalty * 100}%</h3>
              </div>
            </div>
            <div className={cls(styles.rate_info, styles.padding_top)}>
              <div className={styles.rate_data}>
                <RenderInputWithTooltip
                  name={"Fraction Price"}
                  info={"Fraction Price"}
                  type={"text"}
                  width={-1}
                />
                <h3>{formatNumber(media.Price, media.FundingToken, 4)}</h3>
              </div>
              <div className={styles.rate_data}>
                <RenderInputWithTooltip
                  name={"Buy Back Price"}
                  info={"Buy Back Price"}
                  type={"text"}
                  width={-1}
                />
                <h3>{formatNumber(media.BuyBackPrice, media.FundingToken, 4)}</h3>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.creators_ownership_wrapper}>
          <div className={styles.creators_wrapper}>
            <h2>Creators</h2>
            <div className={styles.creators}>
              <span>{media.Collabs.length > 4 ? media.Collabs.length - 4 : 0}</span>
              {media.Collabs.forEach((collab) => {
                return (
                  <div
                    className={styles.user_image}
                    style={{
                      backgroundImage:
                        collab.imageURL && collab.imageURL !== ''
                          ? `url(${collab.imageURL})`
                          : 'none',
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    key={`user-0`}
                  />
                );
              })}
            </div>
            <a className={styles.btn_view_all}>
              {media.Collabs.length > 4 &&
                <>View All</>
              }
            </a>
          </div>
          <div className={styles.owner_distribution}>
            <h2>Ownership Distribution</h2>
            <div className={styles.owner_chart}>
              <RadialChart list={dummyData} />
              <div className={styles.owner_chart_description}>
                {dummyData.map((data, index) => (
                  <div className={styles.owner_chart_data} key={`data-${index}`}>
                    <div
                      className={styles.colorBox}
                      style={{
                        background: data.name.toUpperCase().includes("CREATOR")
                          ? "linear-gradient(180deg, #8987E7 0%, rgba(137, 135, 231, 0) 100%)"
                          : data.name.toUpperCase().includes("SALE")
                            ? "linear-gradient(180deg, #FFC71B 0%, rgba(255, 199, 27, 0) 100%)"
                            : "linear-gradient(180deg, #27E8D9 0%, rgba(39, 232, 217, 0) 100%)",
                      }}
                    />
                    {data.name}
                    <span>{`${data.data.toFixed(0)}%`}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.digital_collection_wrapper}>
        <div
          className={styles.collection_img}
          style={{
            backgroundImage: `url(${require('assets/backgrounds/audio.png')})`, // replace with media.CollectionImgUrl
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        <p>{media.CollectionName}</p>
        <div className={styles.collection_info}>
          <img src={require('assets/anonAvatars/ToyFaces_Colored_BG_003.jpg')} alt="" />
          <div>
            <span>{media.CollectionDescription} </span>
            <a className={styles.view_collection}>View Collection</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalArtInfo;
