"use client";

import useModalsStore from "@/store/useModalsStore";
import React from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import AuthTab from '../AuthTab'
import AuthImg from '../../assets/auth/auth-img.webp'
import Image from 'next/image'
import closeGif from '../../assets/gif/close-icon.gif'

function Modals() {
  const { components, closeModal } = useModalsStore();

  const handleCloseModal = () => {
    closeModal(); // Modal closes unconditionally now
  };
  return components.length > 0
    ? components.map((Component, i) => (
      <Dialog
        key={i}
        open={true}
        onClose={handleCloseModal}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-modal-overlay backdrop-blur-lg transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex justify-center p-4 items-center min-h-dvh" >
            <DialogPanel className='relative w-full max-w-[63.25rem] bg-authBg bg-no-repeat bg-cover bg-right sm:bg-center grid grid-cols-1 sm:grid-cols-2 rounded-px_20' transition>
              <Image onClick={handleCloseModal} src={closeGif} className="fill-offWhite-500 absolute top-4 max-sm:top-1.5 right-4 size-8 z-[9] cursor-pointer" />
              <div className="px-4 mxs:px-6 sm:pl-6 nlg:pl-14 nlg:pr-10 pt-12 pb-8 sm:py-8 nlg:py-14 flex items-center justify-center">
                <AuthTab />
              </div>
              <div className="flex items-end justify-center max-sm:hidden">
                <Image src={AuthImg} alt='auth-img' className="max-w-[31.625rem] w-full" />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    ))
    : null;
}

export default Modals;
