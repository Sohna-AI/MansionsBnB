const LOAD = 'spots/LOAD';

const load = (list) => ({
  type: LOAD,
  list,
});

export const getSpots = () => async (dispatch) => {
  const res = await fetch(`/api/spots`);

  if (res.ok) {
    const list = await res.json();
    dispatch(load(list));
    return list;
  }
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
        ...state,
        list: action.list.Spots,
      };
    }
    default:
      return state;
  }
};

export default spotsReducer;
