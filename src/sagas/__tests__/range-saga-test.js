import { expectSaga, testSaga } from 'redux-saga-test-plan';
import rangeSaga, {
  currentTimeSideEffects,
  getStickyPointDelta,
} from '../range-saga';
import reducer from '../../reducers/root';
import {
  createRange,
  deleteRange,
  deselectRange,
  movePoint,
  rangeMutations,
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

  describe('current time side-effects', () => {
    test('it will not run if there is nothing selected', () => {
      testSaga(currentTimeSideEffects)
        .next()
        .next({
          startPlayingAtEndOfSection: true,
          stopPlayingAtTheEndOfSection: false,
        })
        .next([])
        .isDone();
    });

    test('start playing at the end of section', () => {
      testSaga(currentTimeSideEffects)
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
        .put(setCurrentTime(0));
    });
    test('stop playing at the end of section', () => {
      testSaga(currentTimeSideEffects)
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
        .put(pause());
    });
    test('neither option', () => {});
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
