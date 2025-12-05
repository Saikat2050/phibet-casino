"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '../Auth/Login';
import Signup from '../Auth/Signup';

export default function AuthTab() {
  const [activeTab, setActiveTab] = useState('Login');
  const tabs = ['Login', 'Register'];

  return (
    <div className="w-full">
      {/* Tabs Container */}
      <div className="relative inline-flex p-1 bg-tab-bg border border-solid border-primary-border rounded-full w-full">
        {/* Tab Buttons */}
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative z-10 px-4 py-2 text-sm font-medium rounded-full basis-1/2 transition-colors duration-300 ${
              activeTab === tab ? 'text-blackOpacity-100' : 'text-tertiary-300'
            }`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="activeBackground"
                className="absolute inset-0 bg-tertiary-300 rounded-full z-[-1]"
                // transition={{ stiffness: 500, damping: 30 }}
              />
            )}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Animated Tab Content */}
      <div className="mt-8 w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'Login' && (
            <motion.div
              key="Login"
            //   initial={{ opacity: 0, y: 10 }}
            //   animate={{ opacity: 1, y: 0 }}
            //   exit={{ opacity: 0, y: -10 }}
            //   transition={{ duration: 0.3 }}
            >
              <Login />
            </motion.div>
          )}

          {activeTab === 'Register' && (
            <motion.div
              key="Register"
            //   initial={{ opacity: 0, y: 10 }}
            //   animate={{ opacity: 1, y: 0 }}
            //   exit={{ opacity: 0, y: -10 }}
            //   transition={{ duration: 0.3 }}
            >
              <Signup />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}