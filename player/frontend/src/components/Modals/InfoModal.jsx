import React from 'react';
import Cross from "@/assets/images/Cross";
import { SecondaryButton } from "../Common/Button";

const InfoModal = ({ title, textTitle, textContent, handleClose, handleOnClick, buttonLabel = "Close" }) => {

  return (
    <div className="bg-[#212537] relative w-full max-w-[600px] p-4 md:px-10 md:py-8 rounded-md">
      <button
        onClick={handleClose}
        className="absolute top-5 right-5 inline-block cursor-pointer z-50 hover:rotate-90 transition-transform duration-200"
      >
        <Cross />
      </button>

      <h2 className="font-bold text-xl text-white mb-4">{title}</h2>

      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">{textTitle}</h3>
        <p className=" 00">{textContent}</p>
      </div>

      <div className="flex justify-center">
        <SecondaryButton
          onClick={handleOnClick}
          className="!min-w-20 sm:min-w-36 w-full max-w-sm:full [&>.thirdSpan]:max-sm:flex [&>.thirdSpan]:max-sm:justify-center [&>.thirdSpan]:max-sm:max-w-full [&>.thirdSpan]:text-sm [&>.secondSpan]:max-sm:max-w-full [&>.firstSpan]:max-sm:max-w-full"
        >
          {buttonLabel}
        </SecondaryButton>
      </div>
    </div>
  );
};

export default InfoModal;