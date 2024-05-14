import { csrfFetch } from './csrf';
import { sortList } from './spots';

const ADD_ONE = 'spotImages/ADD_ONE';

const addOneImage = (spotImage) => ({
  type: ADD_ONE,
  spotImage,
});

export const createSpotImage = (data, spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const spotImage = await res.json();
    dispatch(addOneImage(spotImage));
    return spotImage;
  }
};

const initialState = {
  list: [],
};

const spotImageReducer = (state = initialState, action) => {
  switch (action.type) {
    // case ADD_ONE: {
    //   if (!state[action.spotImage.id]) {
    //     const newState = {
    //       ...state,
    //       [action.spotImage.id]: action.spotImage,
    //     };
    //     const spotImageList = newState.list.map((id) => newState[id]);
    //     spotImageList.push(action.spotImage);
    //     newState.list = sortList(spotImageList);
    //     return newState;
    //   }
    //   return {
    //     ...state,
    //     [action.spotImage.id]: {
    //       ...state[action.spotImage.id],
    //       ...action.spotImage,
    //     },
    //   };
    // }
    case ADD_ONE:
      return {
        ...state,
        [action.spotImage.id]: action.spotImage,
      };
    default:
      return state;
  }
};

export default spotImageReducer;
