import * as viewState from '../viewState';

describe('actions/viewState', () => {
  test('play', () => {
    expect(viewState.play()).toEqual({ type: 'PLAY_AUDIO' });
  });

  test('pause', () => {
    expect(viewState.pause()).toEqual({ type: 'STOP_AUDIO' });
  });

  test('zoomIn', () => {
    expect(viewState.zoomIn()).toEqual({ type: 'ZOOM_IN' });
  });

  test('zoomOut', () => {
    expect(viewState.zoomOut()).toEqual({ type: 'ZOOM_OUT' });
  });

  test('resetZoom', () => {
    expect(viewState.resetZoom()).toEqual({ type: 'RESET_ZOOM' });
  });

  test('panToPosition', () => {
    expect(viewState.panToPosition(100)).toEqual({
      payload: { x: 100 },
      type: 'PAN_TO_POSITION',
    });
  });

  test('showImportModal', () => {
    expect(viewState.showImportModal()).toEqual({ type: 'SHOW_IMPORT_MODAL' });
  });

  test('dismissImportModal', () => {
    expect(viewState.dismissImportModal()).toEqual({
      type: 'DISMISS_IMPORT_MODAL',
    });
  });

  test('showSettingsModal', () => {
    expect(viewState.showSettingsModal()).toEqual({
      type: 'SHOW_SETTINGS_MODAL',
    });
  });

  test('dismissSettingsModal', () => {
    expect(viewState.dismissSettingsModal()).toEqual({
      type: 'DISMISS_SETTINGS_MODAL',
    });
  });

  test('nextBubble', () => {
    expect(viewState.nextBubble()).toEqual({ type: 'NEXT_BUBBLE' });
  });

  test('previousBubble', () => {
    expect(viewState.previousBubble()).toEqual({ type: 'PREVIOUS_BUBBLE' });
  });

  test('fastForward', () => {
    expect(viewState.fastForward()).toEqual({ type: 'FAST_FORWARD' });
  });

  test('fastReward', () => {
    expect(viewState.fastReward()).toEqual({ type: 'FAST_REWARD' });
  });

  test('setVolume', () => {
    expect(viewState.setVolume(0)).toEqual({
      payload: { volume: 0 },
      type: 'SET_VOLUME',
    });
    expect(viewState.setVolume(50)).toEqual({
      payload: { volume: 50 },
      type: 'SET_VOLUME',
    });
    expect(viewState.setVolume(100)).toEqual({
      payload: { volume: 100 },
      type: 'SET_VOLUME',
    });
  });

  test('setVolume - error', () => {
    expect(() => viewState.setVolume(-1)).toThrowError();
    expect(() => viewState.setVolume(1000)).toThrowError();
  });

  test('setCurrentTime', () => {
    expect(viewState.setCurrentTime(1000)).toEqual({
      payload: { currentTime: 1000 },
      type: 'SET_CURRENT_TIME',
    });
  });

  test('loadViewState', () => {
    expect(viewState.loadViewState({ some: 'state' })).toEqual({
      state: { some: 'state' },
      type: 'LOAD_VIEW_STATE',
    });
  });
});
