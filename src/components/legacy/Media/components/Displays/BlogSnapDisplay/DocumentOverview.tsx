import cn from "classnames";
import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { Panel } from "shared/ui-kit";
import styles from "./index.module.scss";
import MainPageContext from "components/legacy/Media/context";
import * as htmlToImage from "html-to-image";
import { isPayPerPage } from ".";

const arrow = require("assets/icons/arrow.png");
type DocumentOverviewProps = {
  setMainPage: (pageNumber: number) => void;
  currentPage: number;
};

const DocumentOverview: React.FunctionComponent<DocumentOverviewProps> = ({ setMainPage, currentPage }) => {
  const { selectedMedia } = useContext(MainPageContext);
  const [backgroundImages, setBackgroundImages] = useState<Array<string>>([]);
  const [EditorPages, setEditorPages] = useState<Array<any>>([]);
  const [totalPages, setToalPages] = useState<number>(0);

  const disablePagination = isPayPerPage(selectedMedia) ? false : !selectedMedia.paid;
  useEffect(() => {
    if (selectedMedia.EditorPages) setEditorPages([...selectedMedia.EditorPages]);
  }, [selectedMedia]);

  useEffect(() => {
    const len = EditorPages.length;
    setToalPages(len);
    setBackgroundImages([...new Array<string>(len + 1).fill("")]);
  }, [EditorPages]);

  const showStartPage =
    totalPages <= 6 ? 1 : currentPage <= 4 ? 1 : currentPage > totalPages - 2 ? totalPages - 5 : currentPage - 3;

  const setDocumentOverviewPage = () => {
    let setCount = totalPages - showStartPage + 1 > 6 ? 6 : totalPages - showStartPage + 1;
    for (let i = 0; i < 6 && i + showStartPage <= totalPages; ++i) {
      const curPage = i + showStartPage;
      if (backgroundImages[curPage] !== "") {
        if (--setCount === 0) {
          setBackgroundImages(backgroundImages);
        }
        continue;
      }
      const backgroundNode = document.getElementById("blogsnap-background-" + (showStartPage + i));
      if (backgroundNode) {
        htmlToImage
          .toPng(backgroundNode)
          .then(dataUrl => {
            backgroundImages[curPage] = dataUrl;
            if (--setCount === 0) {
              setBackgroundImages([...backgroundImages]);
            }
          })
          .catch(function (error) {
            console.error("oops, something went wrong!", error);
          });
      } else {
        --setCount;
      }
    }
  };

  useEffect(() => {
    setDocumentOverviewPage();
  }, [showStartPage, backgroundImages]);

  return (
    <>
      <Header>📖 Document Overview</Header>
      <Panel shadow={0} borderRadius="large" style={{ border: "none", padding: 0 }}>
        <Pages>
          {[0, 1, 2, 3, 4, 5].map(
            (item, index) =>
              showStartPage + index <= totalPages && (
                <>
                  <div
                    id={"blogsnap-page-" + (showStartPage + index)}
                    style={{ backgroundImage: `url(${backgroundImages[showStartPage + index]}` }}
                    className={
                      showStartPage + index === currentPage
                        ? cn(styles.documentPage, styles.documentCurrentPage)
                        : styles.documentPage
                    }
                    onClick={() => setMainPage(showStartPage + index)}
                  />

                  <div style={{ width: "0px", height: "0px", overflow: "hidden" }}>
                    <div
                      style={{ width: "450px", height: "560px" }}
                      id={"blogsnap-background-" + (showStartPage + index)}
                      dangerouslySetInnerHTML={{
                        __html:
                          showStartPage + index <= totalPages ? EditorPages[showStartPage + index - 1] : "<p></p>",
                      }}
                    />
                  </div>
                </>
              )
          )}
        </Pages>
        <div className={styles.paginationButtons2}>
          <button
            className={styles.prevButton}
            onClick={e => {
              setMainPage(currentPage - 1);
            }}
            disabled={!disablePagination && currentPage - 1 > 0 ? false : true}
          >
            <img src={arrow} />
          </button>
          <div>
            {currentPage}/{totalPages}
          </div>
          <button
            className={styles.nextButton}
            onClick={e => {
              setMainPage(currentPage + 1);
            }}
            disabled={disablePagination || currentPage >= totalPages ? true : false}
          >
            <img src={arrow} />
          </button>
        </div>
      </Panel>
    </>
  );
};

const Header = styled.div`
  margin: 14px 0px;
  font-family: Agrandir;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 120%;
  color: #707582;
`;

const Pages = styled.div`
  display: flex;
  margin: 2%;
  justify-content: center;
`;

export default DocumentOverview;
