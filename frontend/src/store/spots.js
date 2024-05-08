const LOAD = 'spots/LOAD';
const ADD_ONE = 'spots/ADD_ONE';

const load = (list) => ({
  type: LOAD,
  list,
});

const addOneSpot = (spot) => ({
  type: ADD_ONE,
  spot,
});

export const getSpots = () => async (dispatch) => {
  const res = await fetch(`/api/spots`);

  if (res.ok) {
    const list = await res.json();
    dispatch(load(list));
    return list;
  }
};

export const getSpotById = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const spot = await res.json();
    dispatch(addOneSpot(spot));
    return spot;
  }
};

const sortList = (list) => {
  return list
    .sort((spotA, spotB) => {
      return spotA.number - spotB.number;
    })
    .map((spot) => spot.id);
};

const initialState = {
  list: [],
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD: {
      const allSpots = {};
      action.list.Spots.forEach((spot) => {
        allSpots[spot.id] = spot;
      });
      return {
        ...allSpots,
        ...state,
        list: sortList(action.list.Spots),
      };
    }
    case ADD_ONE: {
      if (!state[action.spot.id]) {
        const newState = {
          ...state,
          [action.spot.id]: action.spot,
        };
        const spotList = newState.list.map((id) => newState[id]);
        spotList.push(action.spot);
        newState.list = sortList(spotList);
        return newState;
      }

      return {
        ...state,
        [action.spot.id]: {
          ...state[action.spot.id],
          ...action.spot,
          ...action.spot.Owner,
        },
      };
    }
    default:
      return state;
  }
};

export default spotsReducer;
