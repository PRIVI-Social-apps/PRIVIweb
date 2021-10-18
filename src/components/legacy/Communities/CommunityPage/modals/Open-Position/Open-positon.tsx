import React from 'react';
import './Open-position.css';
import '../Communities-modals.css';
import Grid from '@material-ui/core/Grid';

const OpenPosition = (props: any) => {
  return (
    <div className="modalOpenPosition modal-content">
      <div className="firstPartOpenPosition">
        <div className="exit" onClick={props.onCloseModal}>
          <img
            src={require('assets/icons/x_darkblue.png')}
            alt={'x'}
          />
        </div>
        <div className="headerOpenPosition">Community {props.position}</div>
        <div className="flexRowInputsCommunitiesModal">
          <div className="infoColOpenPosition">
            <div className="titleOpenPosition">Compensation</div>
            <div className="valueOpenPosition">12 KTO/week</div>
          </div>
          <div className="infoColOpenPosition">
            <div className="titleOpenPosition">Time left to apply</div>
            <div className="valueOpenPosition">12 days</div>
          </div>
        </div>
        <Grid
          container
          className="gridAuthorDescOpenPosition"
          spacing={2}
          direction="row"
          alignItems="flex-start"
          justify="flex-start"
        >
          <Grid item xs={12} md={4}>
            <div className="titleOpenPosition">Admins</div>
            <div
              className="flexRowInputsCommunitiesModal"
              style={{
                alignItems: 'center',
                marginTop: '7px',
              }}
            >
              <div className="authorPhotoOpenPosition"></div>
              <div className="authorNameOpenPosition">Nora Wilkinson</div>
            </div>
            <div
              className="flexRowInputsCommunitiesModal"
              style={{
                alignItems: 'center',
                marginTop: '7px',
              }}
            >
              <div className="authorPhotoOpenPosition"></div>
              <div className="authorNameOpenPosition">Nora Wilkinson</div>
            </div>
          </Grid>
          <Grid item xs={12} md={8}>
            <div className="titleOpenPosition">Description</div>
            <div
              className="valueOpenPosition"
              style={{
                marginTop: '10px',
              }}
            >
              So while in the current state none of the projects can join the
              Bancor protocol due to the risk factors associated with them, it’s
              certainly volume that would be nice to capture if we can fit into
              a workable model.
            </div>
          </Grid>
        </Grid>

        <div className="requirementsOpenPosition">
          <div className="requirementsHeaderOpenPosition">Requirements</div>
          <div className="flexRowInputsCommunitiesModal">
            <div className="infoColOpenPosition">
              <div className="titleOpenPosition">Min level</div>
              <div className="valueOpenPosition">4</div>
            </div>
            <div className="infoColOpenPosition">
              <div className="titleOpenPosition">Cred</div>
              <div className="valueOpenPosition">50+</div>
            </div>
            <div className="infoColOpenPosition">
              <div className="titleOpenPosition">Badges achieved</div>
              <div className="valueOpenPosition">Top 5%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="applicationsPartOpenPosition">
        <div className="applicationsHeaderOpenPosition">Applications (3)</div>
        <div className="whiteRowOpenPosition">
          <div
            className="flexStartCenterRowInputsCommunitiesModal"
            style={{
              width: '30%',
            }}
          >
            <div className="authorPhotoOpenPosition"></div>
            <div className="authorNameOpenPosition">Nora Wilkinson</div>
          </div>
          <div
            className="authorNameOpenPosition"
            style={{
              width: '20%',
            }}
          >
            Lvl 4
          </div>
          <div
            className="authorNameOpenPosition"
            style={{
              width: '20%',
            }}
          >
            Cred 78
          </div>
          <div
            className="authorNameOpenPosition"
            style={{
              width: '30%',
            }}
          >
            Badges top 3%
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenPosition;
