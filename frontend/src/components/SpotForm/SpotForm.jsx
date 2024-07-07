//frontend/src/components/SpotCard/SpotCard.jsx
import "./SpotForm.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


function SpotForm() {

    const [form, setForm] = useState({});
    const [errors, setErros] = useState({})

    const updateSetForm = (e) => {
        console.log("updated")
    }

    return (

        <form className="spotForm">

            <h3>Create a new Spot</h3>
            <br />
            <h4>Where's your place located?</h4>
            <p>Guests will only get your exact address once the booked a reservation.</p>
            <br />

            <label>Country</label>
            <input
                type="text"
                name="country"
                onChange={updateSetForm}
                placeholder="Country"
            />

            <label>Street Address</label>
            <input
                type="text"
                name="address"
                onChange={updateSetForm}
                placeholder="Address"
            />

            <div className="horizontal">
                <div className="vertical">
                    <label>City</label>
                    <input
                        type="text"
                        name="city"
                        onChange={updateSetForm}
                        placeholder="City"
                    />
                </div>
                <div className="vertical">
                    <label>State</label>
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
                    <label>Latitude</label>
                    <input
                        type="text"
                        name="latitude"
                        onChange={updateSetForm}
                        placeholder="Latitude"
                    />
                </div>
                <div className="vertical">
                    <label>Longitude</label>
                    <input
                        type="text"
                        name="longitude"
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

            <hr />

            <h4>Create a title for your spot</h4>
            <p>Catch guests' attention with a spot title that highlights what makes your place special</p>
            <input
                type="text"
                name="name"
                onChange={updateSetForm}
                placeholder="Name of your spot"
            />

            <hr />

            <h4>Set a base price for your spot</h4>
            <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
            <input
                type="text"
                name="price"
                onChange={updateSetForm}
                placeholder="Price per night (USD)"
            />

            <hr />

            <h4>Liven up your spot with photos</h4>
            <p>Submit a link to at least one photo to publish your spot</p>
            <input
                type="text"
                name="previewImage"
                onChange={updateSetForm}
                placeholder="Preview Image URL"
            />

            <input
                type="text"
                name="image2"
                onChange={updateSetForm}
                placeholder="Image URL"
            />

            <input
                type="text"
                name="image3"
                onChange={updateSetForm}
                placeholder="Image URL"
            />

            <input
                type="text"
                name="image4"
                onChange={updateSetForm}
                placeholder="Image URL"
            />

            <input
                type="text"
                name="image5"
                onChange={updateSetForm}
                placeholder="Image URL"
            />

            <hr />

            <button
                type="submit"
                disabled={Object.keys(errors).length !== 0}
            >
                Create Spot
            </button>




        </form>
    )
}

export default SpotForm;