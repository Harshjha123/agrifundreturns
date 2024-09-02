import React, { useState, useEffect, useRef  } from 'react'

import Header from '../Components/Header'
import Error from '../Components/Error';
import Loading from '../Components/Loading';

import { RiUserSmileLine } from "react-icons/ri";
import { PiUserListLight } from "react-icons/pi";

import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const Withdraw = ({ token }) => {
    const navigate = useNavigate();

    const methods = ['BANK', 'UPI', 'USDT'];

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

            <Header name={'Withdraw'} />

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
                    <div className="title">Withdraw Amount</div>
                    <div className="input__field" style={{ marginTop: 15 }}>
                        <div className="left all-center">₹</div>
                        <input type="number" placeholder='200 ~ 50000' />
                    </div>
                </div>

                <div className="sec" style={{ marginTop: 25 }}>
                    <div className="title">Withdraw Method</div>
                    <div className="options">
                        {methods.map((item, index) => {
                            return (
                                <div className="col all-center" key={index}>{item}</div>
                            )
                        })}
                    </div>
                </div>

                <div className="sec" style={{ marginTop: 20 }}>
                    <div className="title">Withdrawal Details</div>

                    <div className="input__field" style={{ marginTop: 10 }}>
                        <div className="left all-center" style={{ fontSize: 25}}>
                            <RiUserSmileLine />
                        </div>
                        <input type="text" placeholder='Enter UPI holder name' />
                    </div>

                    <div className="input__field" style={{ marginTop: 15 }}>
                        <div className="left all-center" style={{ fontSize: 25 }}>
                            <PiUserListLight />
                        </div>
                        <input type="text" placeholder='Enter UPI ID' />
                    </div>
                </div>

                <center>
                    <button className="recharge__btn">Withdraw</button>
                    <div className="si__txt">view records</div>
                </center>
            </div>
        </div>
    )
}

export default Withdraw