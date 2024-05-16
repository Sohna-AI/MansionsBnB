import { csrfFetch } from './csrf';

const LOAD = 'spots/LOAD';
const ADD_ONE = 'spots/ADD_ONE';
const REMOVE = 'spots/REMOVE';

const load = (list) => ({
  type: LOAD,
  list,
});

const addOneSpot = (spot) => ({
  type: ADD_ONE,
  spot,
});

const removeSpot = (spotId) => ({
  type: REMOVE,
  spotId,
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
    console.log(spot);
    dispatch(addOneSpot(spot));
    return spot;
  }
};

export const createSpot = (data) => async (dispatch) => {
  const res = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const spot = await res.json();
    dispatch(addOneSpot(spot));
    return spot;
  }
};

export const editSpot = (data, spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const updatedSpot = await res.json();
    dispatch(addOneSpot(updatedSpot));
    return updatedSpot;
  }
};

export const deleteSpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
  });

  if (res.ok) {
    dispatch(removeSpot(spotId));
    return;
  }
};

export const sortList = (list) => {
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

      const newSpot = {
        ...state,
        [action.spot.id]: action.spot,
      };

      return newSpot;
    }
    case REMOVE: {
      const newState = { ...state };
      delete newState[action.spotId];
      return newState;
    }
    default:
      return state;
  }
};

export default spotsReducer;
