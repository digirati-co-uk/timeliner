import { DEFAULT_RANGE_STATE } from '../constants/range';

const range = (state = DEFAULT_RANGE_STATE, action) => {
  switch (action) {
    case 'SPLIT_RANGE_AT':
    case 'GROUP_RANGES':
    case 'DELETE_RAGE':
    case 'UPDATE_RANGE':
    case 'MOVE_POINT':
    default:
      return state;
  }
};

export default range;
