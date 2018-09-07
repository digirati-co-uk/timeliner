const DEMO_POINTS = Object.values({
  root: {
    id: 'id-1',
    startTime: 0,
    endTime: 60 * 1000,
    depth: 1,
    label: 'Intro',
    summary: 'some summary',
    isSelected: false,
    colour: '#ff0000',
  },
  bubble1: {
    id: 'id-2',
    startTime: 0,
    endTime: 40 * 1000,
    depth: 2,
    label: 'Part I',
    summary: 'some summary',
    isSelected: false,
    colour: '#00ff00',
  },
  bubble2: {
    id: 'id-3',
    startTime: 40 * 1000,
    endTime: 60 * 1000,
    depth: 2,
    label: 'Part II',
    summary: 'some summary',
    isSelected: false,
    colour: '#0000ff',
  },
});

export default DEMO_POINTS;
