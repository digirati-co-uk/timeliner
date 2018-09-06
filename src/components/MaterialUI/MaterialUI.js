import React from 'react';
import PropTypes from 'prop-types';
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {
  FormControl,
  Input,
  TextField,
  Button,
  IconButton,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import {
  AddCircle,
  Delete,
  CloudDownload,
  Settings,
  Info,
  SkipNext,
  SkipPrevious,
  PlayCircleFilled,
  FastForward,
  FastRewind,
} from '@material-ui/icons';
import Slider from '@material-ui/lab/Slider';

const styles = {
  toolbarLeft: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  transportBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentTime: {
    width: 200,
  },
  volumeSlider: {
    width: 200,
  },
  playbackControls: {
    width: 300,
  },
  buttonBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
};

const theme = createMuiTheme({
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

const MaterialUI = props => {
  const { classes } = props;
  return (
    <div
      style={{
        width: '100%',
        flexGrow: 1,
        height: 400,
      }}
    >
      <MuiThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
            <div className={classes.toolbarLeft}>
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
        <div
          style={{
            height: 150,
            backgorund: 'grey',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Bubbles
        </div>
        <Toolbar backgroundColor="secondary" className={classes.transportBar}>
          <div className={classes.currentTime}>
            <Typography>03:12 / 4:50</Typography>
          </div>
          <div className={classes.playbackControls}>
            <IconButton color="inherit">
              <SkipPrevious />
            </IconButton>
            <IconButton color="inherit">
              <FastRewind />
            </IconButton>
            <IconButton color="inherit">
              <PlayCircleFilled />
            </IconButton>
            <IconButton color="inherit">
              <FastForward />
            </IconButton>
            <IconButton color="inherit">
              <SkipNext />
            </IconButton>
          </div>
          <div className={classes.volumeSlider}>
            <Slider />
          </div>
        </Toolbar>
        <form>
          <TextField
            id="label"
            label="Label"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Placeholder"
            fullWidth
            margin="normal"
          />
          <TextField
            id="summary"
            label="Description"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Placeholder"
            fullWidth
            multiline={true}
            margin="normal"
          />
          <div className={classes.buttonBar}>
            <Button disabled>
              <Delete /> Delete
            </Button>
            <Button variant="contained" color="primary">
              Save
            </Button>
          </div>
        </form>
      </MuiThemeProvider>
    </div>
  );
};

export default withStyles(styles)(MaterialUI);
