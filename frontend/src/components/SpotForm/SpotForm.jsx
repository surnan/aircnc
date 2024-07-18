//frontend/src/components/SpotCard/SpotCard.jsx
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
                newErrors[key] = `${key} is required`
            }
        }

        if (description.length < 3) {
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


    const handleSubmitForce = async (e) => {
        e.preventDefault();

        const previewImageURL = 'https://via.placeholder.com/400.jpg'

        const sideImageURLs = [
            'https://via.placeholder.com/600.jpg',
            'https://via.placeholder.com/600.jpg',
            'https://via.placeholder.com/600.jpg',
            'https://via.placeholder.com/600.jpg'
        ];



        const body = {
            address: 'asdf',
            city: 'asdf',
            state: 'asdf',
            country: 'asdf',
            lat: parseFloat('44.44'),
            lng: parseFloat('33.33'),
            name: "Abba",
            description: "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfsa",
            price: parseInt('123')
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

    return (
        <form className="spotForm">
            <h3>Create a new Spot</h3>
            <br />
            <h4>Where's your place located?</h4>
            <p>Guests will only get your exact address once the booked a reservation.</p>
            <br />

            <label>
                Country {errors.country && <span style={{ color: 'red' }}>{errors.country}</span>}
            </label>
            <input
                type="text"
                name="country"
                onChange={updateSetForm}
                placeholder="Country"
            />

            <label>
                Street Address {errors.address && <span style={{ color: 'red' }}>{errors.address}</span>}
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
                        City {errors.city && <span style={{ color: 'red' }}>{errors.city}</span>}
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
                        State {errors.state && <span style={{ color: 'red' }}>{errors.state}</span>}
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
                        Latitude {errors.lat && <span style={{ color: 'red' }}>{errors.lat}</span>}
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
                        Longitude {errors.lng && <span style={{ color: 'red' }}>{errors.lng}</span>}
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
            {errors.description && <span style={{ color: 'red' }}>{errors.description}</span>}

            <hr />

            <h4>Create a title for your spot</h4>
            <p>Catch guests' attention with a spot title that highlights what makes your place special</p>
            <input
                type="text"
                name="title"
                onChange={updateSetForm}
                placeholder="Name of your spot"
            />
            {errors.title && <span style={{ color: 'red' }}>{errors.title}</span>}

            <hr />

            <h4>Set a base price for your spot</h4>
            <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
            <input
                type="text"
                name="price"
                onChange={updateSetForm}
                placeholder="Price per night (USD)"
            />
            {errors.price && <span style={{ color: 'red' }}>{errors.price}</span>}

            <hr />

            <h4>Liven up your spot with photos</h4>
            <p>Submit a link to at least one photo to publish your spot</p>
            <input
                type="text"
                name="previewImageURL"
                onChange={updateSetForm}
                placeholder="Preview Image URL"
            />
            {errors.previewImageURL && <span style={{ color: 'red' }}>{errors.previewImageURL}</span>}

            <input
                type="text"
                name="image2URL"
                onChange={updateSetForm}
                placeholder="Image URL"
            />
            {errors.image2URL && <span style={{ color: 'red' }}>{errors.image2URL}</span>}

            <input
                type="text"
                name="image3URL"
                onChange={updateSetForm}
                placeholder="Image URL"
            />
            {errors.image3URL && <span style={{ color: 'red' }}>{errors.image3URL}</span>}

            <input
                type="text"
                name="image4URL"
                onChange={updateSetForm}
                placeholder="Image URL"
            />
            {errors.image4URL && <span style={{ color: 'red' }}>{errors.image4URL}</span>}

            <input
                type="text"
                name="image5URL"
                onChange={updateSetForm}
                placeholder="Image URL"
            />
            {errors.image5URL && <span style={{ color: 'red' }}>{errors.image5URL}</span>}

            <hr />

            <button
                type="submit"
                // disabled={Object.keys(errors).length !== 0}
                disabled={hasError()}
                onClick={handleSubmit}
            >
                Create Spot
            </button>

            <br />
            <button
                type="submit"
                onClick={handleSubmitForce}
            >
                FORCE CREATE
            </button>
        </form>
    )
}

export default SpotForm;




/*
//frontend/src/components/SpotCard/SpotCard.jsx
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
                newErrors[key] = `${key} is required`
            }
        }

        if (description.length < 3) {
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


    const handleSubmitForce = async (e) => {
        e.preventDefault();

        const previewImageURL = 'https://via.placeholder.com/400.jpg'

        const sideImageURLs = [
            'https://via.placeholder.com/600.jpg',
            'https://via.placeholder.com/600.jpg',
            'https://via.placeholder.com/600.jpg',
            'https://via.placeholder.com/600.jpg'
        ];



        const body = {
            address: 'asdf',
            city: 'asdf',
            state: 'asdf',
            country: 'asdf',
            lat: parseFloat('44.44'),
            lng: parseFloat('33.33'),
            name: "Abba",
            description: "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfsa",
            price: parseInt('123')
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

    return (
        <form className="spotForm">
            <h3>Create a new Spot</h3>
            <br />
            <h4>Where's your place located?</h4>
            <p>Guests will only get your exact address once the booked a reservation.</p>
            <br />

            <label>
                Country {errors.country && <span style={{ color: 'red' }}>{errors.country}</span>}
            </label>
            <input
                type="text"
                name="country"
                onChange={updateSetForm}
                placeholder="Country"
            />

            <label>
                Street Address {errors.address && <span style={{ color: 'red' }}>{errors.address}</span>}
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
                        City {errors.city && <span style={{ color: 'red' }}>{errors.city}</span>}
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
                        State {errors.state && <span style={{ color: 'red' }}>{errors.state}</span>}
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
                        Latitude {errors.lat && <span style={{ color: 'red' }}>{errors.lat}</span>}
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
                        Longitude {errors.lng && <span style={{ color: 'red' }}>{errors.lng}</span>}
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
            {errors.description && <span style={{ color: 'red' }}>{errors.description}</span>}

            <hr />

            <h4>Create a title for your spot</h4>
            <p>Catch guests' attention with a spot title that highlights what makes your place special</p>
            <input
                type="text"
                name="title"
                onChange={updateSetForm}
                placeholder="Name of your spot"
            />
            {errors.title && <span style={{ color: 'red' }}>{errors.title}</span>}

            <hr />

            <h4>Set a base price for your spot</h4>
            <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
            <input
                type="text"
                name="price"
                onChange={updateSetForm}
                placeholder="Price per night (USD)"
            />
            {errors.price && <span style={{ color: 'red' }}>{errors.price}</span>}

            <hr />

            <h4>Liven up your spot with photos</h4>
            <p>Submit a link to at least one photo to publish your spot</p>
            <input
                type="text"
                name="previewImageURL"
                onChange={updateSetForm}
                placeholder="Preview Image URL"
            />
            {errors.previewImageURL && <span style={{ color: 'red' }}>{errors.previewImageURL}</span>}

            <input
                type="text"
                name="image2URL"
                onChange={updateSetForm}
                placeholder="Image URL"
            />
            {errors.image2URL && <span style={{ color: 'red' }}>{errors.image2URL}</span>}

            <input
                type="text"
                name="image3URL"
                onChange={updateSetForm}
                placeholder="Image URL"
            />
            {errors.image3URL && <span style={{ color: 'red' }}>{errors.image3URL}</span>}

            <input
                type="text"
                name="image4URL"
                onChange={updateSetForm}
                placeholder="Image URL"
            />
            {errors.image4URL && <span style={{ color: 'red' }}>{errors.image4URL}</span>}

            <input
                type="text"
                name="image5URL"
                onChange={updateSetForm}
                placeholder="Image URL"
            />
            {errors.image5URL && <span style={{ color: 'red' }}>{errors.image5URL}</span>}

            <hr />

            <button
                type="submit"
                // disabled={Object.keys(errors).length !== 0}
                disabled={hasError()}
                onClick={handleSubmit}
            >
                Create Spot
            </button>

            <br />
            <button
                type="submit"
                onClick={handleSubmitForce}
            >
                FORCE CREATE
            </button>
        </form>
    )
}

export default SpotForm;

*/