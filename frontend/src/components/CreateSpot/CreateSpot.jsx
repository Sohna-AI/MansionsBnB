import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import validCountriesState from '../../utils/validData';
import './CreateSpot.css';
import { createSpot } from '../../store/spots';
import { createSpotImage } from '../../store/spotImages';

const CreateSpot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    country: '',
    address: '',
    city: '',
    state: '',
    lat: '',
    lng: '',
    description: '',
    name: '',
    price: '',
    previewImage: '',
    imageOne: '',
    imageTwo: '',
    imageThree: '',
    imageFour: '',
  });

  const [formErrors, setFormErrors] = useState({
    country: '',
    address: '',
    city: '',
    state: '',
    lat: '',
    lng: '',
    description: '',
    name: '',
    price: '',
    previewImage: '',
    imageOne: '',
    imageTwo: '',
    imageThree: '',
    imageFour: '',
  });

  const [touchedFields, setTouchedFields] = useState({
    country: false,
    address: false,
    city: false,
    state: false,
    lat: false,
    lng: false,
    description: false,
    name: false,
    price: false,
    previewImage: false,
    imageOne: false,
    imageTwo: false,
    imageThree: false,
    imageFour: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setTouchedFields({ ...touchedFields, [name]: true });
  };

  const isValidUrl = (url) => {
    const lowUrl = url.toLowerCase();

    return lowUrl.endsWith('.png') || lowUrl.endsWith('.jpg') || lowUrl.endsWith('.jpeg');
  };

  useEffect(() => {
    const errors = {};

    if (touchedFields.country && !formData.country) {
      errors.country = 'Country is required';
    }
    if (touchedFields.state && !formData.state) {
      errors.state = 'State is required';
    }
    if (touchedFields.address && !formData.address.trim()) {
      errors.address = 'Address is required';
    }
    if (touchedFields.city && !formData.city.trim()) {
      errors.city = 'City is required';
    }
    if (touchedFields.lat && (!formData.lat.trim() || formData.lat < -90 || formData.lat > 90)) {
      errors.lat = 'Latitude is not valid';
    }
    if (touchedFields.lng && (!formData.lng.trim() || formData.lng < -180 || formData.lng > 180)) {
      errors.lng = 'Longitude is not valid';
    }
    if (touchedFields.description && (!formData.description.trim() || formData.description.length < 30)) {
      errors.description = 'Description needs a minimum of 30 characters';
    }
    if (touchedFields.name && !formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (touchedFields.price && !formData.price.trim()) {
      errors.price = 'Price is required';
    }
    if (touchedFields.previewImage && !formData.previewImage.trim()) {
      errors.previewImage = 'Preview image URL is required';
    } else if (touchedFields.previewImage && !isValidUrl(formData.previewImage)) {
      errors.previewImage = 'Preview image URL must end in .png, .jpg, or .jpeg';
    }
    if (touchedFields.imageOne && formData.imageOne.trim() && !isValidUrl(formData.imageOne)) {
      errors.imageOne = 'Image URL must end in .png, .jpg, or .jpeg';
    }
    if (touchedFields.imageTwo && formData.imageTwo.trim() && !isValidUrl(formData.imageTwo)) {
      errors.imageTwo = 'Image URL must end in .png, .jpg, or .jpeg';
    }
    if (touchedFields.imageThree && formData.imageThree.trim() && !isValidUrl(formData.imageThree)) {
      errors.imageThree = 'Image URL must end in .png, .jpg, or .jpeg';
    }
    if (touchedFields.imageFour && formData.imageFour.trim() && !isValidUrl(formData.imageFour)) {
      errors.imageFour = 'Image URL must end in .png, .jpg, or .jpeg';
    }

    setFormErrors(errors);
  }, [formData, touchedFields]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const spotPayload = {
      country: formData.country,
      state: formData.state,
      address: formData.address,
      city: formData.city,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      lat: formData.lat,
      lng: formData.lng,
    };
    let createdSpot = await dispatch(createSpot(spotPayload));
    console.log(createSpot);

    const spotPreviewImagePayload = {
      url: formData.previewImage,
      preview: true,
    };
    let previewImage = await dispatch(createSpotImage(spotPreviewImagePayload, createdSpot.id));

    const imagesPayload = [
      { url: formData.imageOne.trim(), preview: false },
      { url: formData.imageTwo.trim(), preview: false },
      { url: formData.imageThree.trim(), preview: false },
      { url: formData.imageFour.trim(), preview: false },
    ].filter((image) => image.url && isValidUrl(image.url));

    const imagePromise = imagesPayload.map(async (image) => {
      await dispatch(createSpotImage(image, createdSpot.id));
    });

    const createdImages = await Promise.all(imagePromise);
    const formValid = Object.values(formErrors).every((error) => !error);

    if (formValid) {
      if (createdSpot && previewImage && createdImages.every((image) => image)) {
        navigate(`/spots/${createdSpot.id}`);
      } else console.log('Failed');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="create-spot-page-container">
          <div className="create-spot-page">
            <div className="create-spot-heading">
              <h1>Create a new Spot</h1>
            </div>
            <div className="where-located-container">
              <h3>Where&apos;s your place located?</h3>
              <h5>Guests will only get your exact address once they booked a reservation</h5>
            </div>
            <div className="create-spot-address-container">
              <div className="create-spot-country" id="input-group">
                <div className="country-container">
                  <label htmlFor="country" className="label">
                    Country
                  </label>
                  {touchedFields.country && formErrors.country && (
                    <p className="error">{formErrors.country}</p>
                  )}
                </div>
                <select value={formData.country} onChange={handleInputChange} name="country" id="input">
                  <option value="">Select a Country</option>
                  {validCountriesState.map((country) => (
                    <option key={country.country} value={country.country}>
                      {country.country}
                    </option>
                  ))}
                </select>
              </div>
              <div className="create-spot-street-address" id="input-group">
                <div className="street-address-container">
                  <label htmlFor="street address" className="label">
                    Street Address
                  </label>
                  {touchedFields.address && formErrors.address && (
                    <p className="error">{formErrors.address}</p>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Address"
                  id="input"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="create-spot-city-state-container">
                <div className="create-spot-city" id="input-group">
                  <div className="city-container">
                    <label htmlFor="city" className="label">
                      City
                    </label>
                    {touchedFields.city && formErrors.city && <p className="error">{formErrors.city}</p>}
                  </div>
                  <input
                    type="text"
                    placeholder="City"
                    id="input"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="create-spot-state" id="input-group">
                  <div className="state-container">
                    <label htmlFor="state" className="label">
                      State
                    </label>
                    {touchedFields.state && formErrors.state && <p className="error">{formErrors.state}</p>}
                  </div>
                  <select value={formData.state} onChange={handleInputChange} name="state" id="input">
                    <option value="">Select a State</option>
                    {validCountriesState
                      .find((countries) => countries.country === formData.country)
                      ?.states.map((state) => (
                        <option value={state} key={state}>
                          {state}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="create-spot-lat-lng-container">
                <div className="create-spot-latitude" id="input-group">
                  <div className="latitude-container">
                    <label htmlFor="latitude" className="label">
                      Latitude
                    </label>
                    {touchedFields.lat && formErrors.lat && <p className="error">{formErrors.lat}</p>}
                  </div>
                  <input
                    type="number"
                    placeholder="Latitude"
                    id="input"
                    name="lat"
                    value={formData.lat}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="create-spot-longitude" id="input-group">
                  <div className="longitude-container">
                    <label htmlFor="longitude" className="label">
                      Longitude
                    </label>
                    {touchedFields.lng && formErrors.lng && <p className="error">{formErrors.lng}</p>}
                  </div>
                  <input
                    type="number"
                    placeholder="Longitude"
                    id="input"
                    name="lng"
                    value={formData.lng}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="create-spot-other-info-container">
              <div className="create-spot-description-container">
                <h3>Describe your place to guests</h3>
                <h5>
                  Mention the best features of your space, any special amentities like
                  <br /> fast wifi or parking, and what you love about the neighborhood.
                </h5>
                <div className="input-group">
                  <div className="description-container">
                    <label htmlFor="description" className="label">
                      Description
                    </label>
                    {touchedFields.description && formErrors.description && (
                      <p className="error">{formErrors.description}</p>
                    )}
                  </div>
                  <textarea
                    name="description"
                    id="input-textarea"
                    rows="10"
                    cols="63"
                    placeholder="Please write at least 30 characters"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
              <div className="create-spot-title-container">
                <h3>Create a title for your spot</h3>
                <h5>
                  Catch guests&apos; attention with a spot title that highlights what makes your place
                  special.
                </h5>
                <div className="create-spot-title input-group">
                  <div className="name-container">
                    <label htmlFor="name" className="label">
                      Title
                    </label>
                    {touchedFields.name && formErrors.name && <p className="error">{formErrors.name}</p>}
                  </div>
                  <input
                    type="text"
                    id="input"
                    placeholder="Name of your spot"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="create-spot-price-container">
                <h3>Set a base price for your spot</h3>
                <h5>
                  Competitive pricing can help your listing stand out and rank higher in search results.
                </h5>
                <div className="create-spot-price input-group">
                  <div className="price-container">
                    <label htmlFor="price" className="label">
                      Price
                    </label>
                    {touchedFields.price && formErrors.price && <p className="error">{formErrors.price}</p>}
                  </div>
                  <div className="create-spot-price-input">
                    <input
                      type="number"
                      id="input"
                      className="price-input"
                      placeholder="Price per night (USD)"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="create-spot-images-container">
                <h3>Liven up your spot with photos</h3>
                <h5>Submit a link to at least one photo to publish your spot</h5>
                <div className="create-spot-preview-image-container">
                  <div className="create-spot-preview-image">
                    <label htmlFor="preview-image" className="label">
                      Preview Image URL
                    </label>
                    {touchedFields.previewImage && formErrors.previewImage && (
                      <p className="error">{formErrors.previewImage}</p>
                    )}
                    <input
                      type="text"
                      id="input"
                      placeholder="Preview Image URL"
                      name="previewImage"
                      value={formData.previewImage}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="create-spot-images input-group">
                    <label htmlFor="image" className="label">
                      Image URL <span>(Submit up to 4)</span>
                    </label>
                    <input
                      type="text"
                      id="input"
                      className="image-url"
                      placeholder="Image URL"
                      name="imageOne"
                      value={formData.imageOne}
                      onChange={handleInputChange}
                    />
                    {touchedFields.imageOne && formErrors.imageOne && (
                      <p className="error">{formErrors.imageOne}</p>
                    )}
                    <br />
                    <input
                      type="text"
                      id="input"
                      className="image-url"
                      placeholder="Image URL"
                      name="imageTwo"
                      value={formData.imageTwo}
                      onChange={handleInputChange}
                    />
                    {touchedFields.imageTwo && formErrors.imageTwo && (
                      <p className="error">{formErrors.imageTwo}</p>
                    )}
                    <br />
                    <input
                      type="text"
                      id="input"
                      className="image-url"
                      placeholder="Image URL"
                      name="imageThree"
                      value={formData.imageThree}
                      onChange={handleInputChange}
                    />
                    {touchedFields.imageThree && formErrors.imageThree && (
                      <p className="error">{formErrors.imageThree}</p>
                    )}
                    <br />
                    <input
                      type="text"
                      id="input"
                      className="image-url"
                      placeholder="Image URL"
                      name="imageFour"
                      value={formData.imageFour}
                      onChange={handleInputChange}
                    />
                    {touchedFields.imageFour && formErrors.imageFour && (
                      <p className="error">{formErrors.imageFour}</p>
                    )}
                    <br />
                  </div>
                  <div className="create-spot-button-container">
                    <button type="submit" className="create-spot-button">
                      Create Spot
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateSpot;
