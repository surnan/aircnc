//frontend/src/components/SpotCard/SpotCard.jsx
import "./SpotForm.css"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { insertSpot } from "../../store/spots";


function SpotForm() {
    const nav = useNavigate();

    const dispatch = useDispatch();

    const [form, setForm] = useState({
        Country: '',
        Address: '',
        City: '',
        State: '',
        Latitude: '',
        Longitude: '',
        description: '',
        Name: '',
        Price: '',
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

        const allKeys = ["Country", "Address", "City", "State", "Name", "Price", "previewImageURL", "Latitude", "Longitude"];
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
            const { Address, City, State, Country, Latitude, Longitude, description, Price, previewImageURL } = form;

            // const body = {
            //     Address,
            //     City,
            //     State,
            //     Country,
            //     Latitude: parseFloat(Latitude),
            //     Longitude: parseFloat(Longitude),
            //     name: form.Name,
            //     description,
            //     Price: parseInt(Price),
            //     previewImageURL
            //      image2URL: "https://via.placeholder.com/300.jpg",
            //      image3URL: "https://via.placeholder.com/300.jpg",
            //      image4URL: "https://via.placeholder.com/300.jpg",
            //      image5URL: "https://via.placeholder.com/300.jpg"
            // };

            const body = {
                Address: "asdf1",
                City: "asd1",
                State: "asdf1",
                Country: "asdf1",
                Latitude: 40.82595377239568,
                Longitude: 40.82595377239568,
                name: "asdf1",
                description: "asdf1",
                Price: 100.00,
                previewImageURL: "https://via.placeholder.com/300.jpg",
                image2URL: "https://via.placeholder.com/300.jpg",
                image3URL: "https://via.placeholder.com/300.jpg",
                image4URL: "https://via.placeholder.com/300.jpg",
                image5URL: "https://via.placeholder.com/300.jpg"
            };

            console.log(body, "body")
            dispatch(insertSpot(body));
            console.log('handleSubmit - c')
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <form className="spotForm">
            <h3>Create a new Spot</h3>
            <br />
            <h4>Where's your place located?</h4>
            <p>Guests will only get your exact Address once the booked a reservation.</p>
            <br />

            <label>
                Country {errors.Country && <span className="error">{errors.Country}</span>}
            </label>
            <input
                type="text"
                name="Country"
                onChange={updateSetForm}
                placeholder="Country"
            />

            <label>
                Street Address {errors.Address && <span className="error">{errors.Address}</span>}
            </label>
            <input
                type="text"
                name="Address"
                onChange={updateSetForm}
                placeholder="Address"
            />

            <div className="horizontal">
                <div className="vertical">
                    <label>
                        City {errors.City && <span className="error">{errors.City}</span>}
                    </label>
                    <input
                        type="text"
                        name="City"
                        onChange={updateSetForm}
                        placeholder="City"
                    />
                </div>
                <div className="vertical">
                    <label>
                        State {errors.State && <span className="error">{errors.State}</span>}
                    </label>
                    <input
                        type="text"
                        name="State"
                        onChange={updateSetForm}
                        placeholder="State"
                    />
                </div>
            </div>

            <div className="horizontal">
                <div className="vertical">
                    <label>
                        Latitudeitude {errors.Latitude && <span className="error">{errors.Latitude}</span>}
                    </label>
                    <input
                        type="text"
                        name="Latitude"
                        onChange={updateSetForm}
                        placeholder="Latitudeitude"
                    />
                </div>
                <div className="vertical">
                    <label>
                        Longitude {errors.Longitude && <span className="error">{errors.Longitude}</span>}
                    </label>
                    <input
                        type="text"
                        name="Longitude"
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
            {errors.description && <span className="error">{errors.description}</span>}

            <hr />

            <h4>Create a title for your spot</h4>
            <p>Catch guests' attention with a spot title that highlights what makes your place special</p>
            <input
                type="text"
                name="Name"
                onChange={updateSetForm}
                placeholder="Name of your spot"
            />
            {errors.Name && <span className="error">{errors.Name}</span>}

            <hr />

            <h4>Set a base price for your spot</h4>
            <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
            <input
                type="text"
                name="Price"
                onChange={updateSetForm}
                placeholder="Price per night (USD)"
            />
            {errors.Price && <span className="error">{errors.Price}</span>}

            <hr />

            <h4>Liven up your spot with photos</h4>
            <p>Submit a link to at least one photo to publish your spot</p>
            <input
                type="text"
                name="previewImageURL"
                onChange={updateSetForm}
                placeholder="Preview Image URL"
            />
            {errors.previewImageURL && <span className="error">{errors.previewImageURL}</span>}

            <input
                type="text"
                name="image2URL"
                onChange={updateSetForm}
                placeholder="Image URL"
            />
            {errors.image2URL && <span className="error">{errors.image2URL}</span>}

            <input
                type="text"
                name="image3URL"
                onChange={updateSetForm}
                placeholder="Image URL"
            />
            {errors.image3URL && <span className="error">{errors.image3URL}</span>}

            <input
                type="text"
                name="image4URL"
                onChange={updateSetForm}
                placeholder="Image URL"
            />
            {errors.image4URL && <span className="error">{errors.image4URL}</span>}

            <input
                type="text"
                name="image5URL"
                onChange={updateSetForm}
                placeholder="Image URL"
            />
            {errors.image5URL && <span className="error">{errors.image5URL}</span>}

            <hr />

            <button 
                className = "submitButton"
                type="submit"
                // disabled={Object.keys(errors).length !== 0}
                onClick={handleSubmit}
                
            >
                Create Spot
            </button>
        </form>
    )
}

export default SpotForm;