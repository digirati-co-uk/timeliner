import * as range from '../range';

describe('actions/range', () => {
  test('splitRangeAt', () => {
    expect(range.splitRangeAt(1000)).toEqual({
      payload: { time: 1000 },
      type: 'SPLIT_RANGE_AT',
    });
  });

  test('groupSelectedRanges', () => {
    expect(range.groupSelectedRanges()).toEqual({ type: 'GROUP_RANGES' });
  });

  test('selectRange', () => {
    expect(range.selectRange('123', true)).toEqual({
      payload: {
        id: '123',
        isSelected: true,
        deselectOthers: true,
      },
      type: 'SELECT_RANGE',
    });
    expect(range.selectRange('123', false)).toEqual({
      payload: {
        id: '123',
        isSelected: false,
        deselectOthers: true,
      },
      type: 'SELECT_RANGE',
    });
  });

  test('updateRange', () => {
    const action = range.updateRange('123', {
      label: 'some label',
      summary: 'some summary',
      startTime: 0,
      endTime: 1000,
      colour: '#f00',
    });

    expect(action).toEqual({
      payload: {
        colour: '#f00',
        endTime: 1000,
        id: '123',
        label: 'some label',
        startTime: 0,
        summary: 'some summary',
      },
      type: 'UPDATE_RANGE',
    });
  });

  test('movePoint', () => {
    expect(range.movePoint(10, 50)).toEqual({
      payload: { originalX: 50, x: 10 },
      type: 'MOVE_POINT',
    });
  });

  test('deleteRange', () => {
    expect(range.deleteRange('123')).toEqual({
      payload: { id: '123' },
      type: 'DELETE_RAGE',
    });
  });

  test('loadRanges', () => {
    expect(range.loadRanges({ ranges: 'something' })).toEqual({
      ranges: { ranges: 'something' },
      type: 'LOAD_RANGES',
    });
  });
});
