import React from 'react'
import Image from 'next/image'
import RewardGirlImg from '../../assets/guest-lobby/reward-girl.webp'

const RewardSection = () => {
    return (
        <section className='bg-rewardBg bg-center bg-no-repeat my-12'>
            <div className='max-w-container-width w-full mx-auto px-4 py-12'>
                <h2 className='pb-2.5 mb-2.5 text-white text-36 font-black text-center relative before:content-[""] before:absolute before:w-20 before:h-1 before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:bg-secondary-border before:rounded-xl'>HOLD, EARN, CLAIM, CELEBRATE</h2>
                <p className='max-w-[20.875rem] w-full mx-auto text-center text-white text-18'>Earn and Redeem your points for Revenue Rewards and more!</p>



                <div className='grid grid-cols-7 grid-rows-2 my-3 gap-y-4'>
                    <div className="col-span-2">
                        <div className='flex items-center relative py-2 max-w-[22.1875rem] w-full active'>
                            <div className='relative max-w-[22.1875rem] w-full'>
                                <div className='max-w-[11.5%] w-full aspect-[1_/_1] absolute left-[7.2%] top-[-12%] bg-red-500 rounded-full flex justify-center items-center text-10 nlg:text-12 lg:text-14 xl:text-16 2xl:text-20'>01</div>
                                <div className='reward-border-mask absolute w-full h-full inset-0 z-[3] pointer-events-none'></div>
                                <div className='reward-box-mask py-4 pl-3    lg:pl-4 xl:pl-6.5 pr-12 nlg:pr-16 lg:pr-20 xl:pr-[6.125rem] flex justify-center flex-col relative z-[2]'>
                                    <h4 className='text-16 nlg:text-18 lg:text-20 xl:text-22 2xl:text-24 text-tertiary-300 font-extrabold uppercase w-full truncate'>Get your $lucky</h4>
                                    <p className='text-10 nlg:text-12 2xl:text-14 text-white max-w-[10.8125rem] w-full text-center mt-1.5 lg:mt-2.5 leading-tight'>Purchas <span className='text-secondary-500'>$LUCKY</span> From A Centrlized Or Decentralized</p>
                                </div>
                            </div>
                            <div className='bg-rewardStripGradient absolute z-[3] right-[4%] top-0 max-w-9 nlg:max-w-12 lg:max-w-[3.75rem] xl:max-w-20 w-full h-full aspect-[4_/_9] rounded-lg'> </div>
                        </div>
                    </div>
                    <div className="col-span-2 col-start-1 row-start-2 flex justify-end items-end">
                        <div className='flex items-center relative py-2 max-w-[22.1875rem] w-full'>
                            <div className='relative max-w-[22.1875rem] w-full'>
                                <div className='max-w-[11.5%] w-full aspect-[1_/_1] absolute left-[7.2%] top-[-12%] bg-red-500 rounded-full flex justify-center items-center text-10 nlg:text-12 lg:text-14 xl:text-16 2xl:text-20'>01</div>
                                <div className='reward-border-mask absolute w-full h-full inset-0 z-[3] pointer-events-none'></div>
                                <div className='reward-box-mask py-4 pl-3    lg:pl-4 xl:pl-6.5 pr-12 nlg:pr-16 lg:pr-20 xl:pr-[6.125rem] flex justify-center flex-col relative z-[2]'>
                                    <h4 className='text-16 nlg:text-18 lg:text-20 xl:text-22 2xl:text-24 text-tertiary-300 font-extrabold uppercase w-full truncate'>Get your $lucky</h4>
                                    <p className='text-10 nlg:text-12 2xl:text-14 text-white max-w-[10.8125rem] w-full text-center mt-1.5 lg:mt-2.5 leading-tight'>Purchas <span className='text-secondary-500'>$LUCKY</span> From A Centrlized Or Decentralized</p>
                                </div>
                            </div>
                            <div className='bg-rewardStripGradient absolute z-[3] right-[4%] top-0 max-w-9 nlg:max-w-12 lg:max-w-[3.75rem] xl:max-w-20 w-full h-full aspect-[4_/_9] rounded-lg'> </div>
                        </div>
                    </div>
                    <div className="col-span-3 row-span-2 col-start-3 row-start-1">
                        <Image src={RewardGirlImg} alt='rewar girld image' />
                    </div>
                    <div className="col-span-2 col-start-6 row-start-1 flex justify-end items-start">
                        <div className='flex items-center relative py-2 max-w-[22.1875rem] w-full'>
                            <div className='relative max-w-[22.1875rem] w-full'>
                                <div className='max-w-[11.5%] w-full aspect-[1_/_1] absolute left-[7.2%] top-[-12%] bg-red-500 rounded-full flex justify-center items-center text-10 nlg:text-12 lg:text-14 xl:text-16 2xl:text-20'>01</div>
                                <div className='reward-border-mask absolute w-full h-full inset-0 z-[3] pointer-events-none'></div>
                                <div className='reward-box-mask py-4 pl-3    lg:pl-4 xl:pl-6.5 pr-12 nlg:pr-16 lg:pr-20 xl:pr-[6.125rem] flex justify-center flex-col relative z-[2]'>
                                    <h4 className='text-16 nlg:text-18 lg:text-20 xl:text-22 2xl:text-24 text-tertiary-300 font-extrabold uppercase w-full truncate'>Get your $lucky</h4>
                                    <p className='text-10 nlg:text-12 2xl:text-14 text-white max-w-[10.8125rem] w-full text-center mt-1.5 lg:mt-2.5 leading-tight'>Purchas <span className='text-secondary-500'>$LUCKY</span> From A Centrlized Or Decentralized</p>
                                </div>
                            </div>
                            <div className='bg-rewardStripGradient absolute z-[3] right-[4%] top-0 max-w-9 nlg:max-w-12 lg:max-w-[3.75rem] xl:max-w-20 w-full h-full aspect-[4_/_9] rounded-lg'> </div>
                        </div>
                    </div>
                    <div className="col-span-2 col-start-6 row-start-2 flex justify-start items-end">
                        <div className='flex items-center relative py-2 max-w-[22.1875rem] w-full'>
                            <div className='relative max-w-[22.1875rem] w-full'>
                                <div className='max-w-[11.5%] w-full aspect-[1_/_1] absolute left-[7.2%] top-[-12%] bg-red-500 rounded-full flex justify-center items-center text-10 nlg:text-12 lg:text-14 xl:text-16 2xl:text-20'>01</div>
                                <div className='reward-border-mask absolute w-full h-full inset-0 z-[3] pointer-events-none'></div>
                                <div className='reward-box-mask py-4 pl-3    lg:pl-4 xl:pl-6.5 pr-12 nlg:pr-16 lg:pr-20 xl:pr-[6.125rem] flex justify-center flex-col relative z-[2]'>
                                    <h4 className='text-16 nlg:text-18 lg:text-20 xl:text-22 2xl:text-24 text-tertiary-300 font-extrabold uppercase w-full truncate'>Get your $lucky</h4>
                                    <p className='text-10 nlg:text-12 2xl:text-14 text-white max-w-[10.8125rem] w-full text-center mt-1.5 lg:mt-2.5 leading-tight'>Purchas <span className='text-secondary-500'>$LUCKY</span> From A Centrlized Or Decentralized</p>
                                </div>
                            </div>
                            <div className='bg-rewardStripGradient absolute z-[3] right-[4%] top-0 max-w-9 nlg:max-w-12 lg:max-w-[3.75rem] xl:max-w-20 w-full h-full aspect-[4_/_9] rounded-lg'> </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}

export default RewardSection