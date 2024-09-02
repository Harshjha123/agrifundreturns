import React, { useState, useEffect, useRef } from 'react'
import '../CSS/Team.css';

import axios from 'axios';

import Header from '../Components/Header'
import Error from '../Components/Error';
import Loading from '../Components/Loading';

import { useNavigate } from 'react-router-dom';

const Team = ({ token }) => {
    const navigate = useNavigate();

    const logoSq = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJkGa_tThgjVcDug8Eoprry2xE-_6rc3PWKQ&s'

    const [records, setRecords] = useState([
        {
            user: 'Zalim Bhai',
            phone: '+91 ******7692',
            investments: 499,
            commission: 499 * 0.16,
            date: '2:06 AM, 31 Aug 2024'
        },
        {
            user: 'Zalim Bhai',
            phone: '+91 ******7692',
            investments: 499,
            commission: 499 * 0.16,
            date: '2:06 AM, 31 Aug 2024'
        }
    ])

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
            //getData();
            isFirstRun.current = false;
        }
    }, []);

    return (
        <div className='team screen'>
            {isError && <Error errorMsg={errorText} />}
            {loader && <Loading />}

            <Header name={'Lv1 Team Records'} />

            {records && records.length === 0 && <div className="no__data">
                <div className="no__data__text">No User Found!</div>
            </div>}

            <div className="records--container">
                {records && records.map((item, index) => {

                    return (
                        <div className="record--box" key={index}>
                            <div className="record--box--top">
                                <div className="user--details">
                                    <div className="user--details--left">
                                        <div className="user--pic">
                                            <img src={logoSq} height={'100%'} alt="" />
                                        </div>
                                    </div>

                                    <div className="user--details--right">
                                        <div className="user--name">{item.user}</div>
                                        <div className="user--ph">{item.phone}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="record--box--bottom">
                                <div className="col">
                                    <div className="col--left">User's Investment</div>
                                    <div className="col--right">{(item.investments).toFixed(2)} Rs</div>
                                </div>
                                <div className="col">
                                    <div className="col--left">My Commission</div>
                                    <div className="col--right">{(item.commission).toFixed(2)} Rs</div>
                                </div>
                                <div className="col">
                                    <div className="col--left">Registration Date</div>
                                    <div className="col--right">{item.date}</div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Team