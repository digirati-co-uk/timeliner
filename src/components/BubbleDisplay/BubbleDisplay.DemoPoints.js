const DEMO_POINTS = {
  root: {
    id: 'id-1',
    from: 0,
    to: 1000,
    children: ['id-3', 'id-2'],
    depth: 1,
    label: 'Composition',
    summary: 'some summary',
    isSelected: false,
    colour: '#ff0000',
  },
  bubble1: {
    id: 'id-2',
    from: 0,
    to: 400,
    depth: 2,
    label: 'Part I',
    summary: 'some summary',
    isSelected: false,
    colour: '#00ff00',
  },
  bubble2: {
    id: 'id-3',
    from: 400,
    to: 1000,
    depth: 2,
    label: 'Part II',
    summary: 'some summary',
    isSelected: false,
    colour: '#0000ff',
  },
};

export default DEMO_POINTS;
