import React, { useState } from "react";
import Pagination from "@material-ui/lab/Pagination";
import "./Post-Preview.css";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as ExpandSolid } from "assets/icons/expand-arrows-alt-solid.svg";

const PreviewPost = (props: any) => {
  const [page, setPage] = useState<number>(1);
  const handleChange = (event, value: number) => {
    setPage(value);
  };

  return Array.isArray(props.content) ? (
    <div className="postPreviewContainer">
      <div className="content" dangerouslySetInnerHTML={{ __html: props.content[page - 1] }}></div>
      <Pagination count={props.content.length} page={page} onChange={handleChange} />
      <div className="flexCenterFullScreenIcon">
        <button className="connect">
          {" "}
          Full screen
          <div style={{ cursor: "pointer" }} onClick={() => props.setView(1)}>
            <SvgIcon>
              <ExpandSolid />
            </SvgIcon>
          </div>
        </button>
      </div>
    </div>
  ) : (
    <div className="content" dangerouslySetInnerHTML={{ __html: props.content }}>
      {" "}
      not pageable
    </div>
  );
};

export default PreviewPost;
