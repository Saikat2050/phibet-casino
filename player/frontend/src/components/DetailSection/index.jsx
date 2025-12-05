import React from 'react'
import GameWhiteIcon from '../../assets/icons/GameWhiteIcon'
import WalletIcon from '../../assets/icons/WalletIcon'
import NotepadIcon from '../../assets/icons/NotepadIcon'

const DetailSection = () => {
    return (
        <div className='max-w-container-width w-full mx-auto px-4 pb-2.5'>
            <div className='grid grid-cols-3 gap-12'>
                <div className='detail-box-mask pl-5 pr-10 py-2 flex gap-9 items-center'>
                    <div className='max-w-[4.625rem] w-full aspect-[1_/_1] border border-solid border-tertiary-300 rounded-full flex items-center justify-center grow bg-iconBgGradient'>
                        <GameWhiteIcon className='size-9.5'/>
                    </div>
                    <div className='grow relative before:content-[""] before:absolute before:w-8.5 before:h-8.5 before:bg-starImg before:bg-contain before:bg-no-repeat before:bg-center before:-top-5 before:-left-6'>
                        <p className='text-18 text-white font-medium leading-snug'>Over 5000 games, enjoy new games every day!</p>
                    </div>
                </div>
                <div className='detail-box-mask pl-5 pr-10 py-2 flex gap-9 items-center'>
                    <div className='max-w-[4.625rem] w-full aspect-[1_/_1] border border-solid border-tertiary-300 rounded-full flex items-center justify-center grow bg-iconBgGradient'>
                        <WalletIcon className='size-9.5'/>
                    </div>
                    <div className='grow relative before:content-[""] before:absolute before:w-8.5 before:h-8.5 before:bg-starImg before:bg-contain before:bg-no-repeat before:bg-center before:-top-5 before:-left-6'>
                        <p className='text-18 text-white font-medium leading-snug'>Multiple ways to deposit, easy and convinient.</p>
                    </div>
                </div>
                <div className='detail-box-mask pl-5 pr-10 py-2 flex gap-9 items-center'>
                    <div className='max-w-[4.625rem] w-full aspect-[1_/_1] border border-solid border-tertiary-300 rounded-full flex items-center justify-center grow bg-iconBgGradient'>
                        <NotepadIcon className='size-9.5'/>
                    </div>
                    <div className='grow relative before:content-[""] before:absolute before:w-8.5 before:h-8.5 before:bg-starImg before:bg-contain before:bg-no-repeat before:bg-center before:-top-5 before:-left-6'>
                        <p className='text-18 text-white font-medium leading-snug'>Sing up and stary playing in game than 60 seconds.</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DetailSection