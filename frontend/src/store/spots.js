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
    dispatch(addOneSpot(spot));
    return spot;
  }
};

export const createSpot = (spot) => async (dispatch) => {
  const spotPayload = {
    country: spot.country,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    lat: spot.lat,
    lng: spot.lng,
    price: spot.price,
    name: spot.name,
    description: spot.description,
  };
  const res = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spotPayload),
  });

  if (res.ok) {
    const data = await res.json();
    const spotId = data.id;
    const imagesArray = [];
    const isValidImageUrl = (obj) => obj.url && obj.url.trim() !== '';
    if (isValidImageUrl(spot.imageOne)) imagesArray.push(spot.imageOne);
    if (isValidImageUrl(spot.imageTwo)) imagesArray.push(spot.imageTwo);
    if (isValidImageUrl(spot.imageThree)) imagesArray.push(spot.imageThree);
    if (isValidImageUrl(spot.imageFour)) imagesArray.push(spot.imageFour);
    if (isValidImageUrl(spot.previewImage)) imagesArray.push(spot.previewImage);

    const uploadedImages = await Promise.all(
      imagesArray.map(async (image) => {
        const resImages = await csrfFetch(`/api/spots/${spotId}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(image),
        });
        return resImages.json();
      })
    );

    const newSpot = {
      ...data,
      previewImage: spot.previewImage.url,
      SpotImages: uploadedImages,
    };

    dispatch(addOneSpot(newSpot));
    return newSpot;
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
        ...state,
        ...allSpots,
        list: sortList(action.list.Spots),
      };
    }
    case ADD_ONE: {
      if (!state[action.spot.id]) {
        const newState = {
          ...state,
          [action.spot.id]: { ...action.spot },
        };

        const spotList = newState.list.map((id) => newState[id]);
        spotList.push(action.spot);
        newState.list = sortList(spotList);
        return newState;
      }

      const newSpot = {
        ...state,
        [action.spot.id]: { ...action.spot },
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
