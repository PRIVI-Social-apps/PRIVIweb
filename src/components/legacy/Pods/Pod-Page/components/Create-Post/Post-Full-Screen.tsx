import React from "react";
import "./Post-Full-Screen.css";
import Carousel from "react-elastic-carousel";
import styled from "styled-components";
import { SnapPage } from "components/legacy/Media/components/Displays/BlogSnapDisplay";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as ExpandSolid } from "assets/icons/expand-arrows-alt-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const FullCenter = styled.div`
  width: 100%;
  heigh: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
class PostFullScreen extends React.Component<{ content; onBackButtonClick; isBlogSnap?}> {
  public carousel;
  constructor(props) {
    super(props);
    this.goto = this.goto.bind(this);
    this.carousel = React.createRef();
  }

  goto(val) {
    this.carousel.goTo(val - 1);
  }
  state = {
    page: 1,
  };

  public handleChange = (event, value: number) => {
    this.setState({ page: value });
  };

  public onChangeHandler = event => {
    const val = event.target.value;
    this.goto(val);
  };

  render() {
    return (
      <React.Fragment>
        <div className="flexCenterPreviewScreenIcon">
          <div style={{ cursor: "pointer" }} onClick={this.props.onBackButtonClick} >
            <SvgIcon><ExpandSolid /></SvgIcon>
          </div>
        </div>
        <div className="postFullScreenPreviewContainer">
          {Array.isArray(this.props.content) ? (
            <>
              <div className="slider">
                <div className="slides">
                  <Carousel
                    isRTL={false}
                    itemsToShow={1}
                    pagination={false}
                    ref={ref => {
                      this.carousel = ref;
                    }}
                    onChange={(currentItem, pageIndex) => {
                      this.state.page !== pageIndex + 1 && this.setState({ page: pageIndex + 1 });
                    }}
                  >
                    {this.props.content.map((item, index) =>
                      this.props.isBlogSnap ? (
                        <div key={index + 1} className="content">
                          <SnapPage page={index + 1} isVipAccess={false} />
                        </div>
                      ) : (
                        <div key={index + 1} className="content" dangerouslySetInnerHTML={{ __html: item }}></div>
                      )
                    )}
                  </Carousel>
                </div>
              </div>
              <div className="slider-pagination">
                <InputWithLabelAndTooltip
                  type="number"
                  overriedClasses="slider-pagination-input"
                  maxValue={this.props.content.length}
                  minValue={"1"}
                  inputValue={`${this.state.page}`}
                  onInputValueChange={this.onChangeHandler}
                />{" "}
                / {this.props.content.length > 0 ? this.props.content.length : 0}
              </div>
            </>
          ) : (
            <FullCenter>
              <div className="content" dangerouslySetInnerHTML={{ __html: this.props.content }} />
            </FullCenter>
          )}
        </div>
        <a className="exit-full-screen backtoEditorModal" onClick={this.props.onBackButtonClick}>
          Exit Full Screen Mode
          <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15.4824 1L1.48242 15M1.48244 1L15.4824 15"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
      </React.Fragment>
    );
  }
}

export default PostFullScreen;
