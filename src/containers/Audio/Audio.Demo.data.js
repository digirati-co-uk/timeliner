const demoDuration = 57.103;
export const DEMO_CANVAS_BASIC = {
  id: 'http://digirati.com/timeliner/manifest/1/c1',
  type: 'Canvas',
  label: {
    en: ['Canvas label'],
  },
  summary: {
    en: ['Description of canvas'],
  },
  duration: demoDuration,
  items: [
    {
      id: 'http://digirati.com/timeliner/manifest/1/c1/annoPage/1',
      type: 'AnnotationPage',
      items: [
        {
          id: 'http://digirati.com/timeliner/manifest/1/c1/anno/1',
          type: 'Annotation',
          motivation: 'painting',
          body: {
            id: 'https://webaudioapi.com/samples/audio-tag/chrono.mp3',
            type: 'Audio',
            format: 'audio/mp3',
          },
          target: `http://digirati.com/timeliner/manifest/1/c1#t=0,${demoDuration}`,
        },
      ],
    },
  ],
};

export const DEMO_CANVAS_TWO_TRACKS_IN_SEQUENCE = {
  id: 'http://digirati.com/timeliner/manifest/1/c1',
  type: 'Canvas',
  label: {
    en: ['Canvas label'],
  },
  summary: {
    en: ['Description of canvas'],
  },
  duration: demoDuration * 2,
  items: [
    {
      id: 'http://digirati.com/timeliner/manifest/1/c1/annoPage/1',
      type: 'AnnotationPage',
      items: [
        {
          id: 'http://digirati.com/timeliner/manifest/1/c1/anno/1',
          type: 'Annotation',
          motivation: 'painting',
          body: {
            id: 'https://webaudioapi.com/samples/audio-tag/chrono.mp3',
            type: 'Audio',
            format: 'audio/mp3',
          },
          target: `http://digirati.com/timeliner/manifest/1/c1#t=0,${demoDuration}`,
        },
      ],
    },
    {
      id: 'http://digirati.com/timeliner/manifest/1/c2/annoPage/1',
      type: 'AnnotationPage',
      items: [
        {
          id: 'http://digirati.com/timeliner/manifest/1/c2/anno/1',
          type: 'Annotation',
          motivation: 'painting',
          body: {
            id: 'https://webaudioapi.com/samples/audio-tag/chrono.mp3',
            type: 'Audio',
            format: 'audio/mp3',
          },
          target: `http://digirati.com/timeliner/manifest/1/c2#t=${demoDuration},${2 *
            demoDuration}`,
        },
      ],
    },
  ],
};

export const DEMO_CANVAS_TWO_TRACKS_OVERLAP = {
  id: 'http://digirati.com/timeliner/manifest/1/c1',
  type: 'Canvas',
  label: {
    en: ['Canvas label'],
  },
  summary: {
    en: ['Description of canvas'],
  },
  duration: demoDuration * 1.1,
  items: [
    {
      id: 'http://digirati.com/timeliner/manifest/1/c1/annoPage/1',
      type: 'AnnotationPage',
      items: [
        {
          id: 'http://digirati.com/timeliner/manifest/1/c1/anno/1',
          type: 'Annotation',
          motivation: 'painting',
          body: {
            id: 'https://webaudioapi.com/samples/audio-tag/chrono.mp3',
            type: 'Audio',
            format: 'audio/mp3',
          },
          target: `http://digirati.com/timeliner/manifest/1/c1#t=0,${demoDuration}`,
        },
      ],
    },
    {
      id: 'http://digirati.com/timeliner/manifest/1/c2/annoPage/1',
      type: 'AnnotationPage',
      items: [
        {
          id: 'http://digirati.com/timeliner/manifest/1/c2/anno/1',
          type: 'Annotation',
          motivation: 'painting',
          body: {
            id: 'https://webaudioapi.com/samples/audio-tag/chrono.mp3',
            type: 'Audio',
            format: 'audio/mp3',
          },
          target: `http://digirati.com/timeliner/manifest/1/c2#t=${demoDuration *
            0.1},${1.1 * demoDuration}`,
        },
      ],
    },
  ],
};
