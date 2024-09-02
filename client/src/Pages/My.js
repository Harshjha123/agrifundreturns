import React, { useState, useEffect, useRef } from 'react'
import '../CSS/My.css'

import BottomNav from '../Components/BottomNav'

import MeOption from '../Arrays/MeOption.js'

import Icon from '../Icons/Icon.js'

import pic from '../Images/pic.webp';

import axios from 'axios'

import { useNavigate } from 'react-router-dom'
import Error from '../Components/Error.js'
import Loading from '../Components/Loading.js'

const My = ({ token }) => {
    const options = MeOption();

    const navigate = useNavigate();

    const [name, setName] = useState('XXXXXX XXX')
    const [phone, setPhone] = useState('+91 ******0012')

    const [balance, setBalance] = useState(0);
    const [income, setIncome]  = useState(0);
    const [commission, setCommission] = useState(0)

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

            setName(data.name)
            setPhone('+91' + data.phone)

            const bal = data.balance
            setBalance(bal.withdraw + bal.recharge)
            setCommission(bal.commission)
            setIncome(bal.income)

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
        <div className='me screen'>
            {isError && <Error errorMsg={errorText} />}
            {loader && <Loading />}

            <BottomNav page={'My'} />

            <div className="top">
                <div className="user__profile">
                    <div className="user__profile__left all-center">
                        <div className="user__pic">
                            <img src={pic} height={'100%'} alt="" />
                        </div>

                        <div className="user__detail">
                            <div className="user__name">{name}</div>
                            <div className="user__ph">{phone}</div>
                        </div>
                    </div>
                </div>

                <div className="user__balance">
                    <div className="col">
                        <center>
                            <div className="col__top">₹{balance.toLocaleString()}</div>
                            <div className="col__bottom">My balance</div>
                        </center>
                    </div>
                    <div className="col">
                        <center>
                            <div className="col__top">₹{income.toLocaleString()}</div>
                            <div className="col__bottom">My income</div>
                        </center>
                    </div>
                    <div className="col">
                        <center>
                            <div className="col__top">₹{commission.toLocaleString()}</div>
                            <div className="col__bottom">Commission</div>
                        </center>
                    </div>
                </div>
            </div>

            <div className="me__section element">
                <div className="section__col">
                    <div className="section__title">Quick Access</div>
                    <div className="options__container">
                        {options.map((item, index) => {
                            const si = (index + 1) % 4
                            const pi = 4 - si
                            const delay = index === 0 ? 0.3 : (0.15 * pi) + 0.3

                            return (
                                <div className="col sliding-from-left" style={{ animationDelay: `${delay}s`}} key={index} onClick={item.onClick}>
                                    <center>
                                        <Icon prop={item.name} />
                                        <div className="col__name">{item.name}</div>
                                    </center>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <br />

                <div className="section__col">
                    <div className="section__title sec">Service Center</div>

                    <div className="options__container2">
                        <div className="col">
                            <div className="col__left all-center">
                                <Icon prop={'Download'} />
                            </div>
                            <div className="col__right">
                                <div className="col__right__top">Download Our App</div>
                                <div className="col__right__bottom">Download the App and Stay Connected!</div>
                            </div>
                        </div>
                    </div>

                    <div className="options__container3">
                        <div className="col">
                            <div className="col__left all-center">
                                <Icon prop={'Support'} />
                            </div>
                            <div className="col__right">
                                <div className="col__right__top">Support</div>
                                <div className="col__right__bottom">Get help anytime</div>
                            </div>
                        </div>

                        <div className="col">
                            <div className="col__left all-center">
                                <Icon prop={'Telegram'} />
                            </div>
                            <div className="col__right">
                                <div className="col__right__top">Join Telegram</div>
                                <div className="col__right__bottom">Connect on Telegram</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default My