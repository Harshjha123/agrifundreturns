import React, { useState } from 'react'
import '../CSS/Login.css'

import axios from 'axios';

import { IoKey } from "react-icons/io5";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

import { useNavigate } from 'react-router-dom';

import Error from '../Components/Error';
import Loading from '../Components/Loading';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false)

    const [viewPass, setViewPass] = useState(false);

    const logo = 'https://cdn.prod.website-files.com/655c56e538f5e80d934ad103/65b0c29121dde3291bc4a665_logo-1-p-2000.png';

    const [loader, setLoader] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorText, setErrorText] = useState('');

    const displayError = (message) => {
        setIsError(true);
        setErrorText(message);

        const timerId = setTimeout(() => {
            setIsError(false);
            setErrorText('');
        }, 1500);

        return () => clearTimeout(timerId);
    };

    async function onLoginAcc() {
        if (!phone) return displayError('Please enter your phone number');

        if (phone.length !== 10 || isNaN(phone)) return displayError('Please enter a valid phone number');

        if (!password) return displayError('Please enter a password');

        if (password.length < 6) return displayError('Password is less than 6 characters');

        setLoader(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER}/user/login`, {
                phone,
                password
            });

            let data = response.data;
            const token = data.token;
            localStorage.setItem('token', token);

            onLogin(token)
            setLoader(false);
            setSuccess(true)

            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            setLoader(false);

            let err = error.response?.data?.message || 'Login Failed'
            displayError(err)
        }
    }

    return (
        <div className='login'>
            {isError && <Error errorMsg={errorText} />}
            {loader && <Loading />}

            <div className="top">
                <div className={success ? "app__logo sliding-to-left2" : "app__logo sliding-from-left2"}>
                    <img src={logo} height="45" alt="" />
                </div>

                <div className="top__txt">
                    <div className={success ? "txt1 sliding-to-left2" : "txt1 sliding-from-left2"} style={{ transform: 'translateX(-100vw)', animationDelay: '0.25s' }}>Welcome back,</div>
                    <div className={success ? "txt3 sliding-to-left2" : "txt3 sliding-from-left"} style={{ transform: 'translateX(-100vw)', animationDelay: '0.7s' }}>Many rewards are waiting for you to collect!</div>
                </div>
            </div>

            <div className={success ? "form element2" : "form element"} style={{ animationDelay: success ? '0.8s' : '0s'}}>
                <div className="title">Login Account</div>

                <div className="col">
                    <div className="col__title">Phone No.</div>
                    <div className="form__input">
                        <div className="input__left all-center">+91</div>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={10} placeholder='Please enter your phone number' />
                    </div>
                </div>

                <div className="col">
                    <div className="col__title">Password</div>
                    <div className="form__input">
                        <div className="input__left icon all-center">
                            <IoKey />
                        </div>
                        <input type={viewPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Please enter your password' />
                        <div className="eye__btn all-center" onClick={() => setViewPass(!viewPass)}>
                            {viewPass ? <IoIosEyeOff /> : <IoIosEye />}
                        </div>
                    </div>
                </div>

                <button className="login__btn" onClick={onLoginAcc}>Sign In</button>
                <div className="red__link">Don't have an account? <span onClick={() => navigate('/user/register')}>Register Now</span></div>
            </div>
        </div>
    )
}

export default Login