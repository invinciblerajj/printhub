import React from 'react';
import './Payment.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Payment({data}) {
    const {block,date,color,amount} = data;
    const navigate = useNavigate();
    const handleClick = async () => {
        try {
            const response = await axios.post('http://localhost:4000/confirm');
            if(response.status === 200){
                alert('Order Confirmed');
                navigate('/');
            }
        } catch (err) {
            console.error('Error during file upload:', err);
        }
    };
    return (
        <div className="payment-container">
            <div className="payment-receipt">
                <div className="payment-options">
                    <h3>Payment Options</h3>
                    <div className="option">
                        <h4>COD</h4>
                        <p>Pay when the product is delivered to your doorstep.</p>
                    </div>
                    <hr />
                    <div className="option">
                            <h4>UPI</h4>
                            <p className="red">🚫 Currently Unavailable</p>
                            <p>Pay using your UPI ID for fast and secure transactions.</p>
                    </div>
                </div>
                <div className="payment-summary">
                    <h3>Summary</h3>
                    <p>Delivery Date: <strong>{date}</strong></p>
                    <p>Delivery Location: <strong>{block}</strong></p>
                    <p>Amount: <strong>₹{amount}.0</strong></p>
                    <p>Delivery Fee: <strong>₹5.0</strong></p>
                    <p>Colour: <strong>{color}</strong></p>
                    <p>Total: <strong>₹{amount+5}.0</strong></p>
                    <button className='payment-button' onClick={handleClick}> <strong>Confirm</strong></button>
                </div>
            </div>
        </div>
    );
}

export default Payment;
