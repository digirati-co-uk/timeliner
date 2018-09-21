import React from 'react';
import PropTypes from 'prop-types';

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

const VariationsAppBar = props => (
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
      </div>
      <div>
        <IconButton color="inherit" onClick={props.onImportButtonClicked}>
          <AddCircle />
        </IconButton>
        <IconButton color="inherit" onClick={props.onEraseButtonClicked}>
          <Delete />
        </IconButton>
        <IconButton color="inherit" onClick={props.onSaveButtonClicked}>
          <CloudDownload />
        </IconButton>
        <IconButton color="inherit" onClick={props.onSettingsButtonClicked}>
          <Settings />
        </IconButton>
      </div>
    </Toolbar>
  </AppBar>
);

VariationsAppBar.propTypes = {
  /** action opens the import popup */
  onImportButtonClicked: PropTypes.func.isRequired,
  /** action erases all previously entered information in the project */
  onEraseButtonClicked: PropTypes.func.isRequired,
  /** Invokes the save action */
  onSaveButtonClicked: PropTypes.func.isRequired,
  /** Opens the project settings modal */
  onSettingsButtonClicked: PropTypes.func.isRequired,
};

export default VariationsAppBar;
