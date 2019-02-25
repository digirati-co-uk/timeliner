import React from 'react';
import { actions as undoActions } from 'redux-undo-redo';
import { connect } from 'react-redux';

const UndoButtons = ({ canUndo, canRedo, onUndo, onRedo }) => (
  <p>
    <button onClick={onUndo} disabled={!canUndo}>
      Undo
    </button>
    <button onClick={onRedo} disabled={!canRedo}>
      Redo
    </button>
  </p>
);

const mapStateToProps = state => ({
  canUndo: state.undoHistory.undoQueue.length > 0,
  canRedo: state.undoHistory.redoQueue.length > 0,
});

const mapDispatchToProps = {
  onUndo: undoActions.undo,
  onRedo: undoActions.redo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UndoButtons);
