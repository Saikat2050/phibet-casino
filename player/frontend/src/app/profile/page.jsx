
import React from 'react'
import ProfileTab from '../../components/ProfilePages/ProfileTab/index'
import Image from 'next/image';
import UserImg from '../../assets/profile/user-img.jpg'
const page = () => {
  return (
    <div>
      <div className='max-w-container-width w-full mx-auto px-4'>
        <div className='bg-primary-500 rounded-lg pl-6 pr-4 sm:pr-10 py-4 w-full mxs:w-fit flex items-center gap-3 sm:gap-4'>
          <div>
            <Image src={UserImg} alt='user-image' className='size-16 sm:size-24 rounded-full object-cover object-center mx-auto' />
            <label htmlFor="edit-img" className='max-sm:hidden border border-solid border-secondary-500 rounded-3xl text-10 sm:text-14 flex items-center justify-center h-8 w-fit px-3 mt-2 cursor-pointer'>
              <input type="file" id='edit-img' className='hidden' />
              Edit Image
            </label>
          </div>
          <div>
            <h4 className='text-18 sm:text-24 text-white font-bold capitalize'>Rachel Cericola</h4>
            <p className='text-10 sm:text-16 text-primary-600 mt-1'>UserID- #826398263</p>
            <label htmlFor="edit-img" className='sm:hidden border border-solid border-secondary-500 rounded-3xl text-10 sm:text-14 flex items-center justify-center h-8 w-fit px-3 mt-2 cursor-pointer'>
              <input type="file" id='edit-img' className='hidden' />
              Edit Image
            </label>
          </div>
        </div>

      </div>
      <ProfileTab />
    </div>
  )
}

export default page