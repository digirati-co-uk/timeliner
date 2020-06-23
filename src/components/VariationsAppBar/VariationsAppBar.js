import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddCircle from '@material-ui/icons/AddCircle';
import Save from '@material-ui/icons/Save';
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';
import Settings from '@material-ui/icons/Settings';
import bem from '@fesk/bem-js';
import './VariationsAppBar.scss';

const $block = bem.block('variations-app-bar');

const VariationsAppBar = props => (
  <div
    className={props.noHeader ? $block + '-no-header' : $block}
    style={{ position: 'static' }}
  >
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
        {props.noHeader ? null : (
          <Typography
            variant="h6"
            color="inherit"
            style={{
              fontWeight: 'normal',
            }}
          >
            Timeliner
          </Typography>
        )}
      </div>
      <div>
        {props.onSave || props.hasResource ? null : (
          <IconButton
            color="inherit"
            onClick={props.onImportButtonClicked}
            title="Open audio file"
          >
            <AddCircle />
          </IconButton>
        )}
        {props.onSave ? (
          <IconButton
            color="inherit"
            onClick={props.onSave}
            title={props.onSave ? 'Save timeline' : 'No backend set up to save'}
          >
            <Save />
          </IconButton>
        ) : null}
        <IconButton
          color="inherit"
          onClick={props.onUndo}
          disabled={(props.canUndo || false) === false}
          title="Undo"
        >
          <Undo />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={props.onRedo}
          disabled={(props.canRedo || false) === false}
          title="Redo"
        >
          <Redo />
        </IconButton>
        {/* <IconButton
          color="inherit"
          onClick={props.onSettingsButtonClicked}
          title="Settings"
        >
          <Settings />
        </IconButton> */}
      </div>
    </Toolbar>
  </div>
);

VariationsAppBar.propTypes = {
  /** action opens the import popup */
  onImportButtonClicked: PropTypes.func.isRequired,
  onUndo: PropTypes.func.isRequired,
  onRedo: PropTypes.func.isRequired,
  canUndo: PropTypes.bool,
  canRedo: PropTypes.bool,
  /** Invokes the save action */
  onSave: PropTypes.func,
  /** Opens the project settings modal */
  onSettingsButtonClicked: PropTypes.func.isRequired,
  noHeader: PropTypes.bool,
};

export default VariationsAppBar;
