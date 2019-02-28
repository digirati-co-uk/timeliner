import { useLayoutEffect } from 'react';

export default function useEventListener(ref, event, callback, inputs = []) {
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.addEventListener(event, callback);
    }
    return () => {
      if (ref.current) {
        ref.current.removeEventListener(event, callback);
      }
    };
  }, inputs);
}
