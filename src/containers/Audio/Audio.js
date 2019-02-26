import React, { useLayoutEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';

import { audioLoading, audioLoaded, audioError } from '../../actions/canvas';

import { setCurrentTime, finishedPlaying } from '../../actions/viewState';

// Media Element
import 'mediaelement/standalone';
import useEventListener from '../../hooks/useEventListener';
import useInterval from '../../hooks/useInterval';
import { ERROR_CODES } from '../../constants/canvas';

const { MediaElement } = window;

function Audio({ url, volume, currentTime, isPlaying, ...props }) {
  const audio = useRef();
  const player = useRef();
  const [duration, setDuration] = useState();
  const [loaded, setLoaded] = useState();
  const sources = [{ src: url }];
  const lastTime = useRef(null);

  // Bootstrap the element.
  useLayoutEffect(() => {
    const element = new MediaElement(
      audio.current,
      {
        startVolume: volume / 100,
        currentTime: currentTime / 1000,
      },
      sources
    );
    player.current = element;
    setLoaded(false);
    return () => {
      element.remove();
    };
  }, []);

  useEventListener(player, 'error', event => {
    if (event && event.type === 'error') {
      // This will need to be refined.
      props.audioError('error', ERROR_CODES.MEDIA_ERR_NETWORK);
    }
  });

  // Loop timer for calculating current time.
  useInterval(
    () => {
      const position = player.current.getCurrentTime();
      if (position * 1000 !== lastTime.current) {
        lastTime.current = position * 1000;
        props.setCurrentTime(position * 1000);
      }

      if (player.current.readyState && loaded === false) {
        setDuration(player.current.duration * 1000);
        props.audioLoading(1, 1, player.current.duration * 1000);
        props.audioLoaded(true);
        setLoaded(true);
      }

      if (position === duration) {
        finishedPlaying();
      }
    },
    1000 / 5,
    [loaded]
  );

  // Handle play/pause
  useLayoutEffect(
    () => {
      if (player.current) {
        if (isPlaying) {
          player.current.play();
        } else {
          player.current.pause();
        }
      }
    },
    [isPlaying, url]
  );

  // Handle volume change.
  useLayoutEffect(
    () => {
      if (player.current) {
        player.current.setVolume(volume / 100);
      }
    },
    [volume, url]
  );

  // Handle user-changed current time.
  useLayoutEffect(
    () => {
      if (player.current && currentTime !== lastTime.current) {
        lastTime.current = currentTime;
        player.current.setCurrentTime(currentTime / 1000);
      }
    },
    [currentTime, url]
  );

  if (!url) {
    return null;
  }

  return (
    <div>
      <audio ref={audio} preload="auto">
        {sources.map((source, key) => (
          <source key={key} src={source.src} />
        ))}
      </audio>
    </div>
  );
}

const mapStateProps = state => ({
  url: state.canvas.url,
  isPlaying: state.viewState.isPlaying,
  currentTime: state.viewState.currentTime,
  volume: state.viewState.volume,
});

const mapDispatchToProps = {
  audioLoading,
  audioLoaded,
  audioError,
  setCurrentTime,
  finishedPlaying,
};

export default connect(
  mapStateProps,
  mapDispatchToProps
)(Audio);
