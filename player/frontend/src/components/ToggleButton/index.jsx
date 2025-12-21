'use client'

import React, { useState } from 'react';
import ScIcon from '../../../public/assets/img/svg/ScIcon';
import GcIcon from '../../../public/assets/img/svg/GcIcon';
import useUserStore from '@/store/useUserStore';

function ToggleBtn() {
    const { selectedCoin, setSelectedCoin } = useUserStore();
    const [coinAmount, setCoinAmount] = useState(158); // Example value, you can update this dynamically

    const handleToggle = () => {
        const newCoin = selectedCoin === 'USD' ? 'USD' : 'USD';
        setSelectedCoin(newCoin);
        setCoinAmount(newCoin === 'USD' ? 158 : 250); // Example numbers, adjust as needed
    };

    return (
        <>
            <div className={`relative flex items-center gap-2.5 max-md:gap-1.5 text-base max-md:text-sm h-[34px] font-bold text-blackOpacity ${selectedCoin === 'USD' ? ' ' : ''} rounded-full px-5 max-md:px-2 py-1 min-w-[179px] max-md:min-w-[120px] w-full`}>
                <span
                    className={`absolute top-1 flex items-center justify-between uppercase text-xl max-md:text-base leading-tight font-bold transition-all duration-300 ${selectedCoin === 'USD'
                        ? 'translate-y-0 opacity-100'
                        : '-translate-y-full opacity-0'
                        }`}
                >
                    USD
                </span>
                <span
                    className={`absolute top-1 flex items-center justify-between uppercase text-xl max-md:text-base leading-tight font-bold transition-all duration-300 ${selectedCoin === 'USD'
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-full opacity-0'
                        }`}
                >
                    USD
                </span>
                <span className="ml-2 transition-all duration-300">{coinAmount}</span>
            </div>
            <div className='flex items-center justify-center'>
                <label
                    htmlFor="AcceptConditions"
                    className="relative inline-block h-[34px] w-[66px] cursor-pointer rounded-full transition [-webkit-tap-highlight-color:_transparent] has-[:checked]: "
                >
                    <input
                        type="checkbox"
                        id="AcceptConditions"
                        className="peer sr-only [&:checked_+_span_svg[data-checked-icon]]:block [&:checked_+_span_svg[data-unchecked-icon]]:hidden"
                        checked={selectedCoin === 'USD'}
                        onChange={handleToggle}
                    />

                    <span
                        className="absolute inset-y-0 start-0 z-10 m-[2px_0px_2px_4px] inline-flex size-[30px] items-center justify-center rounded-full bg-white  00 transition-all peer-checked:start-[30px] peer-checked:text-white00"
                    >
                        <ScIcon data-unchecked-icon />
                        <GcIcon data-checked-icon className="hidden" />
                    </span>
                </label>
            </div>
        </>
    );
}

export default ToggleBtn;
