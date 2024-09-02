import { useNavigate } from 'react-router-dom';

const MeOption = () => {
    const navigate = useNavigate();

    const options = [
        {
            name: 'Recharge',
            onClick: () => {
                navigate('/recharge')
            }
        },
        {
            name: 'Withdraw',
            onClick: () => {
                navigate('/withdraw')
            }
        },
        {
            name: 'Daily Gift',
            onClick: () => {
                navigate('/recharge')
            }
        },
        {
            name: 'Leaders',
            onClick: () => {
                navigate('/recharge')
            }
        },
        {
            name: 'Records',
            onClick: () => {
                navigate('/records')
            }
        },
        {
            name: 'Tg Group',
            onClick: () => {
                navigate('/recharge')
            }
        },
        {
            name: 'Password',
            onClick: () => {
                navigate('/recharge')
            }
        },
        {
            name: 'Logout',
            onClick: () => {
                localStorage.removeItem('token')
                window.location.replace('/#/user/login')
            }
        }
    ];

    return options;
}

export default MeOption