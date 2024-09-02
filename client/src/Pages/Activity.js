import React, { useState, useEffect, useRef } from 'react'
import '../CSS/Activity.css'

import BottomNav from '../Components/BottomNav'

import Icon from '../Icons/crown'

import axios from 'axios'

import { useNavigate } from 'react-router-dom'

import Error from '../Components/Error'
import Loading from '../Components/Loading'

const Activity = ({ token }) => {
    const onUsers = [2, 5, 10, 20, 50, 100, 200, 350, 700]

    const navigate = useNavigate();

    const [referrals, setReferrals] = useState(0);
    const [claimed, setClaimed] = useState(0);
    const [level, setLevel] = useState([])

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
            const ref = data.referrals
            const level = ref.rewards_claimed

            setReferrals(ref.verified);
            setLevel(level)
            setClaimed(ref.rewards)

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

    async function onClaim(level) {
        setLoader(true);

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER}/claim/reward?level=${level}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = response.data;

            setLevel(prevLevel => [...prevLevel, level]);
            setReferrals(data.referrals);

            const toAdd = level === 1 ? 142 : (onUsers[level - 1] - onUsers[level - 2]) * 71
            setClaimed(claimed + toAdd)

            setLoader(false)
            displayError('Claimed Successfully');
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
    }

    return (
        <div className='activity screen'>
            {isError && <Error errorMsg={errorText} />}
            {loader && <Loading />}

            <BottomNav page={'Rewards'} />

            <div className="top">
                <div className="ab__txt">Active Referrals, are the 1st level invited friends who invest in any of one product. <br /><br />Bonus / Invite = Rs 71</div>
            </div>

            <div className="reward__section element">
                <div className="section__top">
                    <div className="col all-center sliding-from-left" style={{ animationDelay: '0.3s'}}>
                        <center>
                            <div className="col__top">Active referrals</div>
                            <div className="col__bottom">{referrals}</div>
                        </center>
                    </div>
                    <div className="col all-center sliding-element" style={{ animationDelay: '0.3s', animationDuration: '0.35s' }}>
                        <center>
                            <div className="col__top">Bonus claimed</div>
                            <div className="col__bottom">₹{claimed.toLocaleString()}</div>
                        </center>
                    </div>
                </div>

                <div className="reward__list__container">
                    <div className="reward__list">
                        {onUsers.map((item, index) => {
                            const rewAmount = index === 0 ? 71 * item : (onUsers[index] - onUsers[index - 1]) * 71;

                            let isLevelClaimed = level.includes(index + 1);
                            let isAvailableToClaim = referrals >= item;

                            const delay = index === 0 ? 0.3 : (0.15 * (index + 1)) + 0.3

                            return (
                                <div className="reward__box sliding-from-left" style={{ animationDelay: `${delay}s` }} key={index}>
                                    <div className="box__left">
                                        <div className="icon all-center">
                                            <Icon />
                                        </div>
                                        <div className="box__left__inn">
                                            <div className="box__left__top">Invite <span>{item}</span> users to invest and claim <span>₹{rewAmount.toLocaleString()}</span> bonus</div>
                                            <div className="box__bar">
                                                <div className="bar__filled" style={{ width: referrals >= item ? '100%' : `${(referrals / item) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {isLevelClaimed ? <button className="claim__btn" style={{ opacity: .5 }}>claimed</button> : isAvailableToClaim ? <button className="claim__btn" onClick={() => onClaim(index + 1)}>claim</button> : <button className="claim__btn" style={{ opacity: .5 }}>claim</button>}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Activity