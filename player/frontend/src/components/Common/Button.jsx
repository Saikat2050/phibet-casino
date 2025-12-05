import React from "react";

export const PrimaryButton = ({
  children,
  type = "button",
  onClick,
  className = "",
  isLoading = false,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={
        className +
        " relative h-10 w-fit rounded-px_32 p-0.5 flex items-center justify-center overflow-hidden shadow-primaryBtnShadow capitalize"
      }
    >
      <span className="absolute w-full h-full bg-borderGradient"></span>
      <span className="bg-primaryButtonGradient relative z-[1] w-full h-full flex justify-center items-center px-3 rounded-px_30 text-16 font-medium">{children}</span>
    </button>
  );
};

export const SecondaryButton = ({
  children,
  type = "button",
  onClick,
  className = "",
  isLoading = false,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={
        className +
        " relative h-10 w-fit rounded-px_32 p-0.5 flex items-center justify-center overflow-hidden capitalize"
      }
    >
      <span className="absolute w-full h-full bg-primary-border"></span>
      <span className="bg-primary-400 relative z-[1] w-full h-full flex justify-center items-center px-3 rounded-px_30 text-16 font-medium">{children}</span>
    </button>
  );
};

export const PinkSecondaryButton = ({
  children,
  type = "button",
  onClick,
  className = "",
  isLoading = false,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={
        className +
        " relative bg-transparent capitalize  p-0 border-none cursor-pointer outline-offset-4 transition hover:brightness-110 hover:shadow-md focus:outline-none "
      }
    >
      <span className="absolute inset-0 bg-black rounded-md blur-[2px] transform translate-y-[2px] transition-transform duration-[200ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] hover:translate-y-[4px] active:translate-y-[1px] firstSpan"></span>
      <span className="absolute inset-0 rounded-md bg-pink-2 secondSpan"></span>
      <span className="relative block rounded-md bg-pink-2 py-2 px-8 text-white font-bold tracking-wider text-16 transform -translate-y-[4px] transition-transform duration-[200ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] hover:-translate-y-[6px] active:translate-y-[-2px] hover:shadow-md thirdSpan">
        {children}
      </span>
    </button>
  );
};

export const GrayButton = ({
  children,
  type = "button",
  onClick,
  className = "",
  isLoading = false,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={
        className +
        " relative bg-transparent capitalize  max-h-[31px] p-0 border-none cursor-pointer outline-offset-4 transition hover:brightness-110 hover:shadow-md focus:outline-none"
      }
    >
      <span className="absolute inset-0 bg-black rounded-md blur-[2px] max-h-[31px] transform translate-y-[2px] transition-transform duration-[200ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] hover:translate-y-[4px] active:translate-y-[1px] hover:shadow-md"></span>
      <span className="absolute inset-0 rounded-md bg-gray-600 max-h-[31px] shadow-btnShadow2"></span>
      <span className="btntext relative block rounded-md bg-gray-700 max-h-[31px] py-2 px-2 min-w-[68px] text-white font-semibold tracking-wider text-14 leading-none transform -translate-y-[4px] transition-transform duration-[200ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] hover:-translate-y-[6px] active:translate-y-[-2px] hover:shadow-md">
        {children}
      </span>
    </button>
  );
};
