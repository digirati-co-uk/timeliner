import reducer, { getRangeList, undo } from '../range';
import {
  createRange,
  decreaseRangeDepth,
  deleteRange,
  deselectRange,
  importRanges,
  increaseRangeDepth,
  rangeMutations,
  selectRange,
  updateRange,
  updateRangeTime,
} from '../../actions/range';

describe('reducers/range', () => {
  test('default state', () => {
    expect([{ type: '@@redux/init' }].reduce(reducer, undefined)).toEqual({
      list: {},
      selected: [],
    });
  });

  test('creating a range', () => {
    expect(
      [createRange({ id: 'test-1', startTime: 0, endTime: 1000 })].reduce(
        reducer,
        undefined
      )
    ).toEqual({
      list: {
        'test-1': {
          colour: null,
          depth: 1,
          endTime: 1000,
          id: 'test-1',
          isSelected: false,
          label: 'Untitled range',
          startTime: 0,
          summary: '',
          whiteText: false,
        },
      },
      selected: [],
    });
  });

  test('removing a range', () => {
    expect(
      [
        createRange({ id: 'test-1', startTime: 0, endTime: 1000 }),
        createRange({ id: 'test-2', startTime: 0, endTime: 500 }),
        createRange({ id: 'test-3', startTime: 500, endTime: 1000 }),
        deleteRange('test-2'),
      ].reduce(reducer, undefined)
    ).toMatchSnapshot();
  });

  test('selecting range', () => {
    expect(
      [createRange({ id: 'test-1' }), selectRange('test-1')].reduce(
        reducer,
        undefined
      ).selected
    ).toEqual(['test-1']);
  });

  test('selecting multiple ranges', () => {
    expect(
      [
        createRange({ id: 'test-1' }),
        createRange({ id: 'test-2' }),
        createRange({ id: 'test-3' }),
        selectRange('test-1'),
        selectRange('test-3'),
      ].reduce(reducer, undefined).selected
    ).toEqual(['test-1', 'test-3']);
  });

  test('deselecting multiple ranges', () => {
    expect(
      [
        createRange({ id: 'test-1' }),
        createRange({ id: 'test-2' }),
        createRange({ id: 'test-3' }),
        selectRange('test-1'),
        selectRange('test-2'),
        selectRange('test-3'),
        deselectRange('test-1'),
        deselectRange('test-3'),
      ].reduce(reducer, undefined).selected
    ).toEqual(['test-2']);
  });

  test('selecting non-existent range', () => {
    expect(
      [selectRange('test-NOT_EXIST')].reduce(reducer, undefined).selected
    ).toEqual([]);
  });

  test('selecting the same range twice', () => {
    expect(
      [
        createRange({ id: 'test-1' }),
        selectRange('test-1'),
        selectRange('test-1'),
      ].reduce(reducer, undefined).selected
    ).toEqual(['test-1']);
  });

  test('deselecting range twice', () => {
    expect(
      [
        createRange({ id: 'test-1' }),
        selectRange('test-1'),
        deselectRange('test-1'),
        deselectRange('test-1'),
      ].reduce(reducer, undefined).selected
    ).toEqual([]);
  });

  test('increasing range depth', () => {
    expect(
      [createRange({ id: 'test-1' }), increaseRangeDepth('test-1')].reduce(
        reducer,
        undefined
      ).list['test-1'].depth
    ).toEqual(2);
  });

  test('increasing multiple range depth', () => {
    expect(
      [
        createRange({ id: 'test-1' }),
        increaseRangeDepth('test-1'),
        increaseRangeDepth('test-1'),
      ].reduce(reducer, undefined).list['test-1'].depth
    ).toEqual(3);
  });

  test('decreasing range depth', () => {
    expect(
      [
        createRange({ id: 'test-1' }),
        increaseRangeDepth('test-1'),
        decreaseRangeDepth('test-1'),
      ].reduce(reducer, undefined).list['test-1'].depth
    ).toEqual(1);
  });

  test('decreasing range depth past 1', () => {
    expect(
      [createRange({ id: 'test-1' }), decreaseRangeDepth('test-1')].reduce(
        reducer,
        undefined
      ).list['test-1'].depth
    ).toEqual(1);
  });

  test('update range start time', () => {
    expect(
      [
        createRange({ id: 'test-1' }),
        updateRangeTime('test-1', { startTime: 100 }),
      ].reduce(reducer, undefined).list['test-1'].startTime
    ).toEqual(100);
  });

  test('update range end time', () => {
    expect(
      [
        createRange({ id: 'test-1' }),
        updateRangeTime('test-1', { endTime: 1000 }),
      ].reduce(reducer, undefined).list['test-1'].endTime
    ).toEqual(1000);
  });

  test('update range start and end time', () => {
    expect(
      [
        createRange({ id: 'test-1' }),
        updateRangeTime('test-1', { startTime: 50, endTime: 1050 }),
      ].reduce(reducer, undefined).list['test-1']
    ).toEqual({
      colour: null,
      depth: 1,
      endTime: 1050,
      id: 'test-1',
      isSelected: false,
      label: 'Untitled range',
      startTime: 50,
      summary: '',
      whiteText: false,
    });
  });

  test('update range start time doesnt change end time', () => {
    expect(
      [
        createRange({ id: 'test-1' }),
        updateRangeTime('test-1', { startTime: 1234 }),
        updateRangeTime('test-1', { endTime: 4567 }),
      ].reduce(reducer, undefined).list['test-1'].startTime
    ).toEqual(1234);
  });

  test('update range end time doesnt change start time', () => {
    expect(
      [
        createRange({ id: 'test-1' }),
        updateRangeTime('test-1', { endTime: 4567 }),
        updateRangeTime('test-1', { startTime: 1234 }),
      ].reduce(reducer, undefined).list['test-1'].endTime
    ).toEqual(4567);
  });

  test('importing ranges', () => {
    expect(
      [
        importRanges({
          'test-1': { id: 'test-1', startTime: 0, endTime: 1000, depth: 2 },
          'test-2': { id: 'test-2', startTime: 0, endTime: 500, depth: 1 },
          'test-3': { id: 'test-3', startTime: 500, endTime: 1000, depth: 1 },
          'test-4': { id: 'test-4', startTime: 100, endTime: 1500, depth: 1 },
        }),
      ].reduce(reducer, undefined)
    ).toMatchSnapshot();
  });

  test('importing ranges as array', () => {
    expect(
      [
        importRanges([
          { id: 'test-1', startTime: 0, endTime: 1000, depth: 2 },
          { id: 'test-2', startTime: 0, endTime: 500, depth: 1 },
          { id: 'test-3', startTime: 500, endTime: 1000, depth: 1 },
          { id: 'test-4', startTime: 100, endTime: 1500, depth: 1 },
        ]),
      ].reduce(reducer, undefined)
    ).toMatchSnapshot();
  });

  test('simple mutation list', () => {
    expect(
      [
        createRange({ id: 'test-1' }),
        rangeMutations([
          updateRangeTime('test-1', { startTime: 1000 }),
          updateRange('test-1', { label: 'test label' }),
          increaseRangeDepth('test-1'),
        ]),
      ].reduce(reducer, undefined)
    ).toMatchSnapshot();
  });

  function undoTestHelper(initialActions, mutations) {
    const state1 = initialActions.reduce(reducer, undefined);
    const state2 = [mutations].reduce(reducer, state1);

    expect(state1).not.toEqual(state2);

    const state3 = [undo(state1, mutations)].reduce(reducer, state2);

    expect(state1).toEqual(state3);
  }

  test('simple mutation list - undo', () => {
    undoTestHelper(
      [createRange({ id: 'test-1' })],
      rangeMutations([
        updateRangeTime('test-1', { startTime: 1000 }),
        updateRange('test-1', { label: 'test label' }),
        increaseRangeDepth('test-1'),
      ])
    );
  });

  test('simple mutation where ordering matters', () => {
    undoTestHelper(
      [createRange({ id: 'test-1' })],
      rangeMutations([
        updateRange('test-1', { label: 'First label change' }),
        updateRange('test-1', { label: 'Second label change' }),
        updateRange('test-1', { label: 'Third label change' }),
        increaseRangeDepth('test-1'),
        decreaseRangeDepth('test-1'),
        increaseRangeDepth('test-1'),
      ])
    );
  });
});
