import React from 'react';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import './SearchSidebar.css';

export default function SearchSidebar(props) {
  return (
    <div className="search-sidebar">
      <InputWithLabelAndTooltip placeHolder="Search" />
      <p>Previous searches</p>
      <div className="searches">
        {/*leaving this as a UI example*/}
        <div className="row">
          <span>KTO</span>
          <span>21 new</span>
        </div>
        <div className="row">
          <span>Andrew Mcmillan</span>
          <span>13 new</span>
        </div>
      </div>
    </div>
  );
}
