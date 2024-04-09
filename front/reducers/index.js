import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

import { user } from './user';
import { post } from './post';
import { noti } from './notification';

const rootReducer = combineReducers({
  index: (state = {}, action) => {
    switch (action.type) {
      case HYDRATE:
        return { ...state, ...action.payload };
      default:
        return state;
    }
  },
  user,
  post,
  noti,
});

export default rootReducer;

