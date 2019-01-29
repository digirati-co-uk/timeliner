import reducer, { DEFAULT_STATE } from '../markers';
import * as Actions from '../../actions/markers';

describe('reducers/markers', () => {
  const markerStubs = [
    { id: 'test-marker-1', time: 100, label: 'Test marker 1', summary: '' },
    { id: 'test-marker-2', time: 200, label: 'Test marker 2', summary: '' },
  ];

  test('it loads default state', () => {
    const state = [{ type: '@@redux/init' }].reduce(reducer, DEFAULT_STATE);
    expect(state).toEqual({
      list: {},
      selected: [],
      visible: true,
    });
  });

  test('it can enable and disable visibility', () => {
    const state1 = [Actions.hideMarkers()].reduce(reducer, DEFAULT_STATE);
    expect(state1).toEqual({
      list: {},
      selected: [],
      visible: false,
    });

    const state2 = [Actions.showMarkers()].reduce(reducer, state1);

    expect(state2).toEqual({
      list: {},
      selected: [],
      visible: true,
    });
  });

  test('it can import markers', () => {
    const state = [
      Actions.importMarkers([
        { id: 'test-marker-1', time: 100, label: 'Test marker 1', summary: '' },
        { id: 'test-marker-2', time: 200, label: 'Test marker 2', summary: '' },
        { NOT_ID: 'test-marker-3', time: 200, label: 'Test marker NOT VALID', summary: '' },
      ]),
    ].reduce(reducer, DEFAULT_STATE);

    expect(state).toEqual({
      list: {
        'test-marker-1': {
          id: 'test-marker-1',
          label: 'Test marker 1',
          summary: '',
          time: 100,
        },
        'test-marker-2': {
          id: 'test-marker-2',
          label: 'Test marker 2',
          summary: '',
          time: 200,
        },
      },
      selected: [],
      visible: true,
    });
  });

  test('it can select marker', () => {
    const state1 = [
      Actions.importMarkers(markerStubs),
      Actions.selectMarker('test-marker-1'),
    ].reduce(reducer, DEFAULT_STATE);

    const markers = {
      'test-marker-1': {
        id: 'test-marker-1',
        label: 'Test marker 1',
        summary: '',
        time: 100,
      },
      'test-marker-2': {
        id: 'test-marker-2',
        label: 'Test marker 2',
        summary: '',
        time: 200,
      },
    };

    expect(state1).toEqual({
      list: markers,
      selected: ['test-marker-1'],
      visible: true,
    });

    const state2 = [Actions.selectMarker('test-marker-2')].reduce(
      reducer,
      state1
    );

    expect(state2).toEqual({
      list: markers,
      selected: ['test-marker-1', 'test-marker-2'],
      visible: true,
    });

    const state3 = [Actions.deselectMarker('test-marker-1')].reduce(
      reducer,
      state2
    );

    expect(state3).toEqual({
      list: markers,
      selected: ['test-marker-2'],
      visible: true,
    });

    const state4 = [Actions.deselectMarker('NOT_EXIST')].reduce(
      reducer,
      state3
    );
    expect(state3).toEqual(state4);
  });

  test('updating marker information', () => {
    expect(
      [
        Actions.importMarkers(markerStubs),
        Actions.updateMarker(null, {}),
        Actions.updateMarker('test-marker-1', {}),
        Actions.updateMarker('test-marker-1', { time: 500 }),
        Actions.updateMarker('test-marker-2', {
          label: 'Test marker changed!',
          summary: 'Something summary',
        }),
      ].reduce(reducer, DEFAULT_STATE)
    ).toEqual({
      list: {
        'test-marker-1': {
          id: 'test-marker-1',
          label: 'Test marker 1',
          summary: '',
          time: 500,
        },
        'test-marker-2': {
          id: 'test-marker-2',
          label: 'Test marker changed!',
          summary: 'Something summary',
          time: 200,
        },
      },
      selected: [],
      visible: true,
    });
  });

  test('delete marker', () => {
    expect(
      [
        Actions.importMarkers(markerStubs),
        Actions.deleteMarker('test-marker-1'),
      ].reduce(reducer, DEFAULT_STATE)
    ).toEqual({
      list: {
        'test-marker-2': {
          id: 'test-marker-2',
          label: 'Test marker 2',
          summary: '',
          time: 200,
        },
      },
      selected: [],
      visible: true,
    });
  });
});
