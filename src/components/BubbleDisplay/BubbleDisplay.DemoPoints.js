const DEMO_POINTS = {
  root: {
    id: 'id-1',
    startTime: 0,
    endTime: 1000,
    children: ['id-3', 'id-2'],
    depth: 1,
    label: 'Composition',
    summary: 'some summary',
    isSelected: false,
    colour: '#C797F0',
  },
  bubble1: {
    id: 'id-2',
    startTime: 0,
    endTime: 400,
    depth: 2,
    label: 'Part I',
    summary: 'some summary',
    isSelected: false,
    colour: '#A8F097',
  },
  bubble2: {
    id: 'id-3',
    startTime: 400,
    endTime: 1000,
    depth: 2,
    label: 'Part II',
    summary: 'some summary',
    isSelected: false,
    colour: '#A8F097',
  },
};

export default DEMO_POINTS;
