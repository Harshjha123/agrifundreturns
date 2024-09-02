import React from 'react'
import '../CSS/Components.css'

import NavOption from '../Arrays/NavOption'

const BottomNav = ({ page }) => {
    const navOption = NavOption();

    return (
        <div className='bottom__menu'>
            <div className="col__container">
                {navOption.map((item, index) => {
                    const isOptionActive = item.page === page

                    return (
                        <div className={isOptionActive ? 'col active all-center' : 'col all-center'} key={index} onClick={() => {
                            if (!isOptionActive) {
                                item.onClick()
                            }
                        }}>
                            <center>
                                <div className="col__icon all-center">{item.icon}</div>
                                {!isOptionActive && <div className='col__name'>{item.page}</div>}
                            </center>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default BottomNav