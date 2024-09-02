import React, { useState, useEffect, useRef } from 'react'
import '../CSS/Records.css'

import Header from '../Components/Header'
import Error from '../Components/Error';
import Loading from '../Components/Loading';

import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { AiFillGift } from "react-icons/ai";
import { FaUser } from "react-icons/fa6";
import { FaPiggyBank } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { PiTicketFill } from "react-icons/pi";
import { MdOutlineCallReceived } from "react-icons/md";

import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { IoTennisball } from 'react-icons/io5';

const Records = ({ token }) => {
  const navigate = useNavigate();

  const types = ['Financial', 'Recharge', 'Withdraw'];

  const [activeType, setActiveType] = useState(types[0]);
  const [records, setRecords] = useState([])

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

    const param = activeType === 'Financial' ? 'billing/records' : activeType === 'Recharge' ? 'recharge/records' : 'withdraw/records'

    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER}/${param}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data;
      setRecords(data.records || []);


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
    <div className='records screen'>
      <Header name={'My Records'} />

      {isError && <Error errorMsg={errorText} />}
      {loader && <Loading />}

      <div className="records__type">
        {types.map((item, index) => {
          const isActive = activeType === item;

          return (
            <div className={isActive ? 'col active all-center' : 'col all-center'} key={index} onClick={() => {
              if (!isActive) {
                setActiveType(item)
              }
            }}>{item}</div>
          )
        })}
      </div>

      <div className="records--container">
        {records && records.length === 0 && <div className="no__data">
          <div className="no__data__text">No Records Found!</div>
        </div>}

        {records && activeType === 'Financial' && records.map((item, index) => {
          const icon = item.item === 'Activity Reward' ? <AiFillGift /> : item.item === 'Task Reward' ? <MdOutlineCallReceived /> : item.item === 'Daily Reward' ? <PiTicketFill /> : item.item === 'Sign-up Bonus' ? <FaUser /> : item.item === 'New Investment' ? <FaPiggyBank /> : item.item === 'Recharge' ? <FiArrowDown /> : item.item === 'Withdrawal' ? <FiArrowUp /> : (item.item === 'Lvl 1 Commission' || item.item === 'Lv2 Commission' || item.item === 'Lv3 Commission') ? <FaUserGroup /> : '';

          return (
            <div className="record--box" key={index}>
              <div className="box--left">
                <div className="box--left--left--col">
                  <div className="box--icon">{icon}</div>
                </div>

                <div className="box--left--right--col">
                  <div className="box--col--top">{item.item}</div>
                  <div className="box--col--bottom">{item.date}</div>
                </div>
              </div>

              <div className="box--right">
                <div className="item--amount" style={{ color: item.type === true ? 'green' : 'red'}}>{item.type === true ? '+' : '-'}{parseFloat((item.amount).toFixed(2))} Rs</div>
              </div>
            </div>
          )
        })}

        {records && activeType === 'Recharge' && records.map((item, index) => {
          return (
            <div className="record--box2" key={index} onClick={() => {
              if ((item.type === 'UPI' && item.status === 'Pending') || item.type !== 'UPI') {
                window.open(item.url)
              }
            }}>
              <div className="box--top">
                <div className="box--top--left">
                  <div className="text--top">order id:</div>
                  <div className="text--bottom">#{item.order_id}</div>
                </div>

                <div className="box--top--right">
                  <div className="order--amount">{parseFloat((item.amount).toFixed(2))} {item.type}</div>
                </div>
              </div>

              <div className="box--bottom">
                <div className="col">
                  <div className="col--left">Payment Method: </div>
                  <div className="col--right">{item.type} (TRC20)</div>
                </div>
                <div className="col">
                  <div className="col--left">Recharge Status: </div>
                  <div className="col--right">{item.status}</div>
                </div>
                <div className="col">
                  <div className="col--left">Date & Time: </div>
                  <div className="col--right">{item.date}</div>
                </div>
              </div>
            </div>
          )
        })}

        {activeType === 'Withdraw' && records.map((item, index) => {
          const method = item.type === 'UPI' ? 'In Rupee' : 'In Crypto';

          return (
            <div className="record--box2" key={index}>
              <div className="box--top">
                <div className="box--top--left">
                  <div className="text--top">order id:</div>
                  <div className="text--bottom">#{item.order_id}</div>
                </div>

                <div className="box--top--right">
                  <div className="order--amount">{item.details.inCrypto} {item.details.type}</div>
                </div>
              </div>

              <div className="box--bottom">
                <div className="col">
                  <div className="col--left">Withdrawal Method: </div>
                  <div className="col--right">{item?.details?.type} ({method})</div>
                </div>
                <div className="col">
                  <div className="col--left">Withdraw Status: </div>
                  <div className="col--right">{item.status}</div>
                </div>
                <div className="col">
                  <div className="col--left">Date & Time: </div>
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

export default Records