import React, { useState, useEffect, useRef } from 'react'
import '../CSS/Investments.css'

import BottomNav from '../Components/BottomNav'

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Error from '../Components/Error';
import Loading from '../Components/Loading';

const Investments = ({ token }) => {
    const category = ['Active', 'Expired'];

    const [actCategory, setActCategory] = useState(category[0]);

    const navigate = useNavigate();

    const [records, setRecords] = useState([]);
    const [inv, setInv] = useState(0);
    const [ret, setRet] = useState(0)

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
            const response = await axios.get(`${process.env.REACT_APP_SERVER}/get/investments`, {
                params: { expired: actCategory === 'Expired' },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = response.data;
            setRecords(data.records || []);

            setRet(data.returns);
            setInv(data.investments)

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
    }, [actCategory]);

    return (
        <div className='inv screen'>
            {isError && <Error errorMsg={errorText} />}
            {loader && <Loading />}

            <BottomNav page={'Investm.'} />

            <div className="top">
                <div className="col">
                    <div className="col__top">Total Investments</div>
                    <div className="col__bottom">{(inv.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} Rs</div>
                </div>

                <div className="col" style={{ marginTop: 20 }}>
                    <div className="col__top">My Income</div>
                    <div className="col__bottom">{ret.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Rs</div>
                </div>
            </div>

            <div className="inv__section element">
                <div className="record__filter">
                    {category.map((item, index) => {
                        const isActive = actCategory === item;

                        return (
                            <div className={isActive ? "col active all-center" : "col all-center"} key={index} onClick={() => {
                                if (!isActive) {
                                    isFirstRun.current = true;

                                    setRecords([])
                                    setActCategory(item);
                                }
                            }}>{item}</div>
                        )
                    })}
                </div>

                <div className="records__container">
                    {records.length === 0 && <div className='no__record'>
                        <center>
                            <img src="https://cdn3d.iconscout.com/3d/premium/thumb/cactus-pot-3d-icon-download-in-png-blend-fbx-gltf-file-formats--plant-nature-pack-icons-8248751.png" height={'150'} alt="" /> <br />
                            <div>No Investments Found!</div>
                        </center>
                    </div>}

                    {records && records.map((item, index) => {
                        return (
                            <div className="record__box" key={index}>
                                <div className="box__left all-center">
                                    <center>
                                        <div className="box__left__top">My Returns</div>
                                        <div className="box__left__bottom">₹{(item.daily * item.day).toLocaleString()}</div>
                                    </center>
                                </div>

                                <div className="box__right">
                                    <div className="col">
                                        <div className="col__left">My Investments: </div>
                                        <div className="col__right">₹{item.cost.toLocaleString()}</div>
                                    </div>
                                    <div className="col">
                                        <div className="col__left">Daily Income: </div>
                                        <div className="col__right">₹{item.daily.toLocaleString()}</div>
                                    </div>
                                    <div className="col">
                                        <div className="col__left">Product Runtime: </div>
                                        <div className="col__right">{item.day} / {item.period}</div>
                                    </div>
                                    <div className="col">
                                        <div className="col__left">Expiring On </div>
                                        <div className="col__right">{item.date}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Investments