'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSlider from '../CustomSlider';
import FilterIcon from '../../assets/icons/FilterIcon'

export default function CustomTabs() {
    const [activeTab, setActiveTab] = useState('All Game');
    const tabs = ['All Game', 'Top Game', 'New Game', 'special', 'Slots', 'Live'];

    return (
        <section className='max-w-container-width w-full mx-auto xl:px-4'>
            <div className="mt-10">
                <div className='flex justify-between items-center gap-4'>
                    {/* Tabs Container */}
                    <div className="relative inline-flex bg-tab-bg overflow-hidden border border-solid border-primary-border rounded-lg h-10 sm:h-14 max-xl:mx-4">
                        {/* Tab Buttons */}
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`tabbtn relative z-10 px-3 sm:px-6 whitespace-nowrap lg:px-2 lg:min-w-[7.75rem] xl:min-w-[9.75rem] 2xl:min-w-[11.75rem] w-full flex-1 py-2 text-12 sm:text-14 font-medium transition-colors duration-300 before:content-[''] before:absolute before:w-px before:h-5 before:bg-primary-border before:right-0 before:top-1/2 before:-translate-y-1/2 last:before:hidden ${activeTab === tab ? 'text-white' : 'text-tab-text-color'
                                    }`}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeBackground"
                                        className="absolute inset-0 bg-tabGradient z-[-1] bg-tab-bg border-b border-solid border-secondary-border"
                                        transition={{ stiffness: 500, damping: 30 }}
                                    />
                                )}
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className='flex items-center gap-4 pr-4'>
                        <div className='cursor-pointer flex items-center justify-center size-[60px] border border-solid border-primary-border rounded-lg'> <FilterIcon className='size-6' /> </div>
                        <a href="#"className='text-16 text-tertiary-300 font-medium'>View All</a>
                    </div>
                </div>

                {/* Animated Tab Content */}
                <div className="mt-4 min-h-[120px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'All Game' && (
                            <motion.div
                                key="All Game"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CustomSlider />
                            </motion.div>
                        )}

                        {activeTab === 'Top Game' && (
                            <motion.div
                                key="Top Game"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-20 font-bold mb-2">top games</h2>
                                <p>Bet on your favorite sports including cricket, football, and basketball.</p>
                            </motion.div>
                        )}

                        {activeTab === 'New Game' && (
                            <motion.div
                                key="New Game"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CustomSlider />
                            </motion.div>
                        )}
                        {activeTab === 'special' && (
                            <motion.div
                                key="special"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CustomSlider />
                            </motion.div>
                        )}
                        {activeTab === 'Slots' && (
                            <motion.div
                                key="Slots"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CustomSlider />
                            </motion.div>
                        )}
                        {activeTab === 'Live' && (
                            <motion.div
                                key="Live"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CustomSlider />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
