import React from 'react'

const InputFieldVerify = ({ text = '', label = 'Label', placeholder = '', className = '' }) => {
    return (
        <div className={`${className}`}>
            <label className='text-tertiary-100 text-14 text-normal block mb-2 capitalize group'>{label}</label>
            <div className="relative bg-input-bg flex items-center gap-1 rounded-lg border border-solid border-input-bg has-[:focus]:border-secondary-500 has-[:focus]:shadow-inputShadow overflow-hidden pr-4">
                <input type={text} placeholder={placeholder} className='h-input-height w-full bg-transparent text-14 focus:outline-none pl-4 pr-1 py-1 text-white' />
                {/* ====== not verify button ====== */}
                {/* <button className="bg-secondary-500 capitalize text-10 font-semibold h-5.5 sm:h-7 px-1.5 py-0.5 rounded-md shrink-0 transition-all duration-300 ease-in-out hover:scale-95">
                            not verify
                        </button> */}
                <button className="bg-success-btn-bg capitalize text-10 font-semibold h-5.5 sm:h-7 px-1.5 py-0.5 rounded-md shrink-0 transition-all duration-300 ease-in-out hover:scale-95">
                    verified
                </button>
            </div>
        </div>
    )
}

export default InputFieldVerify
