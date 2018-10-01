import * as canvas from '../canvas';

describe('actions/canvas', () => {
  test('load canvas', () => {
    expect(
      canvas.loadCanvas({ id: 'http://example.org/canvas', type: 'Canvas' })
    ).toEqual({
      state: { id: 'http://example.org/canvas', type: 'Canvas' },
      type: 'LOAD_CANVAS',
    });
  });

  test('audioLoading', () => {
    expect(canvas.audioLoading(0, 10000, 50)).toEqual({
      payload: { duration: 50, percentLoaded: 0 },
      type: 'AUDIO_LOADING',
    });

    expect(canvas.audioLoading(2500, 10000, 50)).toEqual({
      payload: { duration: 50, percentLoaded: 25 },
      type: 'AUDIO_LOADING',
    });
  });

  test('audioLoading - failing', () => {
    expect(() => canvas.audioLoading(11000, 10000, 50)).toThrowError(
      'Bytes loaded cannot be more than the total'
    );
  });

  test('audioLoaded', () => {
    expect(canvas.audioLoaded(true)).toEqual({
      payload: { isLoaded: true },
      type: 'AUDIO_LOADED',
    });

    expect(canvas.audioLoaded(false)).toEqual({
      payload: { isLoaded: false },
      type: 'AUDIO_LOADED',
    });
  });

  test('audioError', () => {
    expect(canvas.audioError(100, 'Some error')).toEqual({
      payload: { code: 100, description: 'Some error' },
      type: 'AUDIO_ERROR',
    });
    expect(canvas.audioError(101)).toEqual({
      payload: { code: 101, description: 'Unknown error' },
      type: 'AUDIO_ERROR',
    });

    expect(canvas.audioError()).toEqual({
      payload: { code: undefined, description: 'Unknown error' },
      type: 'AUDIO_ERROR',
    });
  });
});
