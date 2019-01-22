module.exports = {
  viewState: {
    runTime: 330762,
    isPlaying: false,
    currentTime: 123788.17365269462,
    zoom: 1,
    x: 0,
    isImportOpen: false,
    isSettingsOpen: false,
    volume: 70,
    metadataToEdit: null,
    projectMetadataEditorOpen: false,
    source: null,
    verifyDialog: {
      open: false,
      title: 'Are you sure you want to delete all ranges?',
    },
  },
  project: {
    bubbleHeight: 55,
    showTimes: false,
    blackAndWhite: false,
    bubblesStyle: 'rounded',
    autoScaleHeightOnResize: false,
    startPlayingWhenBubbleIsClicked: true,
    stopPlayingAtTheEndOfSection: false,
    startPlayingAtEndOfSection: false,
    backgroundColour: '#fff',
    language: 'en',
    title: 'Chopin, Nocturne in D-Flat Major',
    description:
      "This Nocturne was composed in 1835 and is dedicated to Mme. la Comtesse d'Appony. The work alternates between two main ideas (A B A B A B + Coda). The first of these ideas always returns in the tonic with only slight modifications, (suggesting a rondo theme), while the second idea is developmental, moving through several keys. One might interpret the organization of this Nocturne as a rondo, or alternatively as strophic (A A' A'' Coda), in which each strophe consists of two parts (A and B).",
    loadedJson: {
      '@context': [
        'http://digirati.com/ns/timeliner',
        'http://www.w3.org/ns/anno.jsonld',
        'http://iiif.io/api/presentation/3/context.json',
      ],
      id: 'http://digirati.com/iiif/v3/temporary/manifest',
      type: 'Manifest',
      label: {
        en: ['Chopin, Nocturne in D-Flat Major'],
      },
      summary: {
        en: [
          "This Nocturne was composed in 1835 and is dedicated to Mme. la Comtesse d'Appony. The work alternates between two main ideas (A B A B A B + Coda). The first of these ideas always returns in the tonic with only slight modifications, (suggesting a rondo theme), while the second idea is developmental, moving through several keys. One might interpret the organization of this Nocturne as a rondo, or alternatively as strophic (A A' A'' Coda), in which each strophe consists of two parts (A and B).",
        ],
      },
      items: [
        {
          id: 'http://digirati.com/iiif/v3/temporary/canvas/c1',
          type: 'Canvas',
          label: {
            en: ['Untitled Item'],
          },
          items: [
            {
              id: 'http://digirati.com/iiif/v3/temporary/list/c1-ap',
              type: 'AnnotationPage',
              items: [
                {
                  id: 'http://digirati.com/iiif/v3/temporary/annot/c1-1',
                  type: 'Annotation',
                  motivation: 'painting',
                  label: {
                    en: ['Untitled audio'],
                  },
                  body: {
                    id: 'http://www.dlib.indiana.edu/~jwd/Chopin_nocturne.mp3',
                    type: 'Audio',
                    duration: 330.73632653061225,
                    format: 'audio/mp3',
                  },
                  target: 'http://digirati.com/iiif/v3/temporary/canvas/c',
                },
              ],
            },
          ],
        },
      ],
      structures: [
        {
          id: 'id-1539276644896',
          type: 'Range',
          label: {
            en: ['Coda'],
          },
          summary: {
            en: [
              "A series of delicate descending leaps in the coda provide a counterbalance to the ascending leaps which characterize the Nocturne's A theme and the upward-striving gestures of the B theme. These chromatically descending gestures are presented over an unchanging tonic pedal tone. \n",
            ],
          },
          items: [
            {
              id:
                'http://digirati.com/iiif/v3/temporary/canvas/c1#t=244.14554154302672,330.73632653061225',
              type: 'Canvas',
            },
          ],
          'tl:backgroundColour': '#7ed321',
        },
        {
          id: 'id-1539276565248',
          type: 'Range',
          label: {
            en: ['B'],
          },
          summary: {
            en: [
              'The B theme features continuous "double-stops" (often parallel thirds and sixths) rather than a single melodic line. ',
            ],
          },
          items: [
            {
              id: 'id-1539276553699',
              type: 'Range',
              label: {
                en: ['b2'],
              },
              summary: {
                en: [
                  'The second part of the B theme presents "con forza" octave gestures in alternation with simple pianissimo turn figures. Harmonically, this section gradually settles into an Ab pedal, which allows a return of the A theme in Db major. ',
                ],
              },
              items: [
                {
                  id:
                    'http://digirati.com/iiif/v3/temporary/canvas/c1#t=65.51443175074185,100.60268545994064',
                  type: 'Canvas',
                },
              ],
              'tl:backgroundColour': '#b8e986',
            },
            {
              id: 'id-1539276417625',
              type: 'Range',
              label: {
                en: ['b1'],
              },
              summary: {
                en: [
                  'The B section begins in Bb minor, but the theme is repeated immediately in Eb minor. The theme becomes vigorously energetic as it progresses.',
                ],
              },
              items: [
                {
                  id:
                    'http://digirati.com/iiif/v3/temporary/canvas/c1#t=34.84288130563799,65.51443175074185',
                  type: 'Canvas',
                },
              ],
              'tl:backgroundColour': '#50e3c2',
            },
          ],
          'tl:backgroundColour': '#9013fe',
        },
        {
          id: 'id-1539276609013',
          type: 'Range',
          label: {
            en: ["B'"],
          },
          summary: {
            en: ['Varied return of the B theme'],
          },
          items: [
            {
              id: 'id-1539276515179',
              type: 'Range',
              label: {
                en: ["b1'"],
              },
              summary: {
                en: [
                  'Here the B theme is restated in A major--a key shift that is quite striking (Db and A major are related by a tritone). Chopin connects the two key areas by reinterpreting Db as C#.',
                ],
              },
              items: [
                {
                  id:
                    'http://digirati.com/iiif/v3/temporary/canvas/c1#t=133.72795994065282,166.60786201780417',
                  type: 'Canvas',
                },
              ],
              'tl:backgroundColour': '#50e3c2',
            },
            {
              id: 'id-1539276590416',
              type: 'Range',
              label: {
                en: ['b3'],
              },
              summary: {
                en: [
                  'The melodic material of this transitional section derives from the repetition of an idea found at the tail-end of the A theme: a grace-note octave leap followed by its gradual descent. Simultaneously, a chromatic ascent begins in the bass, moving from G# to D# (respelled as Eb), which then falls to an Ab dominant in preparation for the return of the A theme in Db major. ',
                ],
              },
              items: [
                {
                  id:
                    'http://digirati.com/iiif/v3/temporary/canvas/c1#t=166.60786201780417,181.57557863501484',
                  type: 'Canvas',
                },
              ],
              'tl:backgroundColour': '#b8e986',
            },
          ],
          'tl:backgroundColour': '#9013fe',
        },
        {
          id: 'http://digirati.com/iiif/v3/temporary/range/r0',
          type: 'Range',
          label: {
            en: ['A'],
          },
          summary: {
            en: [
              'The serenely simple violinistic A theme of this Nocturne hovers gently over a Db pedal and wide left-hand arpeggiations. ',
            ],
          },
          items: [
            {
              id:
                'http://digirati.com/iiif/v3/temporary/canvas/c1#t=0,34.84288130563799',
              type: 'Canvas',
            },
          ],
          'tl:backgroundColour': '#4a90e2',
        },
        {
          id: 'id-1539276445495',
          type: 'Range',
          label: {
            en: ["A'"],
          },
          summary: {
            en: [
              'The main rondo theme returns in Db major. It is only slightly embellished (with double-stop figuration), near the end of the theme. ',
            ],
          },
          items: [
            {
              id:
                'http://digirati.com/iiif/v3/temporary/canvas/c1#t=100.60268545994064,133.72795994065282',
              type: 'Canvas',
            },
          ],
          'tl:backgroundColour': '#4a90e2',
        },
        {
          id: 'id-1539276656131',
          type: 'Range',
          label: {
            en: ["B''"],
          },
          summary: {
            en: ["B'': Varied return of the B theme. "],
          },
          items: [
            {
              id: 'id-1539276624853',
              type: 'Range',
              label: {
                en: ["b1''"],
              },
              summary: {
                en: ["b1'': Here the B theme returns in Eb minor. "],
              },
              items: [
                {
                  id:
                    'http://digirati.com/iiif/v3/temporary/canvas/c1#t=212.49250148367955,228.44170771513353',
                  type: 'Canvas',
                },
              ],
              'tl:backgroundColour': '#50e3c2',
            },
            {
              id: 'id-1539276635683',
              type: 'Range',
              label: {
                en: ['b4'],
              },
              summary: {
                en: [
                  "This pivotal theme combines aspects of both the A and B ideas, beginning with the upper neighbor gesture of the B theme, but continuing with the pitches of the A theme (F-Eb-Db-F-Ab). A decisive harmonic shift leads to the home key, preparing a important point of arrival (the cadence which accompanies the completion of the work's Urlinie on the downbeat of measure 62).",
                ],
              },
              items: [
                {
                  id:
                    'http://digirati.com/iiif/v3/temporary/canvas/c1#t=228.44170771513353,244.14554154302672',
                  type: 'Canvas',
                },
              ],
              'tl:backgroundColour': '#b8e986',
            },
          ],
          'tl:backgroundColour': '#9013fe',
        },
        {
          id: 'id-1539276599603',
          type: 'Range',
          label: {
            en: ["A''"],
          },
          summary: {
            en: [
              'This forte statement of the rondo theme begins similarly to the others (again in Db major). But after arriving on an unexpected Cb in its fourth',
            ],
          },
          items: [
            {
              id:
                'http://digirati.com/iiif/v3/temporary/canvas/c1#t=181.57557863501484,212.49250148367955',
              type: 'Canvas',
            },
          ],
          'tl:backgroundColour': '#4a90e2',
        },
      ],
      'tl:settings': {
        'tl:bubblesStyle': 'rounded',
        'tl:blackAndWhite': false,
        'tl:showTimes': false,
        'tl:autoScaleHeightOnResize': false,
        'tl:startPlayingWhenBubbleIsClicked': false,
        'tl:stopPlayingAtTheEndOfSection': false,
        'tl:bubbleHeight': 55,
      },
    },
  },
  canvas: {
    url: 'http://www.dlib.indiana.edu/~jwd/Chopin_nocturne.mp3',
    isLoaded: true,
    loadingPercent: 100,
    error: {
      code: null,
      description: '',
    },
  },
  range: {
    selected: [],
    list: {
      'id-1548164241950': {
        startTime: 0,
        endTime: 123788.17365269462,
        label: 'Untitled range',
        summary: '',
        colour: null,
        depth: 1,
        isSelected: false,
        whiteText: false,
        id: 'id-1548164241950',
      },
      'id-1548164243857': {
        startTime: 162013.96167664672,
        endTime: 330762,
        label: 'Untitled range',
        summary: '',
        colour: null,
        depth: 1,
        isSelected: false,
        whiteText: false,
        id: 'id-1548164243857',
      },
      'id-1548164246675': {
        startTime: 123788.17365269462,
        endTime: 162013.96167664672,
        label: 'Untitled range',
        summary: '',
        colour: null,
        depth: 1,
        isSelected: false,
        whiteText: false,
        id: 'id-1548164246675',
      },
    },
  },
  undoHistory: {
    undoQueue: [],
    redoQueue: [],
  },
  _persist: {
    version: -1,
    rehydrated: true,
  },
};
