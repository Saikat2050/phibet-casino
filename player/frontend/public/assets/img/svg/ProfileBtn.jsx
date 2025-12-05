import React from 'react';

function ProfileBtn(props) {
    return (
        <svg 
        width="23" 
        height="39" 
        viewBox="0 0 23 39" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        >
            <path d="M0.334523 19.3345V3.24259C0.334523 0.569873 3.56595 -0.768625 5.45584 1.12127L21.5477 17.2132C22.7193 18.3847 22.7193 20.2842 21.5477 21.4558L5.45584 37.5477C3.56595 39.4376 0.334523 38.0991 0.334523 35.4264V19.3345Z" fill="url(#paint0_linear_335_2605)" />
            <defs>
                <linearGradient id="paint0_linear_335_2605" x1="-0.711868" y1="43.7154" x2="23.5739" y2="17.666" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#EBDC03" />
                    <stop offset="0.245" stopColor="#FF9321" />
                    <stop offset="0.265" stopColor="#FF9321" />
                    <stop offset="0.495" stopColor="#F24C50" />
                    <stop offset="1" stopColor="#8B21B7" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default ProfileBtn;
