import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

import BubbleDisplay from '../BubbleDisplay/BubbleDisplay';
import SingleBubble from '../SingleBubble/SingleBubble';
import AudioTransportBar from '../AudioTransportBar/AudioTransportBar';
import ZoomControls from '../ZoomControls/ZoomControls';
import TimelineMetadata from '../TimeMetadata/TimeMetadata';

import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  IconButton,
} from '@material-ui/core';
import {
  Info,
  AddCircle,
  Delete,
  CloudDownload,
  Settings,
} from '@material-ui/icons';

const TempAppBar = props => (
  <AppBar position="static">
    <Toolbar>
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Typography variant="title" color="inherit">
          Variations&nbsp;
        </Typography>
        <TextField id="name-simple" value={'title'} color="primary" />
        <IconButton color="inherit">
          <Info />
        </IconButton>
      </div>
      <div>
        <IconButton color="inherit">
          <AddCircle />
        </IconButton>
        <IconButton color="inherit">
          <Delete />
        </IconButton>
        <IconButton color="inherit">
          <CloudDownload />
        </IconButton>
        <IconButton color="inherit">
          <Settings />
        </IconButton>
      </div>
    </Toolbar>
  </AppBar>
);

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
          <TempAppBar />
          <div>
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
          />
          <TimelineMetadata
            ranges={_points}
            currentTime={currentTime}
            runtime={runTime}
            manifestLabel={manifestLabel}
            manifestSummary={manifestSummary}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}
