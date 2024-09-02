import React, { useState, useEffect, useRef } from 'react'
import '../CSS/Invite.css'

import BottomNav from '../Components/BottomNav'

import { GiLaurelCrown } from "react-icons/gi";
import { IoIosEye } from "react-icons/io";

import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import Error from '../Components/Error';
import Loading from '../Components/Loading';

const Invite = ({ token }) => {
    const navigate = useNavigate();

    const [loader, setLoader] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorText, setErrorText] = useState('');

    const [id, setId] = useState('XXXXXXXX')

    const [count, setCount] = useState({
        lv1: 0,
        lv2: 0,
        lv3: 0
    });

    const [collection, setCollection] = useState({
        lv1: 0,
        lv2: 0,
        lv3: 0
    });

    const [income, setIncome] = useState({
        lv1: 0,
        lv2: 0,
        lv3: 0
    })

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
            setId(data.id)

            const referrals = data.referrals;

            setCount({
                ...count,
                lv1: referrals.users.lv1,
                lv2: referrals.users.lv2,
                lv3: referrals.users.lv3
            })

            setCollection({
                ...collection,
                lv1: referrals.recharges.lv1,
                lv2: referrals.recharges.lv2,
                lv3: referrals.recharges.lv3
            })

            setIncome({
                ...income,
                lv1: referrals.commission.lv1,
                lv2: referrals.commission.lv2,
                lv3: referrals.commission.lv3
            })

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

    useEffect(() => {
        const element = document.getElementById('team_d');

        element.style.display = 'none';

        setTimeout(() => {
            element.style.display = 'block';
            element.style.transform = 'translateX(-100vh)'
            element.style.animationDelay = '0.2s'
        }, 500);
    }, [])

    return (
        <div className='invite screen'>
            {isError && <Error errorMsg={errorText} />}
            {loader && <Loading />}

            <BottomNav page={'Invite'} />

            <div className="top">
                <div className="col">
                    <div className="col__top">Referral Code</div>
                    <div className="col__bottom">{id}</div>
                </div>

                <div className="col" style={{ marginTop: 20 }}>
                    <div className="col__top">Referral Link</div>
                    <div className="col__bottom" style={{ fontSize: 16 }}>{window.location.origin}/#/register?invite_code={id}</div>
                </div>
            </div>

            <div className="invite__section element">
                <div className="team__details element" id='team_d'>
                    <div className="section__title">Team Details</div>

                    <div className="team__data">
                        <div className="col sliding-element" style={{ animationDelay: '0.8s', animationDuration: '0.3s' }} onClick={() => navigate('/team/records?level=1')}>
                            <div className="col__top">
                                <div className="team__level">
                                    <div className="all-center icon">
                                        <GiLaurelCrown />
                                    </div>
                                    <span>Level 1</span>
                                </div>
                                <div className="view__icon all-center">
                                    <IoIosEye />
                                </div>
                            </div>

                            <div className="col__bottom">
                                <div className="inn__col">
                                    <div className="inn__col__top">{count.lv1}</div>
                                    <div className="inn__col__bottom">Invites</div>
                                </div>
                                <div className="inn__col">
                                    <div className="inn__col__top">₹{collection.lv1}</div>
                                    <div className="inn__col__bottom">Collection</div>
                                </div>
                                <div className="inn__col">
                                    <div className="inn__col__top">₹{income.lv1}</div>
                                    <div className="inn__col__bottom">Income</div>
                                </div>
                            </div>
                        </div>

                        <div className="col sliding-element" style={{ animationDelay: '1s', animationDuration: '0.3s' }} onClick={() => navigate('/team/records?level=2')}>
                            <div className="col__top">
                                <div className="team__level">
                                    <div className="all-center icon">
                                        <GiLaurelCrown />
                                    </div>
                                    <span>Level 2</span>
                                </div>
                                <div className="view__icon all-center">
                                    <IoIosEye />
                                </div>
                            </div>

                            <div className="col__bottom">
                                <div className="inn__col">
                                    <div className="inn__col__top">{count.lv2}</div>
                                    <div className="inn__col__bottom">Invites</div>
                                </div>
                                <div className="inn__col">
                                    <div className="inn__col__top">₹{collection.lv2}</div>
                                    <div className="inn__col__bottom">Collection</div>
                                </div>
                                <div className="inn__col">
                                    <div className="inn__col__top">₹{income.lv2}</div>
                                    <div className="inn__col__bottom">Income</div>
                                </div>
                            </div>
                        </div>

                        <div className="col sliding-element" style={{ animationDelay: '0.9s', animationDuration: '0.3s' }} onClick={() => navigate('/team/records?level=3')}>
                            <div className="col__top">
                                <div className="team__level">
                                    <div className="all-center icon">
                                        <GiLaurelCrown />
                                    </div>
                                    <span>Level 3</span>
                                </div>
                                <div className="view__icon all-center">
                                    <IoIosEye />
                                </div>
                            </div>

                            <div className="col__bottom">
                                <div className="inn__col">
                                    <div className="inn__col__top">{count.lv3}</div>
                                    <div className="inn__col__bottom">Invites</div>
                                </div>
                                <div className="inn__col">
                                    <div className="inn__col__top">₹{collection.lv3}</div>
                                    <div className="inn__col__bottom">Collection</div>
                                </div>
                                <div className="inn__col">
                                    <div className="inn__col__top">₹{income.lv3}</div>
                                    <div className="inn__col__bottom">Income</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="reward__dis">
                    <div className="section__title">Reward System</div>
                    <div className="reward__points"> 1. Inviting a user to join and successfully investing will be counted as valid referral. Claim rewards for them from our <b>"Rewards Page"</b> <div className="fh1"></div> 2. You will receive rewards for subordinate investments amount: <div className="fh1"></div>Commission rate (Level 1): 16% <div className="fh1"></div>Commission rate (Level 2): 4% <div className="fh1"></div>Commission rate (Level 3): 1%
                        <div className="fh1"></div>Assuming you invite 100 users to join and invest 10,000 Rs on the platform, your income would be: 1,000,000 * 16% = 160,000 Rs <div className="fh1"></div> Each excellent promoter can earn at least 300,000 Rs per month <div className="fh1"></div> Contact customer service to join the promoter alliance and get the latest ways to make money
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Invite