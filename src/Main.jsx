import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Main.css';

function Main({ setData }) {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        const block = document.getElementById('dropdown').value;
        const dt = document.getElementById('date').value;
        const phone = document.getElementById('phone').value;
        const mail = document.getElementById('mail').value;
        const colour = document.querySelector('input[name="colour"]:checked').value;
        let amount = 0;

        formData.append('date', dt);
        formData.append('block', block);
        formData.append('phone', phone);
        formData.append('colour', colour);
        formData.append('mail', mail);

        const files = document.getElementsByName('files')[0].files;
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const response = await axios.post('http://localhost:4000/upload', formData);
            amount= response.data.amount;

        } catch (err) {
            console.error('Error during file upload:', err);
        }
        setData({
            block: block,
            date: dt,
            color: colour,
            amount: amount,
            mail: mail,
        });
        navigate('/payment');
    };

    const checkNum = () => {
        const phone = document.getElementById('phone').value;
        if (phone.length !== 10 || isNaN(phone)) {
            alert('Enter a valid Number');
        }
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="main">
                <div className="card">
                    <p>Enter Your Merged PDF's here:</p>
                    <input type="file" name="files" required/>
                    <div className="set">
                        <div className="date-in">
                            <h4>Select Date:</h4>
                            <input type="date" name="date" id="date" required />
                        </div>
                        <div className="date-in" onBlur={checkNum}>
                            <h4>Phone Number:</h4>
                            <input type="tel" name="phone" id="phone" required />
                        </div>
                        <div className="date-in">
                            <h4>Email:</h4>
                            <input type="email" name="mail" id="mail" required />
                        </div>
                        <div className="date-in">
                            Select Location:
                            <select name="dropdown" id="dropdown">
                                <option value="Block-A1">Block-A1</option>
                                <option value="Block-B1">Block-B1</option>
                                <option value="Block-C1" selected>Block-C1</option>
                                <option value="Block-D4">Block-D4</option>
                            </select>
                        </div>
                        <div className="date-in">
                            Colour Options:
                            <div className="colour-options">
                                <div className="colour">
                                    <input type="radio" name="colour" value="Colour" id="colour" />
                                    <label htmlFor="colour">Colour</label>
                                </div>
                                <div className="colour">
                                    <input type="radio" name="colour" value="Black & White" id="bw"/>
                                    <label htmlFor="bw">Black & White</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" name="submit">Go to Payment Option</button>
                </div>
            </div>
        </form>
    );
}

export default Main;
