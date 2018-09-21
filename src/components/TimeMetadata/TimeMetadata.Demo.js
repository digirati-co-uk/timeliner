const DEMO_POINTS = Object.values({
  root: {
    id: 'id-1',
    startTime: 0,
    endTime: 60 * 1000,
    depth: 1,
    label: 'Intro',
    summary: 'some summary',
    isSelected: false,
    colour: '#C797F0',
  },
  bubble1: {
    id: 'id-2',
    startTime: 0,
    endTime: 40 * 1000,
    depth: 2,
    label: 'Part I',
    summary: 'some summary',
    isSelected: false,
    colour: '#A8F097',
  },
  bubble2: {
    id: 'id-3',
    startTime: 40 * 1000,
    endTime: 60 * 1000,
    depth: 2,
    label: 'Part II',
    summary: 'some summary',
    isSelected: false,
    colour: '#A8F097',
  },
});

export default DEMO_POINTS;
