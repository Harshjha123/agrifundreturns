import React, { useState, useEffect, useRef } from 'react'
import '../CSS/Recharge.css'

import Header from '../Components/Header'
import Error from '../Components/Error';
import Loading from '../Components/Loading';

import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const Recharge = ({ token }) => {
    const navigate = useNavigate();

    const methods = ['INR', 'USDT', 'TRX'];
    const amounts = [500, 1000, 3000, 8000, 15000, 30000, 50000]

    const [loader, setLoader] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorText, setErrorText] = useState('');

    const isFirstRun = useRef(true);

    const displayError = (message) => {
        setIsError(true);
        setErrorText(message);

        const timerId = setTimeout(() => {
            setIsError(false);
            setErrorText('');
        }, 1500);

        return () => clearTimeout(timerId);
    };

    const getData = async () => {
        setLoader(true);

        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER}/index/main`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = response.data;

            setLoader(false);
        } catch (error) {
            setLoader(false);
            const errorMessage = error.response?.data?.message || 'Failed to fetch data';

            if (error.response && error.response.data.logout === true) {
                localStorage.removeItem('token');

                navigate('/user/login');
                window.location.reload();
            }

            displayError(errorMessage);
        }
    };

    useEffect(() => {
        if (isFirstRun.current) {
            getData();
            isFirstRun.current = false;
        }
    }, []);

    return (
        <div className='recharge screen'>
            {isError && <Error errorMsg={errorText} />}
            {loader && <Loading />}

            <Header name={'Recharge'} />

            <div className="balance__box">
                <div className="col">
                    <div className="col__top">Available Balance</div>
                    <div className="col__bottom">₹71</div>
                </div>
                <div className="col">
                    <div className="col__top">My Deposit's</div>
                    <div className="col__bottom">₹0</div>
                </div>
            </div>

            <div className="main__section">
                <div className="sec">
                    <div className="title">Recharge Method</div>
                    <div className="options">
                        {methods.map((item, index) => {
                            return (
                                <div className="col all-center" key={index}>{item}</div>
                            )
                        })}
                    </div>
                </div>

                <div className="sec" style={{ marginTop: 25}}>
                    <div className="title">Quick Amount</div>
                    <div className="options">
                        {amounts.map((item, index) => {
                            return (
                                <div className="col all-center" key={index}>₹{item}</div>
                            )
                        })}
                    </div>
                </div>

                <div className="input__field">
                    <div className="left all-center">₹</div>
                    <input type="number" placeholder='500 ~ 50000' />
                </div>

                <center>
                    <button className="recharge__btn">Recharge</button>
                    <div className="si__txt">view records</div>
                </center>
            </div>
        </div>
    )
}

export default Recharge