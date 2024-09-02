import React, { useState } from 'react'

import axios from 'axios'

import { IoKey } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi2";
import { RiUserFill } from "react-icons/ri";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

import { useNavigate } from 'react-router-dom';

import Error from '../Components/Error';
import Loading from '../Components/Loading';

const Register = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [inviteCode, setInviteCode] = useState('');

    const [success, setSuccess] = useState(false)

    const [viewPass, setViewPass] = useState(false)

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

    async function onRegisterAcc() {
        if (!name) return displayError('Please enter your name');

        if (!phone) return displayError('Please enter your phone number');

        if (phone.length !== 10 || isNaN(phone)) return displayError('Please enter a valid phone number');

        if (!password) return displayError('Please enter a password');

        if (password.length < 6) return displayError('Password is less than 6 characters');

        setLoader(true);

        try {
            await axios.post(`${process.env.REACT_APP_SERVER}/user/register`, {
                phone,
                password,
                inviteCode,
                name
            });

            setLoader(false);
            setIsError(true);
            setErrorText('Registration Successful');

            setTimeout(() => {
                navigate('/user/login');
            }, 1000);
        } catch (error) {
            setLoader(false);

            let err = error.response?.data?.message || 'Registration Failed'
            displayError(err)
        }
    }

    return (
        <div className='login'>
            {isError && <Error errorMsg={errorText} />}
            {loader && <Loading />}

            <div className="top">
                <div className="app__logo">
                    <img src={logo} height="45" alt="" />
                </div>

                <div className="top__txt">
                    <div className="txt1">Register to win rewards,</div>
                    <div className="txt2">Invite friends to earn more cash!</div>
                </div>
            </div>

            <div className="form element">
                <div className="title">Register Account</div>

                <div className="col">
                    <div className="col__title">Name</div>
                    <div className="form__input">
                        <div className="input__left all-center icon">
                            <RiUserFill />
                        </div>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Please enter your name' />
                    </div>
                </div>

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

                <div className="col">
                    <div className="col__title">Invitation code</div>
                    <div className="form__input">
                        <div className="input__left all-center icon">
                            <HiUserGroup />
                        </div>
                        <input type='text' value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder='Enter invitation code' />
                    </div>
                </div>

                <button className="login__btn" onClick={onRegisterAcc}>Sign Up</button>
                <div className="red__link">Already have an account? <span onClick={() => navigate('/user/login')}>Login Now</span></div>
            </div>
        </div>
    )
}

export default Register