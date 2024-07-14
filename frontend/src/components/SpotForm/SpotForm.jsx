//frontend/src/components/SpotCard/SpotCard.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { getSpotsOneThunk, insertSpot } from "../../store/spots";
import "./SpotForm.css"


function SpotForm() {
    const { spotId } = useParams();
    const nav = useNavigate();
    const dispatch = useDispatch();
    const updating = window.location.href.endsWith("edit");
    const spot = useSelector((state) => state.spots[spotId]);


    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [previewImageURL, setPreviewImage] = useState("");
    const [image2URL, setImage2URL] = useState("");
    const [image3URL, setImage3URL] = useState("");
    const [image4URL, setImage4URL] = useState("");
    const [image5URL, setImage5URL] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isNaN(parseInt(spotId))) {
            dispatch(fetchSpot(spotId));
        }
    }, [dispatch, spotId]);

    useEffect(() => {
        // Set imported numeric values to strings for consistent datatype
        setCountry(spot?.country ?? "");
        setAddress(spot?.address ?? "");
        setCity(spot?.city ?? "");
        setState(spot?.state ?? "");
        setLat(String(spot?.lat ?? ""));
        setLng(String(spot?.lng ?? ""));
        setDescription(spot?.description ?? "");
        setName(spot?.name ?? "");
        setPrice(String(spot?.price ?? ""));
        setPreviewImage(
            spot?.SpotImages?.find((e) => e.preview === true)?.url || "",
        );
        const sideImageURLs = spot?.SpotImages?.filter((e) => e.preview === false);
        if (sideImageURLs?.length) {
            setImage1(sideImageURLs[0]?.url || "");
            setImage2(sideImageURLs[1]?.url || "");
            setImage3(sideImageURLs[2]?.url || "");
            setImage4(sideImageURLs[3]?.url || "");
        }
    }, [spot]);



    const handleSubmitForce = async (e) => {
        e.preventDefault();
        try {

            const body = {
                address: "15 Times Square Circle",
                city: "New York",
                state: "NY",
                country: "USA",
                lat: 40.75810470018865,
                lng: -73.98543531365068,
                name: "Times Square",
                description: "asdf1",
                price: 100.00,
                previewImageURL: "https://via.placeholder.com/600.jpg",
                image2URL: "https://images.unsplash.com/photo-1503179008861-d1e2b41f8bec?q=80&w=1769&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                image3URL: "https://media.istockphoto.com/id/1182680589/photo/low-angle-view-of-many-advertising-signs-in-times-square-manhattan-new-york-city.jpg?s=2048x2048&w=is&k=20&c=-JHHhOXZBlE8z_1ZFNqp0rhNLNEyO0S1M_syuJnriMQ=",
                image4URL: "https://media.istockphoto.com/id/511030879/photo/times-square-new-york-city.jpg?s=2048x2048&w=is&k=20&c=6Y_xuCpoYQgAcwINQXhSzbfObd6zGPZ2pOfTsNi7MjQ=",
                image5URL: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Dice.png",
            };

            console.log(body, "body")
            dispatch(insertSpot(body));
            nav("/")
        } catch (e) {
            console.log(e)
        }
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
                // onChange={updateSetForm}
                placeholder="Country"
            />

            <label>
                Street Address {errors.address && <span style={{ color: 'red' }}>{errors.address}</span>}
            </label>
            <input
                type="text"
                name="address"
                // onChange={updateSetForm}
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
                        // onChange={updateSetForm}
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
                        // onChange={updateSetForm}
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
                        // onChange={updateSetForm}
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
                        // onChange={updateSetForm}
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
                // onChange={updateSetForm}
                placeholder="Description"
            />
            {errors.description && <span style={{ color: 'red' }}>{errors.description}</span>}

            <hr />

            <h4>Create a title for your spot</h4>
            <p>Catch guests' attention with a spot title that highlights what makes your place special</p>
            <input
                type="text"
                name="title"
                // onChange={updateSetForm}
                placeholder="Name of your spot"
            />
            {errors.title && <span style={{ color: 'red' }}>{errors.title}</span>}

            <hr />

            <h4>Set a base price for your spot</h4>
            <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
            <input
                type="text"
                name="price"
                // onChange={updateSetForm}
                placeholder="Price per night (USD)"
            />
            {errors.price && <span style={{ color: 'red' }}>{errors.price}</span>}

            <hr />

            <h4>Liven up your spot with photos</h4>
            <p>Submit a link to at least one photo to publish your spot</p>
            <input
                type="text"
                name="previewImageURL"
                // onChange={updateSetForm}
                placeholder="Preview Image URL"
            />
            {errors.previewImageURL && <span style={{ color: 'red' }}>{errors.previewImageURL}</span>}

            <input
                type="text"
                name="image2URL"
                // onChange={updateSetForm}
                placeholder="Image URL"
            />
            {errors.image2URL && <span style={{ color: 'red' }}>{errors.image2URL}</span>}

            <input
                type="text"
                name="image3URL"
                // onChange={updateSetForm}
                placeholder="Image URL"
            />
            {errors.image3URL && <span style={{ color: 'red' }}>{errors.image3URL}</span>}

            <input
                type="text"
                name="image4URL"
                // onChange={updateSetForm}
                placeholder="Image URL"
            />
            {errors.image4URL && <span style={{ color: 'red' }}>{errors.image4URL}</span>}

            <input
                type="text"
                name="image5URL"
                // onChange={updateSetForm}
                placeholder="Image URL"
            />
            {errors.image5URL && <span style={{ color: 'red' }}>{errors.image5URL}</span>}

            <hr />

            <button
                type="submit"
                disabled={Object.keys(errors).length !== 0}
            // onClick={handleSubmit}
            >
                Create Spot
            </button>

            <br />
            <button
                type="submit"
            disabled={Object.keys(errors).length !== 0}
            onClick={handleSubmitForce}
            >
                FORCE CREATE
            </button>
        </form>
    )






}

export default SpotForm;


/*
function SpotForm() {

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
        setErrors(newErrors)

        console.log(errors, "errors")

    }, [form])


    const updateSetForm = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }))
        console.log(form, "form")
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { address, city, state, country, lat, lng, description, price, previewImageURL } = form;
            const { image2URL, image3URL, image4URL, image5URL } = form;

            const body = {
                address,
                city,
                state,
                country,
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                name: form.title,
                description,
                price: parseInt(price),
                previewImageURL,
                image2URL,
                image3URL,
                image4URL,
                image5URL
            };

            console.log(body, "body")
            dispatch(insertSpot(body));
            nav("/")
        } catch (e) {
            console.log(e)
        }
    }


    const handleSubmitForce = async (e) => {
        e.preventDefault();
        try {

            const body = {
                address: "asdf1",
                city: "asd1",
                state: "asdf1",
                country: "asdf1",
                lat: 40.82595377239568,
                lng: 40.82595377239568,
                name: "asdf1",
                description: "asdf1",
                price: 100.00,
                previewImageURL: "https://via.placeholder.com/400.jpg",
                image2URL: "https://via.placeholder.com/400.jpg",
                image3URL: "https://via.placeholder.com/400.jpg",
                image4URL: "https://via.placeholder.com/400.jpg",
                image5URL: "https://via.placeholder.com/400.jpg",
            };

            console.log(body, "body")
            dispatch(insertSpot(body));
            nav("/")
        } catch (e) {
            console.log(e)
        }
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
                disabled={Object.keys(errors).length !== 0}
                onClick={handleSubmit}
            >
                Create Spot
            </button>

            <br />
            <button
                type="submit"
                // disabled={Object.keys(errors).length !== 0}
                onClick={handleSubmitForce}
            >
                FORCE CREATE
            </button>
        </form>
    )
}

export default SpotForm;
*/