import React, { useEffect, useState } from "react";
import "./ArticlePage.css";
import { Articles } from "../articlesData";
import {
  communitiesTutorials,
  creditPoolsTutorials,
  podsTutorials,
} from "shared/ui-kit/Page-components/Tutorials/Tutorials";
import SearchButton from "shared/ui-kit/Buttons/SearchButton";
import SettingsButton from "shared/ui-kit/Buttons/SettingsButton";
import BackButton from "shared/ui-kit/Buttons/BackButton";
import { useTypedSelector } from "store/reducers/Reducer";
import { getStyledTime } from "shared/functions/getStyledTime";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as WallPaperSolid } from "assets/icons/newspaper-regular.svg";

// import { Editor, EditorState, convertFromRaw } from "draft-js";

export default function ArticlePage() {
  //store
  const users = useTypedSelector(state => state.usersInfoList);

  //hooks
  const [article, setArticle] = useState<any>("");
  const [tutorial, setTutorial] = useState<any>("");
  const [creatorInfo, setCreatorInfo] = useState<any>({
    name: "",
    imageURL: "",
  });

  useEffect(() => {
    const pathName = window.location.href; // If routing changes, change to pathname
    const idUrl = pathName.split("/")[6];

    Articles.forEach(a => {
      if (a.Id === idUrl) {
        setArticle(a);
        return;
      }
    });

    if (communitiesTutorials.Id === idUrl) {
      setTutorial(communitiesTutorials);
    } else if (podsTutorials.Id === idUrl) {
      setTutorial(podsTutorials);
    } else if (creditPoolsTutorials.Id === idUrl) {
      setTutorial(creditPoolsTutorials);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //load article creator
    if (article && article.Creator) {
      if (users.some(u => u.id === article.Creator)) {
        const thisUser = users[users.findIndex(u => u.id === article.Creator)];
        setCreatorInfo({ name: thisUser.name, imageURL: thisUser.imageURL });
        return;
      }
    } else {
      let creator = {
        name: "PRIVI",
        imageURL: `${require(`assets/tokenImages/PRIVI.png`)}`,
      };
      setCreatorInfo(creator);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, article]);

  return (
    <div className="article-page">
      <div className={`header`}>
        <BackButton />
        <h2>
          {article.Title
            ? article.Title
            : tutorial.Tutorials && tutorial.Tutorials[0] && tutorial.Tutorials[0].Title
              ? tutorial.Tutorials[0].Title
              : ""}
        </h2>
        <div className="buttons">
          <SearchButton />
          <SettingsButton />
        </div>
      </div>
      <div className="content-wrapper">
        <div className="content">
          <div className="article-info">
            <div className="user">
              <div
                className="user-image"
                style={{
                  backgroundImage:
                    creatorInfo.imageURL && creatorInfo.imageURL.length > 0
                      ? `url(${creatorInfo.imageURL})`
                      : "none",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <p>{creatorInfo.name ? creatorInfo.name : ""}</p>
            </div>
            <div className="right">
              <span>
                {`${getStyledTime(
                  article.Date || tutorial.Date || new Date().getTime(),
                  new Date().getTime(),
                  false
                )} ago`}
              </span>
              <p>
                {tutorial.Creator === "PRIVI" ? <img
                  src={require("assets/icons/user-graduate-solid.svg")}
                  alt={"user-graduate-solid"}
                /> : <SvgIcon><WallPaperSolid /></SvgIcon>}
                {tutorial.Creator === "PRIVI" ? "Tutorial" : "News"}
              </p>
            </div>
          </div>

          {article.ImageURL && article.descriptionArray ? (
            <div className="body-container">
              {article.TextShort ? <p className="text-short">{article.TextShort}</p> : null}
              <img className="article-image" src={article.ImageURL} alt={article.Id} />
              {/* <Editor
                editorState={EditorState.createWithContent(convertFromRaw(article.descriptionArray))}
                readOnly={true}
              /> */}
            </div>
          ) : null}
          {tutorial.Tutorials
            ? tutorial.Tutorials.map((tutorial, index) => {
              return (
                <div className="tutorial-row" key={`row-${index}`}>
                  {index > 0 ? (
                    <div
                      className="image"
                      style={{
                        backgroundImage:
                          tutorial.Image && tutorial.Image.length > 0
                            ? `url(${require(`assets/tutorialImages/${tutorial.Image}.png`)})`
                            : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ) : null}
                  <div className="tutorial-content">
                    {index > 0 ? <h4>{tutorial.Title}</h4> : null}
                    <p>
                      {tutorial.Body.includes("To learn more, click next.")
                        ? tutorial.Body.replace("To learn more, click next.", "")
                        : tutorial.Body}
                    </p>
                  </div>
                </div>
              );
            })
            : null}
        </div>
      </div>
    </div>
  );
}
