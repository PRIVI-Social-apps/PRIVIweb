import React, { useEffect, useState } from "react";
import Pagination from '@material-ui/lab/Pagination';
import "./Post-Full-Screen.css";
import Carousel from "react-elastic-carousel";

const PostFullScreen = (props:any)  => {

  const [page, setPage] = useState<number>(1);
  const handleChange = (event, value: number) => {
    setPage(value);
  }

  const renderByPageContent = () => {
    if (props.content) {
      return <div className="content" dangerouslySetInnerHTML={{__html: props.content}}> not pageable</div>
    }

    return <div className="content"> not pageable</div>
  }

  return (
    <React.Fragment>
      {Array.isArray(props.content) ? (
        <div className="postFullScreenPreviewContainer">
         <div className="slider">

          <div className="slides">
          <Carousel isRTL={false} itemsToShow={3}>
          <div className="content"></div>
            {props.content.map( (item, index) =>
             <div className="content" dangerouslySetInnerHTML={{__html: item}}></div>
            )}
          <div className="content"></div>
          </Carousel>




          </div>
        </div>
        </div>
      ): (
        renderByPageContent()
      )
      }
       <button className="buttonCreateCommunitiesModal backtoEditorModal" onClick={props.onBackButtonClick}>
        Back to Editor
        </button>
    </React.Fragment>
  )

}

export default PostFullScreen;
