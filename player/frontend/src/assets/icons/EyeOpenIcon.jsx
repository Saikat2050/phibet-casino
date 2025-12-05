import React from 'react'

const EyeOpenIcon = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            viewBox="0 0 24 24"
            {...props}
        >
            <g fill="none" stroke="#C5A17D" strokeWidth={2}>
                <path strokeLinecap="round" d="M9 4.46A9.8 9.8 0 0 1 12 4c4.182 0 7.028 2.5 8.725 4.704C21.575 9.81 22 10.361 22 12c0 1.64-.425 2.191-1.275 3.296C19.028 17.5 16.182 20 12 20s-7.028-2.5-8.725-4.704C2.425 14.192 2 13.639 2 12c0-1.64.425-2.191 1.275-3.296A14.5 14.5 0 0 1 5 6.821"></path>
                <path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z"></path>
            </g>
        </svg>
    )
}

export default EyeOpenIcon