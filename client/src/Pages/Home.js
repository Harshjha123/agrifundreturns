import React, { useState, useEffect, useRef } from 'react'
import '../CSS/Home.css'

import BottomNav from '../Components/BottomNav';

import axios from 'axios'

import { useNavigate } from 'react-router-dom';

import Error from '../Components/Error';
import Loading from '../Components/Loading';

import { RiArrowUpCircleFill } from "react-icons/ri";
import { RiArrowDownCircleFill } from "react-icons/ri";
import { FaPiggyBank } from "react-icons/fa6";
import { PiTicketFill } from "react-icons/pi";
import { BsTelegram } from "react-icons/bs";

const Home = ({ token, firstCall }) => {
    const categories = ['Daily', 'Special'];

    const navigate = useNavigate()

    const logo = 'https://cdn.prod.website-files.com/655c56e538f5e80d934ad103/65b0c29121dde3291bc4a665_logo-1-p-2000.png';

    //const [actCategory, setActCategory] = useState(categories[0]);
    const [plans, setPlans] = useState([]);

    const [toBuy, setToBuy] = useState({
        popup: false,
        product: ''
    })

    const [loader, setLoader] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorText, setErrorText] = useState('');

    const options = [
        {
            item: 'Recharge',
            icon: <RiArrowDownCircleFill />,
            onClick: () => {
                window.location.href = '/#/recharge'
            }
        },
        {
            item: 'Withdraw',
            icon: <RiArrowUpCircleFill />,
            onClick: () => {
                window.location.href = '/#/withdraw'
            }
        },
        {
            item: 'Investments',
            icon: <FaPiggyBank />,
            onClick: () => {
                window.location.href = '/#/my/investments'
            }
        },
        {
            item: 'Redeem',
            icon: <PiTicketFill />,
            onClick: () => {
                //setRedeemPopup(true)
            }
        },
        {
            item: 'Telegram',
            icon: <BsTelegram />,
            onClick: () => {
                window.open('https://t.me/+U9M8zBSegL01MTg9')
            }
        }
    ]

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

            setPlans(data.plan);
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

    async function confirmBuy() {
        setToBuy({ ...toBuy, popup: false});
        setLoader(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER}/invest`, { product_id: toBuy.product }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = response.data;

            setToBuy({ popup: false, product: ''})
            displayError('Purchased Successfully')

            setLoader(false);
        } catch (error) {
            setLoader(false);
            const errorMessage = error.response?.data?.message || 'Failed to fetch data';

            setToBuy({ popup: false, product: '' })

            if (error.response && error.response.data.logout === true) {
                localStorage.removeItem('token');

                navigate('/user/login');
                window.location.reload();
            }

            displayError(errorMessage);
        }
    }

    return (
        <div className='screen home'>
            {isError && <Error errorMsg={errorText} />}
            {loader && <Loading />}

            {toBuy.popup && <div className="popup__screen">
                <div className="purchase__popup">
                    <center>
                        <div className="conf__txt">Are you sure to purchase this product?</div>
                        <button className="cancel__btn" onClick={() => setToBuy({ popup: false, product: ''})}>Cancel</button>
                        <button className="confirm__btn" onClick={confirmBuy}>Confirm</button>
                    </center>
                </div>
            </div>}

            <BottomNav page={'Home'} />

            <div className="top">
                <div className="home__header">
                    <div className="app__logo">
                        <img src={logo} height={'50'} style={{ marginTop: 130 }} alt="" />
                    </div>

                    <div className="options">
                        {options.map((item, index) => {
                            return (
                                <div className="col" key={index} onClick={item.onClick}>
                                    <center>
                                        <div className="col--icon all-center">{item.icon}</div>
                                        <div className="col--name">{item.item}</div>
                                    </center>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className={firstCall ? "product__section element-bounce-up" : "product__section element"}>
                <div className="product__top">
                    <div className="section__title">Product Hall</div>
                    {/*<div className="filter">
                        {categories.map((item, index) => {
                            const isActive = actCategory === item;

                            return (
                                <div className={isActive ? "col active all-center" : "col all-center"} key={index} onClick={() => {
                                    if (!isActive) {
                                        setActCategory(item)
                                    }
                                }}>{item}</div>
                            )
                        })}
                    </div> */}
                </div>

                {plans.length === 0 && <div className='no__record'>
                    <center>
                        <img src="https://cdn3d.iconscout.com/3d/premium/thumb/cactus-pot-3d-icon-download-in-png-blend-fbx-gltf-file-formats--plant-nature-pack-icons-8248751.png" height={'150'} alt="" /> <br />
                        <div>No Products Found!</div>
                    </center>
                </div>}

                {plans && plans.map((item, index) => {
                    const delay = index === 0 ? 0.3 : (0.15 * (index + 1)) + 0.3

                    return (
                        <div className="product__box sliding-from-left" style={{ animationDelay: `${delay}s` }} key={index}>
                            <div className="box__left">DAILY 0{index + 1}</div>

                            <div className="box__right">
                                <div className="product__details">
                                    <div className="col">
                                        <div className="col__top">Daily income</div>
                                        <div className="col__bottom"><span>₹</span>{item.daily.toLocaleString()}</div>
                                    </div>
                                    <div className="col">
                                        <div className="col__top">Product cycle</div>
                                        <div className="col__bottom">{item.period} days</div>
                                    </div>
                                    <div className="col">
                                        <div className="col__top">Monthly income</div>
                                        <div className="col__bottom"><span>₹</span>{(item.daily * 30).toLocaleString()}</div>
                                    </div>

                                    <div className="col">
                                        <div className="col__top">Total Income</div>
                                        <div className="col__bottom">₹{(item.daily * item.period).toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="product__purchase">
                                    <div className="purchase__amount">₹{item.cost.toLocaleString()}</div>
                                    <button className="purchase__btn" onClick={() => setToBuy({ popup: true, product: item.id})}>Invest</button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Home