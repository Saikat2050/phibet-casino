"use clinet";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Select from 'react-select';

import "react-datepicker/dist/react-datepicker.css";
import CustomSelect from './common/CustomSelect'
import CalendarIcon from "../../assets/icons/CalendarIcon";
import InputField from "./common/InputField";
import InputFieldVerify from "./common/InputFieldVerify";
import { PrimaryButton, SecondaryButton } from "../Common/Button";


const options = [
    { value: '+91', label: '+91' },
    { value: '+1', label: '+1' },
    { value: '+2', label: '+2' },
];


const ProfileMainPage = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [selectedOption, setSelectedOption] = useState(null);
    return (
        <div className='bg-primary-500 rounded-lg p-4 sm:py-8 sm:px-6'>
            <h2 className='text-16 sm:text-20 md:text-24 text-white font-medium capitalize'>profile</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-7 mt-7'>
                <InputField text='text' label="First Name" />
                <InputField text='text' label="last Name" />
                <InputField text='text' label="username" />
                <CustomSelect label="gender" />
                <div>
                    <label className='text-tertiary-100 text-14 text-normal block mb-2 capitalize'>gender</label>
                    <div className="relative [&>.react-datepicker-wrapper]:w-full group">
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            className="h-input-height w-full bg-input-bg rounded-lg border border-solid border-input-bg focus:border-secondary-500 focus:outline-none pl-4 pr-11 py-1 text-white focus:shadow-inputShadow text-14"
                        />
                        <CalendarIcon className='size-5 absolute right-4 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-100' />
                    </div>
                </div>
                <InputFieldVerify text='email' label="email ID" />
                <InputField text='text' label="Address Line 1" />
                <InputField text='text' label="Address Line 2" />
                <div className={``}>
                    <label className='text-tertiary-100 text-14 text-normal block mb-2 capitalize group'>Contact Number</label>

                    <div className="relative bg-input-bg flex items-center gap-1 rounded-lg border border-solid border-input-bg has-[:focus]:border-secondary-500 has-[:focus]:shadow-inputShadow pr-4">
                    <div className="relative before:content-[''] before:absolute before:w-px before:h-4 before:bg-tertiary-100 before:right-0 before:top-1/2 before:-translate-y-1/2 before:z-[1]">
                        <Select
                            defaultValue={selectedOption}
                            onChange={setSelectedOption}
                            options={options}
                            className='country-code-select'
                            classNamePrefix='country-code-select-inner'
                            placeholder='+91'
                            isSearchable={false}
                        />
                    </div>
                        <input type='text' className='h-input-height w-full bg-transparent text-14 focus:outline-none pl-1 pr-1 py-1 text-white' />
                        {/* ====== not verify button ====== */}
                        {/* <button className="bg-secondary-500 capitalize text-10 font-semibold h-5.5 h-7 px-1.5 py-0.5 rounded-md shrink-0 transition-all duration-300 ease-in-out hover:scale-95">
                                            not verify
                                        </button> */}
                        <button className="bg-success-btn-bg capitalize text-10 font-semibold h-5.5 sm:h-7 px-1.5 py-0.5 rounded-md shrink-0 transition-all duration-300 ease-in-out hover:scale-95">
                            Verified
                        </button>
                    </div>
                </div>
                <CustomSelect label="state" />
                <CustomSelect label="city" />
                <InputField text='text' label="zip code" />

            </div>

            <div className="flex items-center justify-center gap-4 pt-4 sm:pt-8 lg:pt-14">
                <PrimaryButton className="max-w-64 w-full !rounded-lg">Save</ PrimaryButton>
                <SecondaryButton className="max-w-64 w-full !rounded-lg [&>span]:!rounded-lg [&>span]:!bg-whiteOpacity-300">cancel</ SecondaryButton>
            </div>
        </div>
    )
}

export default ProfileMainPage