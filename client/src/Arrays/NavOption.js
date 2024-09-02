import { useNavigate } from 'react-router-dom'

import { HiMiniHomeModern } from "react-icons/hi2";
import { PiUserDuotone } from "react-icons/pi";
import { PiPiggyBankFill } from "react-icons/pi";
import { PiCrownSimpleFill } from "react-icons/pi";
import { PiPaperPlaneTiltFill } from "react-icons/pi";

const NavOption = () => {
    const navigate = useNavigate()

    const options = [
        {
            page: 'Home',
            onClick: () => {
                navigate('/')
            },
            icon: <HiMiniHomeModern />
        },
        {
            page: 'Investm.',
            onClick: () => {
                navigate('/my/investments')
            },
            icon: <PiPiggyBankFill />
        },
        {
            page: 'Invite',
            onClick: () => {
                navigate('/invite')
            },
            icon: <PiPaperPlaneTiltFill />
        },
        {
            page: 'Rewards',
            onClick: () => {
                navigate('/activity/rewards')
            },
            icon: <PiCrownSimpleFill />
        },
        {
            page: 'My',
            onClick: () => {
                navigate('/my')
            },
            icon: <PiUserDuotone />
        }
    ]

    return options;
}

export default NavOption