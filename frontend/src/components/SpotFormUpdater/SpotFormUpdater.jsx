//frontend/src/components/SpotCard/SpotCard.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { getSpotsOneThunk, updateSpotThunk } from "../../store/spots";
import "./SpotFormUpdater.css"

function SpotFormUpdater() {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spotsObj = useSelector(state => state.spots.single)

    const [form, setForm] = useState({
        country: '',
        address: '',
        city: '',
        state: '',
        lat: '',
        lng: '',
        description: '',
        title: '',
        price: '',
        previewImageURL: '',
        image2URL: '',
        image3URL: '',
        image4URL: '',
        image5URL: ''
    });

    useEffect(() => {
        if (!isNaN(parseInt(spotId))) {
            dispatch(getSpotsOneThunk(spotId))
        }
    }, [dispatch, spotId]);

    useEffect(() => {
        if (spotsObj) {
            const [image1, image2, image3, image4, image5] = spotsObj?.SpotImages || [];

            setForm({
                country: spotsObj.country || '',
                address: spotsObj.address || '',
                city: spotsObj.city || '',
                state: spotsObj.state || '',
                lat: spotsObj.lat || '',
                lng: spotsObj.lng || '',
                description: spotsObj.description || '',
                title: spotsObj.name || '',
                price: spotsObj.price || '',
                previewImageURL: image1?.url || '',
                image2URL: image2?.url || '',
                image3URL: image3?.url || '',
                image4URL: image4?.url || '',
                image5URL: image5?.url || ''
            });
        }
    }, [spotsObj]);

    const [errors, setErrors] = useState({})
    const [clickedSubmitBtn, setClickedSubmitBtn] = useState(false);
    const hasError = () => (Object.keys(errors).length !== 0)

    useEffect(() => {
        const newErrors = {};
        const { description } = form;
        const allKeys = ["country", "address", "city", "state", "title", "price", "previewImageURL", "lat", "lng"];
        const allImageLinks = ["previewImageURL", "image2URL", "image3URL", "image4URL", "image5URL"]
        const goodImgExt = ["jpg", "jpeg", "png"]

        for (let key of allKeys) {
            if (!form[key]) {
                newErrors[key] = capitalizeFirstLetter(`${key} is required`);
            }
        }

        if (!form["lat"]) { newErrors.lat = "Latitude is required" }
        if (!form["lng"]) { newErrors.lng = "Longitude is required" }

        if (description.length < 30) {
            newErrors.description = "Description needs a minimum of 30 characters"
        }

        for (let key of allImageLinks) {
            if (form[key]) {
                const keyArr = form[key].split('.');
                const ext = keyArr.at(-1).toLowerCase();

                if (!goodImgExt.includes(ext))
                    newErrors[key] = `Image URL must end in .png, .jpg, or .jpeg`;
            }
        }

        if (clickedSubmitBtn) {
            setErrors(newErrors)
        }

    }, [form, clickedSubmitBtn])

    const updateSetForm = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setClickedSubmitBtn(true);

        const { address, city, state, country, lat, lng, description, price, previewImageURL } = form;
        const { image2URL, image3URL, image4URL, image5URL } = form;
        const sideImageURLs = [image2URL, image3URL, image4URL, image5URL];
        const body = {
            address,
            city,
            state,
            country,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            name: form.title,
            description,
            price: parseInt(price)
        }


        const submit = async () => {
            try {
                const newSpotId = await dispatch(updateSpotThunk(
                    {
                        body,
                        previewImageURL,
                        sideImageURLs,
                        spotId
                    }
                ));
                nav(`/spots/${newSpotId}`);
            } catch (error) {
                console.error('Error adding spot:', error);
            }
        }
        submit();
    }


    // const handleSubmitForce = async (e) => {
    //     e.preventDefault();

    //     const previewImageURL = 'https://via.placeholder.com/400.jpg'

    //     const sideImageURLs = [
    //         'https://via.placeholder.com/800x600.png',
    //         'https://via.placeholder.com/800x600.png',
    //         'https://via.placeholder.com/800x600.png',
    //         'https://via.placeholder.com/800x600.png'
    //     ];

    //     const body = {
    //         address: 'gasdf',
    //         city: 'GGGGGGGG',
    //         state: 'HHHHHHHH',
    //         country: 'IIIIIIII',
    //         lat: parseFloat('44.44'),
    //         lng: parseFloat('33.33'),
    //         name: "JJJJJ",
    //         description: "LLLLLLLLLLLLL",
    //         price: parseInt('999')
    //     }

    //     const submit = async () => {
    //         try {
    //             const newSpotId = await dispatch(updateSpotThunk(
    //                 {
    //                     body,
    //                     previewImageURL,
    //                     sideImageURLs,
    //                     spotId
    //                 }
    //             ));
    //             nav(`/spots/${newSpotId}`);
    //         } catch (error) {
    //             console.error('Error adding spot:', error);
    //         }
    //     }

    //     submit();
    // }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <form className="spotForm">
            <h3>Update your Spot</h3>
            <br />
            <h4>Where&#39;s your place located?</h4>
            <p>Guests will only get your exact address once the booked a reservation.</p>
            <br />

            <label>
                Country &#160;&#160;{errors.country && <span style={{ color: 'red' }}>{errors.country}</span>}
            </label>
            <input
                type="text"
                name="country"
                onChange={updateSetForm}
                placeholder="Country"
                value={form.country}
            />

            <label>
                Street Address &#160;&#160;{errors.address && <span style={{ color: 'red' }}>{errors.address}</span>}
            </label>
            <input
                type="text"
                name="address"
                onChange={updateSetForm}
                placeholder="Address"
                value={form.address}
            />

            <div className="horizontal">
                <div className="vertical">
                    <label>
                        City &#160;&#160;{errors.city && <span style={{ color: 'red' }}>{errors.city}</span>}
                    </label>
                    <input
                        type="text"
                        name="city"
                        onChange={updateSetForm}
                        placeholder="City"
                        value={form.city}
                    />
                </div>
                <div className="vertical">
                    <label>
                        State &#160;&#160;{errors.state && <span style={{ color: 'red' }}>{errors.state}</span>}
                    </label>
                    <input
                        type="text"
                        name="state"
                        onChange={updateSetForm}
                        placeholder="State"
                        value={form.state}
                    />
                </div>
            </div>

            <div className="horizontal">
                <div className="vertical">
                    <label>
                        Latitude &#160;&#160;{errors.lat && <span style={{ color: 'red' }}>{errors.lat}</span>}
                    </label>
                    <input
                        type="text"
                        name="lat"
                        onChange={updateSetForm}
                        placeholder="Latitude"
                        value={form.lat}
                    />
                </div>
                <div className="vertical">
                    <label>
                        Longitude &#160;&#160;{errors.lng && <span style={{ color: 'red' }}>{errors.lng}</span>}
                    </label>
                    <input
                        type="text"
                        name="lng"
                        onChange={updateSetForm}
                        placeholder="Longitude"
                        value={form.lng}
                    />
                </div>
            </div>

            <hr />

            <h4>Describe your place to guests</h4>
            <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
            <br />

            <textarea
                name="description"
                onChange={updateSetForm}
                placeholder="Description"
                value={form.description}
            />
            <span className="errorMessage">{errors.description || " "}</span>

            <hr />

            <h4>Create a title for your spot</h4>
            <p>Catch guests&#39; attention with a spot title that highlights what makes your place special</p>
            <input
                type="text"
                name="title"
                onChange={updateSetForm}
                placeholder="Name of your spot"
                value={form.title}
            />
            <span className="errorMessage">{errors.title || " "}</span>
            <hr />
            <h4>Set a base price for your spot</h4>
            <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
            <input
                type="text"
                name="price"
                onChange={updateSetForm}
                placeholder="Price per night (USD)"
                value={form.price}
            />
            <span className="errorMessage">{errors.price || " "}</span>
            <hr />
            <div className="formVerticalFlex">
                <h4>Liven up your spot with photos</h4>
                <p>Submit a link to at least one photo to publish your spot</p>
                <input
                    type="text"
                    name="previewImageURL"
                    onChange={updateSetForm}
                    placeholder="Preview Image URL"
                    value={form.previewImageURL}
                />
                <span className="errorMessage">{errors.previewImageURL || " "}</span>

                <input
                    type="text"
                    name="image2URL"
                    onChange={updateSetForm}
                    placeholder="Image URL"
                    value={form.image2URL}
                />

                <span className="errorMessage">{errors.image2URL || " "}</span>
                <input
                    type="text"
                    name="image3URL"
                    onChange={updateSetForm}
                    placeholder="Image URL"
                    value={form.image3URL}
                />

                <span className="errorMessage">{errors.image3URL || " "}</span>

                <input
                    type="text"
                    name="image4URL"
                    onChange={updateSetForm}
                    placeholder="Image URL"
                    value={form.image4URL}
                />
                <span className="errorMessage">{errors.image4URL || " "}</span>

                <input
                    type="text"
                    name="image5URL"
                    onChange={updateSetForm}
                    placeholder="Image URL"
                    value={form.image5URL}
                />

                <span className="errorMessage">{errors.image5URL || " "}</span>
            </div>
            <hr />

            <button
                type="submit"
                disabled={hasError()}
                onClick={handleSubmit}
                // className="formBtn submitButton"
                className={`formBtn submitButton ${!hasError() ? 'enabledButton' : ''}`}
            >
                Update Spot
            </button>

            <br />
            {/* <button
                type="submit"
                onClick={handleSubmitForce}
                className="formBtn submitButton"
            >
                FORCE CREATE SPOT
            </button> */}
        </form>
    )
}

export default SpotFormUpdater;
