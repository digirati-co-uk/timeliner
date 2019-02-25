import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import rangeSaga, {
  createRangeAction,
  currentTimeSaga,
  getStickyPointDelta,
} from '../range-saga';
import reducer from '../../reducers/root';
import {
  createRange,
  decreaseRangeDepth,
  deleteRange,
  deselectRange,
  groupSelectedRanges,
  increaseRangeDepth,
  movePoint,
  rangeMutations,
  scheduleDeleteRange,
  selectRange,
  updateRange,
  updateRangeTime,
} from '../../actions/range';
import {
  editMetadata,
  loadViewState,
  nextBubble,
  pause,
  play,
  previousBubble,
  setCurrentTime,
} from '../../actions/viewState';
import { SET_CURRENT_TIME } from '../../constants/viewState';
import { updateSettings } from '../../actions/project';

describe('sagas/range-saga', () => {
  function mockedRangeState(actions) {
    return actions.reduce(reducer, undefined);
  }

  describe('next range', () => {
    it('should be able to go to the second range from the first', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            setCurrentTime(500),
            createRange({ id: 'range-1', startTime: 0, endTime: 1000 }),
            createRange({ id: 'range-2', startTime: 1000, endTime: 2000 }),
            createRange({ id: 'range-3', startTime: 2000, endTime: 3000 }),
          ])
        )
        .put(setCurrentTime(1001))
        .dispatch(nextBubble())
        .silentRun();
    });

    it('should be able to go from second range to last range', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            setCurrentTime(1001),
            createRange({ id: 'range-1', startTime: 0, endTime: 1000 }),
            createRange({ id: 'range-2', startTime: 1000, endTime: 2000 }),
            createRange({ id: 'range-3', startTime: 2000, endTime: 3000 }),
          ])
        )
        .put(setCurrentTime(2001))
        .dispatch(nextBubble())
        .silentRun();
    });

    it('should be able to go from third range to just past the end', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            loadViewState({ runTime: 3000 }),
            setCurrentTime(2001),
            createRange({ id: 'range-1', startTime: 0, endTime: 1000 }),
            createRange({ id: 'range-2', startTime: 1000, endTime: 2000 }),
            createRange({ id: 'range-3', startTime: 2000, endTime: 3000 }),
          ])
        )
        .put(setCurrentTime(3001))
        .dispatch(nextBubble())
        .silentRun();
    });

    it('should be jump to the end if bubbles are not continuous', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            loadViewState({ runTime: 3000 }),
            setCurrentTime(2001),
            createRange({ id: 'range-1', startTime: 0, endTime: 1000 }),
            createRange({ id: 'range-2', startTime: 1000, endTime: 2000 }),
          ])
        )
        .put(setCurrentTime(3001))
        .dispatch(nextBubble())
        .silentRun();
    });
  });

  describe('previous bubble', () => {
    it('should be able to go to previous bubble', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            loadViewState({ runTime: 3000 }),
            setCurrentTime(1500),
            createRange({ id: 'range-1', startTime: 0, endTime: 1000 }),
            createRange({ id: 'range-2', startTime: 1000, endTime: 2000 }),
            createRange({ id: 'range-3', startTime: 2000, endTime: 3000 }),
          ])
        )
        .put(setCurrentTime(1000))
        .dispatch(previousBubble())
        .silentRun();
    });

    it('should give a 50ms before allowing rewinding', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            loadViewState({ runTime: 3000 }),
            setCurrentTime(2049),
            createRange({ id: 'range-1', startTime: 0, endTime: 1000 }),
            createRange({ id: 'range-2', startTime: 1000, endTime: 2000 }),
            createRange({ id: 'range-3', startTime: 2000, endTime: 3000 }),
          ])
        )
        .put(setCurrentTime(1000))
        .dispatch(previousBubble())
        .silentRun();
    });

    it('should still rewind after 50ms', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            loadViewState({ runTime: 3000 }),
            setCurrentTime(2050),
            createRange({ id: 'range-1', startTime: 0, endTime: 1000 }),
            createRange({ id: 'range-2', startTime: 1000, endTime: 2000 }),
            createRange({ id: 'range-3', startTime: 2000, endTime: 3000 }),
          ])
        )
        .put(setCurrentTime(2000))
        .dispatch(previousBubble())
        .silentRun();
    });

    it('should still rewind 50ms before the end of a section', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            loadViewState({ runTime: 3000 }),
            setCurrentTime(1951),
            createRange({ id: 'range-1', startTime: 0, endTime: 1000 }),
            createRange({ id: 'range-2', startTime: 1000, endTime: 2000 }),
            createRange({ id: 'range-3', startTime: 2000, endTime: 3000 }),
          ])
        )
        .put(setCurrentTime(1000))
        .dispatch(previousBubble())
        .silentRun();
    });

    it('should rewind to beginning when there are no bubbles', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            loadViewState({ runTime: 3000 }),
            setCurrentTime(2000),
          ])
        )
        .put(setCurrentTime(0))
        .dispatch(previousBubble())
        .silentRun();
    });
  });

  describe('move point', () => {
    test('simple point moving', async () => {
      await expectSaga(rangeSaga)
        .withState(require('../../../state-fixtures/simple-resize'))
        .put(
          rangeMutations([
            updateRangeTime('id-1548164241950', { endTime: 117252 }),
            updateRangeTime('id-1548164246675', { startTime: 117252 }),
          ])
        )
        .dispatch(movePoint(117252, 123788.17365269462))
        .silentRun();
    });

    test('simple nested point moving', async () => {
      await expectSaga(rangeSaga)
        .withState(require('../../../state-fixtures/simple-nested'))
        .put(
          rangeMutations([
            updateRangeTime('id-1548164241950', { endTime: 110518 }),
            updateRangeTime('id-1548164246675', { startTime: 110518 }),
            updateRangeTime('id-1548164710114', { startTime: 110518 }),
          ])
        )
        .dispatch(movePoint(110518, 117252.15808383234))
        .silentRun();
    });

    test('simple nested point - end point moving', async () => {
      await expectSaga(rangeSaga)
        .withState(require('../../../state-fixtures/simple-nested'))
        .put(
          rangeMutations([
            updateRangeTime('id-1548164243857', { startTime: 166965 }),
            updateRangeTime('id-1548164707218', { endTime: 166965 }),
            updateRangeTime('id-1548164710114', { endTime: 166965 }),
          ])
        )
        .dispatch(movePoint(166965, 162013.96167664672))
        .silentRun();
    });

    test('simple nested point - middle point moving', async () => {
      await expectSaga(rangeSaga)
        .withState(require('../../../state-fixtures/simple-nested'))
        .put(
          rangeMutations([
            updateRangeTime('id-1548164246675', { endTime: 138642 }),
            updateRangeTime('id-1548164707218', { startTime: 138642 }),
          ])
        )
        .dispatch(movePoint(138642, 135077.65508982036))
        .silentRun();
    });

    test('resizing a bubble to zero should remove it from view', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            createRange({ id: '1', startTime: 0, endTime: 1000 }),
            createRange({ id: '2', startTime: 1000, endTime: 2000 }),
          ])
        )
        .put(
          rangeMutations([
            updateRangeTime('2', { startTime: 0 }),
            deleteRange('1'),
          ])
        )
        .dispatch(movePoint(0, 1000))
        .silentRun();
    });

    test('resizing a bubble from the left-to-right should remove it', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            createRange({ id: '1', startTime: 0, endTime: 1000 }),
            createRange({ id: '2', startTime: 1000, endTime: 2000 }),
          ])
        )
        .put(
          rangeMutations([
            updateRangeTime('1', { endTime: 2000 }),
            deleteRange('2'),
          ])
        )
        .dispatch(movePoint(2000, 1000))
        .silentRun();
    });

    test('when resizing a bubble and it is removed, if there are redundant grouping bubbles, they are removed too', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            createRange({ id: '1', startTime: 0, endTime: 1000 }),
            createRange({ id: '2', startTime: 1000, endTime: 2000 }),
            createRange({ id: '3', startTime: 2000, endTime: 3000 }),
            createRange({ id: '4', startTime: 1000, endTime: 3000, depth: 2 }),
            createRange({ id: '5', startTime: 3000, endTime: 4000 }),
          ])
        )
        .put(
          rangeMutations([
            updateRangeTime('1', { endTime: 2000 }),
            deleteRange('2'),
            deleteRange('4'),
          ])
        )
        .dispatch(movePoint(2000, 1000))
        .silentRun();
    });

    test('when resizing a bubble from the outside, it should remove redundant bubbles', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            createRange({ id: '1', startTime: 0, endTime: 1000 }),
            createRange({ id: '2', startTime: 1000, endTime: 2000 }),
            createRange({ id: '3', startTime: 2000, endTime: 3000 }),
            createRange({ id: '4', startTime: 1000, endTime: 3000, depth: 2 }),
            createRange({ id: '5', startTime: 3000, endTime: 4000 }),
          ])
        )
        .put(
          rangeMutations([
            updateRangeTime('2', { endTime: 3000 }),
            deleteRange('3'),
            deleteRange('4'),
          ])
        )
        .dispatch(movePoint(3000, 2000))
        .silentRun();
    });
  });

  describe('save range saga', async () => {
    test('when a range is saved with a startTime, it will run through the same move point logic', async () => {
      // From 1000 to 0, this will override range with ID 1, removing it completely.
      const updateAction = updateRange('2', {
        label: 'Testing label',
        summary: 'Testing summary',
        startTime: 0,
      });

      const {
        startTime: _1,
        endTime: _2,
        ...expectedPayload
      } = updateAction.payload;

      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            createRange({ id: '1', startTime: 0, endTime: 1000 }),
            createRange({ id: '2', startTime: 1000, endTime: 2000 }),
          ])
        )
        .put(
          rangeMutations([
            {
              type: 'UPDATE_RANGE',
              payload: expectedPayload,
            },
            updateRangeTime('2', { startTime: 0 }),
            deleteRange('1'),
          ])
        )
        .put(editMetadata(null))
        .dispatch(updateAction)
        .silentRun();
    });

    test('when a range is saved with a endTime, it will run through the same move point logic', async () => {
      // From 1000 to 2000, this will override range with id 2.
      const updateAction = updateRange('1', {
        label: 'Testing label',
        summary: 'Testing summary',
        endTime: 2000,
      });

      const {
        startTime: _1,
        endTime: _2,
        ...expectedPayload
      } = updateAction.payload;

      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            createRange({ id: '1', startTime: 0, endTime: 1000 }),
            createRange({ id: '2', startTime: 1000, endTime: 2000 }),
          ])
        )
        .put(
          rangeMutations([
            {
              type: 'UPDATE_RANGE',
              payload: expectedPayload,
            },
            updateRangeTime('1', { endTime: 2000 }),
            deleteRange('2'),
          ])
        )
        .put(editMetadata(null))
        .dispatch(updateAction)
        .silentRun();
    });
  });

  describe('select range saga', () => {
    test('it will play bubble when selected', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            createRange({ id: '1', startTime: 0, endTime: 1000 }),
            createRange({ id: '2', startTime: 1000, endTime: 2000 }),
            // The action we are testing.
            selectRange('2'),
          ])
        )
        .put(play())
        .dispatch(selectRange('2'))
        .silentRun();
    });

    test('it will pause bubble when already selected', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            createRange({ id: '1', startTime: 0, endTime: 1000 }),
            createRange({ id: '2', startTime: 1000, endTime: 2000 }),
          ])
        )
        .put(pause())
        .dispatch(deselectRange('2'))
        .silentRun();
    });
  });

  describe('current time saga', () => {
    test('it will not run if there is nothing selected', () => {
      testSaga(currentTimeSaga)
        .next()
        .next({
          startPlayingAtEndOfSection: true,
          stopPlayingAtTheEndOfSection: false,
        })
        .next([])
        .isDone();
    });

    test('start playing at the end of section', () => {
      testSaga(currentTimeSaga)
        .next()
        .next({
          startPlayingAtEndOfSection: true,
          stopPlayingAtTheEndOfSection: false,
        })
        .next(['test-1', 'test-2'])
        .next([
          { id: 'test-1', startTime: 0, endTime: 1000 },
          { id: 'test-2', startTime: 1000, endTime: 2000 },
        ])
        .next(0)
        // In the while loop
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(100))
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(500))
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(1000))
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(1500))
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(2000))
        .put(setCurrentTime(0))
        .next()
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(0)) // simulate the PUT
        .take(SET_CURRENT_TIME);
    });

    test('stop playing at the end of section', () => {
      testSaga(currentTimeSaga)
        .next()
        .next({
          startPlayingAtEndOfSection: false,
          stopPlayingAtTheEndOfSection: true,
        })
        .next(['test-1', 'test-2'])
        .next([
          { id: 'test-1', startTime: 0, endTime: 1000 },
          { id: 'test-2', startTime: 1000, endTime: 2000 },
        ])
        .next(0)
        // In the while loop
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(100))
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(500))
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(1000))
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(1500))
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(2000))
        .put(pause())
        .next()
        .take(SET_CURRENT_TIME);
    });

    test('neither option', () => {
      testSaga(currentTimeSaga)
        .next()
        .next({
          startPlayingAtEndOfSection: false,
          stopPlayingAtTheEndOfSection: false,
        })
        .next(['test-1', 'test-2'])
        .next([
          { id: 'test-1', startTime: 0, endTime: 1000 },
          { id: 'test-2', startTime: 1000, endTime: 2000 },
        ])
        .next(0)
        // In the while loop
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(100))
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(500))
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(1000))
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(1500))
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(2000))
        .take(SET_CURRENT_TIME);
    });

    test('if user skips more than 1 second, saga stops', () => {
      testSaga(currentTimeSaga)
        .next()
        .next({
          startPlayingAtEndOfSection: false,
          stopPlayingAtTheEndOfSection: false,
        })
        .next(['test-1', 'test-2'])
        .next([
          { id: 'test-1', startTime: 0, endTime: 1000 },
          { id: 'test-2', startTime: 1000, endTime: 2000 },
        ])
        .next(100)
        // In the while loop
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(100))
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(1101))
        .isDone();
    });

    test('if user skips backwards more than 1 second, saga stops', () => {
      testSaga(currentTimeSaga)
        .next()
        .next({
          startPlayingAtEndOfSection: false,
          stopPlayingAtTheEndOfSection: false,
        })
        .next(['test-1', 'test-2'])
        .next([
          { id: 'test-1', startTime: 0, endTime: 1000 },
          { id: 'test-2', startTime: 1000, endTime: 2000 },
        ])
        .next(0)
        // In the while loop
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(100))
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(500))
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(1100))
        .take(SET_CURRENT_TIME)
        .next(setCurrentTime(99))
        .isDone();
    });
  });

  describe('select range', () => {
    test('it can deselect range', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            updateSettings({ startPlayingWhenBubbleIsClicked: false }),
            createRange({ id: 'range-1' }),
            createRange({ id: 'range-2' }),
            createRange({ id: 'range-3' }),
            selectRange('range-2'),
          ])
        )
        .put({ ...deselectRange('range-2'), meta: { fromSaga: true }})
        .dispatch(selectRange('range-1', true))
        .silentRun();
    });

    test('it can still select multiple', async () => {
      await expectSaga(rangeSaga)
        .withReducer(reducer)
        .withState(
          mockedRangeState([
            createRange({ id: 'range-1', startTime: 0, endTime: 1000 }),
            createRange({ id: 'range-2', startTime: 1000, endTime: 2000 }),
            createRange({ id: 'range-3', startTime: 2000, endTime: 3000 }),
            selectRange('range-2'),
          ])
        )
        .dispatch(selectRange('range-1', false))
        .silentRun()
        .then(result => {
          expect(result.storeState.range.selected).toEqual([
            'range-2',
            'range-1',
          ]);
        });
    });
  });

  describe('group ranges', () => {
    const rangeCreatorMock = () => {
      let i = 0;
      return {
        call(effect, next) {
          // Check for the API call to return fake value
          if (effect.fn === createRangeAction) {
            i += 1;
            return createRange({ ...effect.args[0], id: `mocked-id-${i}` });
          }

          // Allow Redux Saga to handle other `call` effects
          return next();
        },
      };
    };

    test('it can group simple ranges', async () => {
      await expectSaga(rangeSaga)
        .provide(rangeCreatorMock())
        .withState(
          mockedRangeState([
            createRange({ id: 'r1', startTime: 0, endTime: 1000 }),
            createRange({ id: 'r2', startTime: 1000, endTime: 2000 }),
            createRange({ id: 'r3', startTime: 2000, endTime: 3000 }),
            createRange({ id: 'r4', startTime: 3000, endTime: 4000 }),
            selectRange('r2', false),
            selectRange('r3', false),
          ])
        )
        .put(
          rangeMutations([
            deselectRange('r2'),
            deselectRange('r3'),
            createRange({
              id: 'mocked-id-1',
              startTime: 1000,
              endTime: 3000,
              depth: 2,
            }),
            selectRange('mocked-id-1'),
          ])
        )
        .dispatch(groupSelectedRanges())
        .silentRun();
    });

    test('it can group a span of ranges', async () => {
      await expectSaga(rangeSaga)
        .provide(rangeCreatorMock())
        .withState(
          mockedRangeState([
            createRange({ id: 'r1', startTime: 0, endTime: 1000 }),
            createRange({ id: 'r2', startTime: 1000, endTime: 2000 }),
            createRange({ id: 'r3', startTime: 2000, endTime: 3000 }),
            createRange({ id: 'r4', startTime: 3000, endTime: 4000 }),
            selectRange('r2', false),
            selectRange('r4', false),
          ])
        )
        .put(
          rangeMutations([
            deselectRange('r2'),
            deselectRange('r4'),
            createRange({
              id: 'mocked-id-1',
              startTime: 1000,
              endTime: 4000,
              depth: 2,
            }),
            selectRange('mocked-id-1'),
          ])
        )
        .dispatch(groupSelectedRanges())
        .silentRun();
    });

    test('it can group a range that is nested (left)', async () => {
      await expectSaga(rangeSaga)
        .provide(rangeCreatorMock())
        .withState(
          mockedRangeState([
            createRange({ id: 'r1', startTime: 0, endTime: 1000 }),
            createRange({ id: 'r2', startTime: 1000, endTime: 2000 }),
            createRange({ id: 'r3', startTime: 2000, endTime: 3000 }),
            createRange({ id: 'r4', startTime: 1000, endTime: 3000, depth: 2 }),
            createRange({ id: 'r5', startTime: 3000, endTime: 4000 }),
            selectRange('r1', false),
            selectRange('r4', false),
          ])
        )
        .put(
          rangeMutations([
            deselectRange('r1'),
            deselectRange('r4'),
            createRange({
              id: 'mocked-id-1',
              startTime: 0,
              endTime: 3000,
              depth: 3,
            }),
            selectRange('mocked-id-1'),
          ])
        )
        .dispatch(groupSelectedRanges())
        .silentRun();
    });

    test('it can group a range that is nested (right)', async () => {
      await expectSaga(rangeSaga)
        .provide(rangeCreatorMock())
        .withState(
          mockedRangeState([
            createRange({ id: 'r1', startTime: 0, endTime: 1000 }),
            createRange({ id: 'r2', startTime: 1000, endTime: 2000 }),
            createRange({ id: 'r3', startTime: 2000, endTime: 3000 }),
            createRange({ id: 'r4', startTime: 1000, endTime: 3000, depth: 2 }),
            createRange({ id: 'r5', startTime: 3000, endTime: 4000 }),
            selectRange('r2', false),
            selectRange('r5', false),
          ])
        )
        .put(
          rangeMutations([
            deselectRange('r2'),
            deselectRange('r5'),
            createRange({
              id: 'mocked-id-1',
              startTime: 1000,
              endTime: 4000,
              depth: 3,
            }),
            selectRange('mocked-id-1'),
          ])
        )
        .dispatch(groupSelectedRanges())
        .silentRun();
    });

    test('it can group a range that is between 2 ranges', async () => {
      await expectSaga(rangeSaga)
        .provide(rangeCreatorMock())
        .withState(
          mockedRangeState([
            createRange({ id: 'r0', startTime: 0, endTime: 500 }),
            createRange({ id: 'r1', startTime: 500, endTime: 1000 }),
            createRange({ id: 'r2', startTime: 1000, endTime: 2000 }),
            createRange({ id: 'r3', startTime: 2000, endTime: 3000 }),
            createRange({ id: 'r4', startTime: 3000, endTime: 4000 }),
            createRange({
              id: 'r1-4',
              startTime: 500,
              endTime: 4000,
              depth: 2,
            }),
            createRange({ id: 'r5', startTime: 4000, endTime: 5000 }),

            selectRange('r1', false),
            selectRange('r2', false),
          ])
        )
        .put(
          rangeMutations([
            deselectRange('r1'),
            deselectRange('r2'),
            increaseRangeDepth('r1-4'),
            createRange({
              id: 'mocked-id-1',
              startTime: 500,
              endTime: 2000,
              depth: 2,
            }),
            selectRange('mocked-id-1'),
          ])
        )
        .dispatch(groupSelectedRanges())
        .silentRun();
    });

    test('it can group a range that is between 2 ranges and beside another', async () => {
      await expectSaga(rangeSaga)
        .provide(rangeCreatorMock())
        .withState(
          mockedRangeState([
            createRange({ id: 'r0', startTime: 0, endTime: 500 }),
            createRange({ id: 'r1', startTime: 500, endTime: 1000 }),
            createRange({ id: 'r2', startTime: 1000, endTime: 2000 }),
            createRange({
              id: 'r1-2',
              startTime: 500,
              endTime: 2000,
              depth: 2,
            }),
            createRange({ id: 'r3', startTime: 2000, endTime: 3000 }),
            createRange({ id: 'r4', startTime: 3000, endTime: 4000 }),
            createRange({
              id: 'r1-4',
              startTime: 500,
              endTime: 4000,
              depth: 3,
            }),
            createRange({ id: 'r5', startTime: 4000, endTime: 5000 }),

            selectRange('r3', false),
            selectRange('r4', false),
          ])
        )
        .put(
          rangeMutations([
            deselectRange('r3'),
            deselectRange('r4'),
            createRange({
              id: 'mocked-id-1',
              startTime: 2000,
              endTime: 4000,
              depth: 2,
            }),
            selectRange('mocked-id-1'),
          ])
        )
        .dispatch(groupSelectedRanges())
        .silentRun();
    });

    test('it can group a range that is between deeply nested (edge-case)', async () => {
      await expectSaga(rangeSaga)
        .provide(rangeCreatorMock())
        .withState(
          mockedRangeState([
            createRange({ id: 'r1', startTime: 0, endTime: 500 }),
            createRange({ id: 'r2', startTime: 500, endTime: 1000 }),
            createRange({ id: 'r3', startTime: 1000, endTime: 1500 }),
            createRange({ id: 'r4', startTime: 1500, endTime: 2000 }),
            createRange({ id: 'r5', startTime: 2000, endTime: 2500 }),
            createRange({ id: 'r6', startTime: 2500, endTime: 3000 }),
            createRange({ id: 'r7', startTime: 3000, endTime: 3500 }),

            // groupings.
            createRange({
              id: 'r2-7',
              startTime: 500,
              endTime: 3500,
              depth: 3,
            }),
            createRange({
              id: 'r2-6',
              startTime: 500,
              endTime: 3000,
              depth: 2,
            }),
            selectRange('r5', false),
            selectRange('r6', false),
          ])
        )
        .put(
          rangeMutations([
            deselectRange('r5'),
            deselectRange('r6'),
            increaseRangeDepth('r2-6'),
            increaseRangeDepth('r2-7'),
            createRange({
              id: 'mocked-id-1',
              startTime: 2000,
              endTime: 3000,
              depth: 2,
            }),
            selectRange('mocked-id-1'),
          ])
        )
        .dispatch(groupSelectedRanges())
        .silentRun();
    });
  });

  describe('delete range saga', () => {
    test('simple delete - first in row of 3', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            createRange({ id: 'r1', startTime: 0, endTime: 500 }),
            createRange({ id: 'r2', startTime: 500, endTime: 1000 }),
            createRange({ id: 'r3', startTime: 1000, endTime: 1500 }),
          ])
        )
        .put(
          rangeMutations([
            deleteRange('r1'),
            updateRangeTime('r2', { startTime: 0 }),
          ])
        )
        .dispatch(scheduleDeleteRange('r1'))
        .silentRun();
    });
    test('simple delete - second in row of 3', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            createRange({ id: 'r1', startTime: 0, endTime: 500 }),
            createRange({ id: 'r2', startTime: 500, endTime: 1000 }),
            createRange({ id: 'r3', startTime: 1000, endTime: 1500 }),
          ])
        )
        .put(
          rangeMutations([
            deleteRange('r2'),
            updateRangeTime('r1', { endTime: 1000 }),
          ])
        )
        .dispatch(scheduleDeleteRange('r2'))
        .silentRun();
    });
    test('simple delete - third in row of 3', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            createRange({ id: 'r1', startTime: 0, endTime: 500 }),
            createRange({ id: 'r2', startTime: 500, endTime: 1000 }),
            createRange({ id: 'r3', startTime: 1000, endTime: 1500 }),
          ])
        )
        .put(
          rangeMutations([
            deleteRange('r3'),
            updateRangeTime('r2', { endTime: 1500 }),
          ])
        )
        .dispatch(scheduleDeleteRange('r3'))
        .silentRun();
    });

    test('deleting a bubble nested inside another (look left)', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            createRange({ id: 'r1', startTime: 0, endTime: 500 }),
            createRange({ id: 'r2', startTime: 500, endTime: 1000 }),
            createRange({ id: 'r3', startTime: 1000, endTime: 1500 }),
            createRange({ id: 'r4', startTime: 1500, endTime: 2000 }),
            // Grouping ranges
            createRange({
              id: 'r2-4',
              startTime: 500,
              endTime: 2000,
              depth: 2,
            }),
          ])
        )
        .put(
          rangeMutations([
            deleteRange('r4'),
            updateRangeTime('r3', { endTime: 2000 }),
          ])
        )
        .dispatch(scheduleDeleteRange('r4'))
        .silentRun();
    });

    test('deleting a bubble nested inside another (middle)', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            createRange({ id: 'r1', startTime: 0, endTime: 500 }),
            createRange({ id: 'r2', startTime: 500, endTime: 1000 }),
            createRange({ id: 'r3', startTime: 1000, endTime: 1500 }),
            createRange({ id: 'r4', startTime: 1500, endTime: 2000 }),
            // Grouping ranges
            createRange({
              id: 'r2-4',
              startTime: 500,
              endTime: 2000,
              depth: 2,
            }),
          ])
        )
        .put(
          rangeMutations([
            deleteRange('r3'),
            updateRangeTime('r2', { endTime: 1500 }),
          ])
        )
        .dispatch(scheduleDeleteRange('r3'))
        .silentRun();
    });

    test('deleting a bubble nested inside another (left)', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            createRange({ id: 'r1', startTime: 0, endTime: 500 }),
            createRange({ id: 'r2', startTime: 500, endTime: 1000 }),
            createRange({ id: 'r3', startTime: 1000, endTime: 1500 }),
            createRange({ id: 'r4', startTime: 1500, endTime: 2000 }),
            // Grouping ranges
            createRange({
              id: 'r2-4',
              startTime: 500,
              endTime: 2000,
              depth: 2,
            }),
          ])
        )
        .put(
          rangeMutations([
            deleteRange('r2'),
            updateRangeTime('r3', { startTime: 500 }),
          ])
        )
        .dispatch(scheduleDeleteRange('r2'))
        .silentRun();
    });

    test('deleting a bubble nested in side a pair (redundant - left)', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            createRange({ id: 'r1', startTime: 0, endTime: 500 }),
            createRange({ id: 'r2', startTime: 500, endTime: 1000 }),
            createRange({ id: 'r3', startTime: 1000, endTime: 1500 }),
            createRange({ id: 'r4', startTime: 1500, endTime: 2000 }),
            // Grouping ranges
            createRange({
              id: 'r2-3',
              startTime: 500,
              endTime: 1500,
              depth: 2,
            }),
          ])
        )
        .put(
          rangeMutations([
            deleteRange('r2'),
            deleteRange('r2-3'),
            updateRangeTime('r3', { startTime: 500 }),
          ])
        )
        .dispatch(scheduleDeleteRange('r2'))
        .silentRun();
    });

    test('deleting a bubble nested in side a pair (redundant - right)', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            createRange({ id: 'r1', startTime: 0, endTime: 500 }),
            createRange({ id: 'r2', startTime: 500, endTime: 1000 }),
            createRange({ id: 'r3', startTime: 1000, endTime: 1500 }),
            createRange({ id: 'r4', startTime: 1500, endTime: 2000 }),
            // Grouping ranges
            createRange({
              id: 'r2-3',
              startTime: 500,
              endTime: 1500,
              depth: 2,
            }),
          ])
        )
        .put(
          rangeMutations([
            deleteRange('r3'),
            deleteRange('r2-3'),
            updateRangeTime('r2', { endTime: 1500 }),
          ])
        )
        .dispatch(scheduleDeleteRange('r3'))
        .silentRun();
    });

    test('deleting deeply nested bubble at mid-tier level', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            createRange({ id: 'r1', startTime: 0, endTime: 500 }),
            createRange({ id: 'r2', startTime: 500, endTime: 1000 }),
            createRange({ id: 'r3', startTime: 1000, endTime: 1500 }),
            createRange({ id: 'r4', startTime: 1500, endTime: 2000 }),
            createRange({ id: 'r5', startTime: 2000, endTime: 2500 }),
            // Grouping ranges
            createRange({
              id: 'r2-3',
              startTime: 500,
              endTime: 1500,
              depth: 2,
            }),
            createRange({
              id: 'r2-4',
              startTime: 500,
              endTime: 2000,
              depth: 3,
            }),
          ])
        )
        .put(rangeMutations([deleteRange('r2-3'), decreaseRangeDepth('r2-4')]))
        .dispatch(scheduleDeleteRange('r2-3'))
        .silentRun();
    });

    test('deleting deeply nested bubble at mid-tier level - side-by-side right', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            createRange({ id: 'r1', startTime: 0, endTime: 500 }),
            createRange({ id: 'r2', startTime: 500, endTime: 1000 }),
            createRange({ id: 'r3', startTime: 1000, endTime: 1500 }),
            createRange({ id: 'r4', startTime: 1500, endTime: 2000 }),
            createRange({ id: 'r5', startTime: 2000, endTime: 2500 }),
            createRange({ id: 'r6', startTime: 2500, endTime: 2000 }),
            createRange({ id: 'r7', startTime: 3000, endTime: 3500 }),

            // Grouping ranges
            createRange({
              id: 'r2-3',
              startTime: 500,
              endTime: 1500,
              depth: 2,
            }),
            createRange({
              id: 'r4-5',
              startTime: 1500,
              endTime: 2500,
              depth: 2,
            }),
            createRange({
              id: 'r2-5',
              startTime: 500,
              endTime: 2500,
              depth: 3,
            }),
          ])
        )
        .put(rangeMutations([deleteRange('r4-5')]))
        .dispatch(scheduleDeleteRange('r4-5'))
        .silentRun();
    });

    test('deleting deeply nested bubble at mid-tier level - side-by-side left', async () => {
      await expectSaga(rangeSaga)
        .withState(
          mockedRangeState([
            createRange({ id: 'r1', startTime: 0, endTime: 500 }),
            createRange({ id: 'r2', startTime: 500, endTime: 1000 }),
            createRange({ id: 'r3', startTime: 1000, endTime: 1500 }),
            createRange({ id: 'r4', startTime: 1500, endTime: 2000 }),
            createRange({ id: 'r5', startTime: 2000, endTime: 2500 }),
            createRange({ id: 'r6', startTime: 2500, endTime: 2000 }),
            createRange({ id: 'r7', startTime: 3000, endTime: 3500 }),

            // Grouping ranges
            createRange({
              id: 'r2-3',
              startTime: 500,
              endTime: 1500,
              depth: 2,
            }),
            createRange({
              id: 'r4-5',
              startTime: 1500,
              endTime: 2500,
              depth: 2,
            }),
            createRange({
              id: 'r2-5',
              startTime: 500,
              endTime: 2500,
              depth: 3,
            }),
          ])
        )
        .put(rangeMutations([deleteRange('r2-3')]))
        .dispatch(scheduleDeleteRange('r2-3'))
        .silentRun();
    });

    test('fixture 1 - failing case: delete-nested (left)', async () => {
      await expectSaga(rangeSaga)
        .withState(require('../../../state-fixtures/delete-nested'))
        .put(rangeMutations([deleteRange('id-1548251126620')]))
        .dispatch(scheduleDeleteRange('id-1548251126620'))
        .silentRun();
    });

    test('fixture 1 - failing case: delete-nested (right)', async () => {
      await expectSaga(rangeSaga)
        .withState(require('../../../state-fixtures/delete-nested'))
        .put(rangeMutations([deleteRange('id-1548251128847')]))
        .dispatch(scheduleDeleteRange('id-1548251128847'))
        .silentRun();
    });

    test('fixture 2 - failing test case: delete nested (right)', async () => {
      await expectSaga(rangeSaga)
        .withState(require('../../../state-fixtures/delete-nested-2'))
        .put(
          rangeMutations([
            deleteRange('id-1548252556587'),
            decreaseRangeDepth('id-1548252559185'),
            decreaseRangeDepth('id-1548252552391'),
          ])
        )
        .dispatch(scheduleDeleteRange('id-1548252556587'))
        .silentRun();
    });

    test('fixture 3 - failing test case: delete nested (collapse)', async () => {
      await expectSaga(rangeSaga)
        .withState(require('../../../state-fixtures/delete-nested-3'))
        .put(
          rangeMutations([
            deleteRange('id-1548252950570'),
            deleteRange('id-1548252958357'),
            decreaseRangeDepth('id-1548252966435'),
            decreaseRangeDepth('id-1548252978957'),
            updateRangeTime('id-1548252948296', { endTime: 37224.52512155592 }),
            updateRangeTime('id-1548252952405', { endTime: 37224.52512155592 }),
          ])
        )
        .dispatch(scheduleDeleteRange('id-1548252950570'))
        .silentRun();
    });
  });

  describe('get sticky point delta', () => {
    test('it chooses closest delta', () => {
      expect(
        getStickyPointDelta(
          [
            { startTime: 1000, endTime: 2000 },
            { startTime: 1001, endTime: 1500 },
            { startTime: 1002, endTime: 1200 },
            { startTime: 1200, endTime: 1500 },
            { startTime: 1500, endTime: 2000 },
          ],
          1000,
          50
        )
      ).toEqual(1002);
    });
  });
});
