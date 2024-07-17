//frontend/src/components/SpotCard/SpotCard.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Form, useNavigate, useParams } from "react-router-dom";
import { getSpotsOneThunk, insertSpot } from "../../store/spots";
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

            console.log('SpotImages = ', spotsObj?.SpotImages || [])
            console.log('typeof(spotsObj.SpotImages)', typeof (spotsObj.SpotImages))

            if (spotsObj.SpotImages) {
                console.log('SpotImages[1] = ', spotsObj?.SpotImages[1] || [])
                console.log('image1 = ', image1)

                console.log('SpotImages[2] = ', spotsObj?.SpotImages[2] || [])
                console.log('image2 = ', image2)

                console.log('SpotImages[3] = ', spotsObj?.SpotImages[3] || [])
                console.log('image3 = ', image3)
            }

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

        // console.log('clickedSubmitBtn = ', clickedSubmitBtn)
        if (clickedSubmitBtn) {
            setErrors(newErrors)
        }

        // console.log(errors, "errors")

    }, [form, clickedSubmitBtn])



    const updateSetForm = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }))
        // console.log(form, "form")
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setClickedSubmitBtn(true);
        // if (hasError) return

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

        console.log('form', form)

        const submit = async () => {
            // console.log('111')
            const newSpotId = await insertSpot({
                body,
                previewImageURL,
                sideImageURLs
            });
            // console.log('222')
            // console.log('newSpotId = ', newSpotId)
            nav(`/spots/${newSpotId}`);
            // console.log('333')
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
            // console.log('111')
            const newSpotId = await insertSpot({
                body,
                previewImageURL,
                sideImageURLs
            });
            nav(`/spots/${newSpotId}`);
        }
        submit();
    }





    return (
        <form className="spotForm">
            <h3>Update your Spot ....  spotId = {spotId}</h3>
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
                value={form.country}
            />

            <label>
                Street Address {errors.address && <span style={{ color: 'red' }}>{errors.address}</span>}
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
                        City {errors.city && <span style={{ color: 'red' }}>{errors.city}</span>}
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
                        State {errors.state && <span style={{ color: 'red' }}>{errors.state}</span>}
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
                        Latitude {errors.lat && <span style={{ color: 'red' }}>{errors.lat}</span>}
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
                        Longitude {errors.lng && <span style={{ color: 'red' }}>{errors.lng}</span>}
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
            {errors.description && <span style={{ color: 'red' }}>{errors.description}</span>}

            <hr />

            <h4>Create a title for your spot</h4>
            <p>Catch guests' attention with a spot title that highlights what makes your place special</p>
            <input
                type="text"
                name="title"
                onChange={updateSetForm}
                placeholder="Name of your spot"
                value={form.description}
            />
            {errors.title && <span style={{ color: 'red' }}>{errors.name}</span>}

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
            {errors.price && <span style={{ color: 'red' }}>{errors.price}</span>}

            <hr />

            <h4>Liven up your spot with photos</h4>
            <p>Submit a link to at least one photo to publish your spot</p>
            <input
                type="text"
                name="previewImageURL"
                onChange={updateSetForm}
                placeholder="Preview Image URL"
                value={form.previewImageURL}
            />
            {errors.previewImageURL && <span style={{ color: 'red' }}>{errors.previewImageURL}</span>}

            <input
                type="text"
                name="image2URL"
                onChange={updateSetForm}
                placeholder="Image URL"
                value={form.image2URL}
            />
            {errors.image2URL && <span style={{ color: 'red' }}>{errors.image2URL}</span>}

            <input
                type="text"
                name="image3URL"
                onChange={updateSetForm}
                placeholder="Image URL"
                value={form.image3URL}
            />
            {errors.image3URL && <span style={{ color: 'red' }}>{errors.image3URL}</span>}

            <input
                type="text"
                name="image4URL"
                onChange={updateSetForm}
                placeholder="Image URL"
                value={form.image4URL}
            />
            {errors.image4URL && <span style={{ color: 'red' }}>{errors.image4URL}</span>}

            <input
                type="text"
                name="image5URL"
                onChange={updateSetForm}
                placeholder="Image URL"
                value={form.image5URL}
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

export default SpotFormUpdater;
