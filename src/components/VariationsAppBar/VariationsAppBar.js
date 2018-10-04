import React from 'react';
import PropTypes from 'prop-types';

import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import {
  AddCircle,
  RestorePage,
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
        <Typography
          variant="title"
          color="inherit"
          style={{
            fontWeight: 'normal',
          }}
        >
          Timeliner&nbsp;
        </Typography>
      </div>
      <div>
        <IconButton
          color="inherit"
          onClick={props.onImportButtonClicked}
          title="New project"
        >
          <AddCircle />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={props.onEraseButtonClicked}
          title="Clear annotation"
        >
          <RestorePage />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={props.onSaveButtonClicked}
          title="Download project"
        >
          <CloudDownload />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={props.onSettingsButtonClicked}
          title="Settings"
        >
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
