import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddCircle from '@material-ui/icons/AddCircle';
import RestorePage from '@material-ui/icons/RestorePage';
import CloudDownload from '@material-ui/icons/CloudDownload';
import Settings from '@material-ui/icons/Settings';
import bem from '@fesk/bem-js';
import './VariationsAppBar.scss';

const $block = bem.block('variations-app-bar');

const VariationsAppBar = props => (
  <div className={$block} position="static">
    <Toolbar>
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginLeft: 10,
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
  </div>
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
