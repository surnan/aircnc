//frontend/src/components/SpotForm/SpotForm.jsx
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { addSpotOneThunk } from "../../store/spots";
import "./SpotForm.css"

function SpotForm() {
    const nav = useNavigate();
    const dispatch = useDispatch();

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
                const newSpotId = await dispatch(addSpotOneThunk(
                    {
                        body,
                        previewImageURL,
                        sideImageURLs
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
    //         'https://via.placeholder.com/600.jpg',
    //         'https://via.placeholder.com/600.jpg',
    //         'https://via.placeholder.com/600.jpg',
    //         'https://via.placeholder.com/600.jpg'
    //     ];



    //     const body = {
    //         address: 'asdf',
    //         city: 'asdf',
    //         state: 'asdf',
    //         country: 'asdf',
    //         lat: parseFloat('44.44'),
    //         lng: parseFloat('33.33'),
    //         name: "Abba",
    //         description: "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfsa",
    //         price: parseInt('123')
    //     }

    //     const submit = async () => {
    //         try {
    //             const newSpotId = await dispatch(addSpotOneThunk(
    //                 {
    //                     body,
    //                     previewImageURL,
    //                     sideImageURLs
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
            <h3>Create a new Spot</h3>
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
            />

            <label>
                Street Address &#160;&#160;{errors.address && <span style={{ color: 'red' }}>{errors.address}</span>}
            </label>
            <input
                type="text"
                name="address"
                onChange={updateSetForm}
                placeholder="Address"
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
                />
                <span className="errorMessage">{errors.previewImageURL || " "}</span>

                <input
                    type="text"
                    name="image2URL"
                    onChange={updateSetForm}
                    placeholder="Image URL"
                />
            
                <span className="errorMessage">{errors.image2URL || " "}</span>
                <input
                    type="text"
                    name="image3URL"
                    onChange={updateSetForm}
                    placeholder="Image URL"
                />
            
                <span className="errorMessage">{errors.image3URL || " "}</span>
                <input
                    type="text"
                    name="image4URL"
                    onChange={updateSetForm}
                    placeholder="Image URL"
                />
            
                <span className="errorMessage">{errors.image4URL || " "}</span>

                <input
                    type="text"
                    name="image5URL"
                    onChange={updateSetForm}
                    placeholder="Image URL"
                />
            
                <span className="errorMessage">{errors.image5URL || " "}</span>
            </div>
            <hr />

            <button
                type="submit"
                disabled={hasError()}
                onClick={handleSubmit}
                className="formBtn submitButton"
            >
                Create Spot
            </button>

            <br />
            {/* <button
                type="submit"
                onClick={handleSubmitForce}
                className="formBtn submitButton"
            >
                FORCE CREATE
            </button> */}
        </form>
    )
}

export default SpotForm;


