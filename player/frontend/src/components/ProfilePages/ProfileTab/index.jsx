'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSlider from '../../CustomSlider';

// ICONS — Replace these with actual icons
import ProfileIcon from '../../../assets/icons/ProfileIcon';
import LockProfileIcon from '../../../assets/icons/LockProfileIcon';
import HistoryIcon from '../../../assets/icons/HistoryIcon';
import TransactionIcon from '../../../assets/icons/TransactionIcon';
import KycIcon from '../../../assets/icons/KycIcon';
import ProfileMainPage from '../ProfileMainPage';
import ProfilePasswordPage from '../ProfilePasswordPage';
import ProfileKycPage from '../ProfileKycPage';


export default function ProfileTab() {
    const [activeTab, setActiveTab] = useState('User Profile');

    const tabs = ['User Profile', 'Password', 'KYC', 'Transaction', 'Game History'];

    const tabIcons = {
        'User Profile': <ProfileIcon className="size-4 md:size-5 lg:size-7" />,
        'Password': <LockProfileIcon className="size-4 md:size-5 lg:size-7" />,
        'KYC': <KycIcon className="size-4 md:size-5 lg:size-7" />,
        'Transaction': <TransactionIcon className="size-4 md:size-5 lg:size-7" />,
        'Game History': <HistoryIcon className="size-4 md:size-5 lg:size-7" />,
    };

    return (
        <section className='max-w-container-width w-full mx-auto xl:px-4'>
            <div className="mt-4 sm:mt-8">
                <div className='flex justify-between items-center gap-4'>
                    {/* Tabs Container */}
                    <div className="relative inline-flex bg-tab-bg overflow-hidden border border-solid border-primary-border rounded-lg h-10 sm:h-14 max-xl:mx-4 w-full max-md:max-w-[48rem] max-md:overflow-x-auto scrollbar-hide">
                        {/* Tab Buttons */}
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`tabbtn relative z-10 px-3 sm:px-6 whitespace-nowrap lg:px-2  w-full flex-1 py-2 text-12 sm:text-14 lg:text-16 font-medium transition-colors duration-300 before:content-[''] before:absolute before:w-px before:h-5 before:bg-primary-border before:right-0 before:top-1/2 before:-translate-y-1/2 last:before:hidden ${activeTab === tab ? 'text-white [&>span>svg]:fill-white [&>span>svg>g>path]:fill-white' : 'text-tab-text-color'
                                    }`}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeBackground"
                                        className="absolute inset-0 bg-tabGradient z-[-1] bg-tab-bg border-b border-solid border-secondary-border"
                                        transition={{ stiffness: 500, damping: 30 }}
                                    />
                                )}

                                <span className="flex items-center gap-2 justify-center">
                                    {tabIcons[tab]}
                                    {tab}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Animated Tab Content */}
                <div className="my-4 sm:my-8 max-xl:px-4">
                    <AnimatePresence mode="wait">
                        {activeTab === 'User Profile' && (
                            <motion.div
                                key="User Profile"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ProfileMainPage />
                            </motion.div>
                        )}
                        {activeTab === 'Password' && (
                            <motion.div
                                key="Password"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ProfilePasswordPage />
                            </motion.div>
                        )}
                        {activeTab === 'KYC' && (
                            <motion.div
                                key="KYC"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ProfileKycPage />
                            </motion.div>
                        )}
                        {activeTab === 'Transaction' && (
                            <motion.div
                                key="Transaction"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <>Transaction History</>
                            </motion.div>
                        )}
                        {activeTab === 'Game History' && (
                            <motion.div
                                key="Game History"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <>Game History Content</>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
