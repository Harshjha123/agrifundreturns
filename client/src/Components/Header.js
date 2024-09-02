import React from 'react'

import { RiCustomerService2Fill } from "react-icons/ri";
import { HiArrowLeft } from "react-icons/hi2";

import { useNavigate } from 'react-router-dom';

const Header = ({ name }) => {
    const navigate = useNavigate();

    return (
        <div className='header'>
            <div className="header__left">
                <div className="back__btn all-center" onClick={() => navigate(-1)}>
                    <HiArrowLeft />
                </div>
                <div className="page__name">{name}</div>
            </div>
            <div className="header__right">
                <div className="col all-center" style={{ fontSize: 20}}>
                    <RiCustomerService2Fill />
                </div>
            </div>
        </div>
    )
}

export default Header