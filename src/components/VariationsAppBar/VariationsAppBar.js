import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddCircle from '@material-ui/icons/AddCircle';
import Save from '@material-ui/icons/Save';
import Check from '@material-ui/icons/Check';
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';
import Close from '@material-ui/icons/Close';
import Settings from '@material-ui/icons/Settings';
import bem from '@fesk/bem-js';
import './VariationsAppBar.scss';
import posed, { PoseGroup } from 'react-pose';

const $block = bem.block('variations-app-bar');

const Anim = posed.span({
  enter: { y: 0 },
  exit: {
    y: -40,
  },
});

function SaveButton() {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(
    () => {
      if (isSaved) {
        setTimeout(() => {
          setIsSaved(false);
        }, 2000);
      }
    },
    [isSaved]
  );

  return (
    <PoseGroup>
      {isSaved ? (
        <Anim key="check">
          <Check style={{ color: 'limegreen' }} />
        </Anim>
      ) : (
        <Anim key="save">
          <Save onClick={() => setIsSaved(true)} />
        </Anim>
      )}
    </PoseGroup>
  );
}

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
          Timeliner
        </Typography>
      </div>
      <div>
        {props.onSave ? null : (
          <IconButton
            color="inherit"
            onClick={props.onImportButtonClicked}
            title="New project"
          >
            <AddCircle />
          </IconButton>
        )}
        {props.onSave ? (
          <IconButton
            color="inherit"
            onClick={props.onSave}
            disabled={!props.canUndo}
            title={props.onSave ? 'Save project' : 'No backend set up to save'}
          >
            <SaveButton />
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
        <IconButton
          color="inherit"
          onClick={props.onSettingsButtonClicked}
          title="Settings"
        >
          <Settings />
        </IconButton>
        {props.onSave ? (
          <IconButton
            color="inherit"
            onClick={() => {
              window.close();
            }}
            title="Close"
          >
            <Close />
          </IconButton>
        ) : null}
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
};

export default VariationsAppBar;
