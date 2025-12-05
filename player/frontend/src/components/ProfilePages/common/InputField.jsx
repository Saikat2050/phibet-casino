import React from 'react'
import EyeOpenIcon from '../../../assets/icons/EyeOpenIcon'
import EyeCloseIcon from '../../../assets/icons/EyeCloseIcon'


const InputField = ({ text='', label = 'Label', placeholder = '', className='' }) => {
    return (
        <div className={`${className}`}>
            <label className='text-tertiary-100 text-14 text-normal block mb-2 capitalize'>
                {label}
            </label>
            <div className='relative'>
                <input
                    type={text}
                    placeholder={placeholder}
                    className={`h-input-height w-full bg-input-bg rounded-lg border border-solid border-input-bg focus:border-secondary-500 focus:outline-none py-1 text-white focus:shadow-inputShadow ${text === 'password' ? 'pl-4 pr-12' : 'px-4'}`}
                />
                {text === 'password' && (
                    <div className="absolute top-1/2 right-3 -translate-y-1/2 text-white">
                        {/* <EyeOpenIcon className='size-4 sm:size-6 cursor-pointer'/> */} {/* use this icon for password view */}
                        <EyeCloseIcon className='size-4 sm:size-6 cursor-pointer'/>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InputField
