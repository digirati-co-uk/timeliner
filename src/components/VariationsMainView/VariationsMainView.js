import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

import VariationsAppBar from '../VariationsAppBar/VariationsAppBar';
import BubbleDisplay from '../BubbleDisplay/BubbleDisplay';
import SingleBubble from '../SingleBubble/SingleBubble';
import AudioTransportBar from '../AudioTransportBar/AudioTransportBar';
import ZoomControls from '../ZoomControls/ZoomControls';
import TimelineMetadata from '../TimeMetadata/TimeMetadata';

export default class VariationsMainView extends React.Component {
  constructor(props) {
    super(props);
    this.theme = createMuiTheme({
      palette: {
        primary: blue,
        secondary: {
          main: '#ff5252',
        },
      },
      status: {
        danger: 'orange',
      },
    });
  }
  render() {
    const _points = this.props.points;
    const {
      isPlaying,
      volume,
      onVolumeChanged,
      currentTime,
      runTime,
      manifestLabel,
      manifestSummary,
    } = this.props;
    return (
      <div>
        <MuiThemeProvider theme={this.theme}>
          <VariationsAppBar />
          <div
            style={{
              position: 'relative',
            }}
          >
            <BubbleDisplay
              points={_points.reduce((acc, el) => {
                acc[el.id] = el;
                return acc;
              }, {})}
              width={764}
              height={300}
              x={0}
              zoom={1}
            >
              {points =>
                points.map(bubble => (
                  <SingleBubble
                    {...bubble}
                    onClick={(point, ev) => {
                      alert(JSON.stringify(point));
                    }}
                  />
                ))
              }
            </BubbleDisplay>
            <ZoomControls />
          </div>
          <AudioTransportBar
            isPlaying={isPlaying}
            volume={volume}
            onVolumeChanged={onVolumeChanged}
            currentTime={currentTime}
            runTime={runTime}
          />
          <div
            style={{
              padding: 8,
            }}
          >
            <TimelineMetadata
              ranges={_points}
              currentTime={currentTime}
              runtime={runTime}
              manifestLabel={manifestLabel}
              manifestSummary={manifestSummary}
            />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
