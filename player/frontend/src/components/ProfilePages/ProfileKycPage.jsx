import React from 'react'
import CustomSelect from './common/CustomSelect'
import { PrimaryButton } from '../Common/Button'

const ProfileKycPage = () => {
    return (
        <div className='bg-primary-500 rounded-lg p-4 sm:py-8 sm:px-6'>
            <h2 className='text-16 sm:text-20 md:text-24 text-white font-medium capitalize'>Upload identification</h2>
            <p className='text-10 sm:text-14 text-white mt-1'>Please upload your identification. This step will unlock more capabilities such as higher betting limits and enhanced account security.</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 xl:gap-7 mt-7'>
                <CustomSelect label="Document Type" />
            </div>

            <div className="flex items-center justify-center gap-4 pt-4 sm:pt-8 lg:pt-14">
                <PrimaryButton className="max-w-32 sm:max-w-64 w-full !rounded-lg">submit</ PrimaryButton>
            </div>
        </div>
    )
}

export default ProfileKycPage