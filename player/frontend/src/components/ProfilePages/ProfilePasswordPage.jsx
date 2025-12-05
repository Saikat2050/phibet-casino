import React from 'react'
import InputField from "./common/InputField";
import { PrimaryButton, SecondaryButton } from "../Common/Button";

const ProfilePasswordPage = () => {
    return (
        <div className='bg-primary-500 rounded-lg p-4 sm:py-8 sm:px-6'>
            <h2 className='text-16 sm:text-20 md:text-24 text-white font-medium capitalize'>password</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 xl:gap-7 mt-7'>
                <InputField text='password' label="Enter old password" />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 xl:gap-7 mt-4 xl:mt-7'>
                <InputField text='password' label="New Password" />
                <InputField text='password' label="Confirm Password" />
            </div>

            <div className="flex items-center justify-center gap-4 pt-4 sm:pt-8 lg:pt-14">
                <PrimaryButton className="max-w-64 w-full !rounded-lg">Save</ PrimaryButton>
                <SecondaryButton className="max-w-64 w-full !rounded-lg [&>span]:!rounded-lg [&>span]:!bg-whiteOpacity-300">cancel</ SecondaryButton>
            </div>
        </div>
    )
}

export default ProfilePasswordPage