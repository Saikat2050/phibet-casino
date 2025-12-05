"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import useModalsStore from "@/store/useModalsStore";
import { getPackages } from "@/actions";
import Cross from "@/assets/images/Cross";
import { toast } from 'react-toastify';

const CardPurchaseModal = ({ paymentData }) => {
  const { clearModals } = useModalsStore();
  const handleCloseModal = () => {
    clearModals();
    // toast.error("Payment could not be initialized.");
  };

  return (
    <div className="modal-main-container bg-transparent  min-w-[550px] max-sm:min-w-full mx-auto mt-10 rounded-lg relative h-[65vh]">
      <button
        onClick={() => handleCloseModal()}
        className="absolute top-2 py-2 right-2 inline-block cursor-pointer z-50 hover:rotate-90 transition-transform duration-200"
      >
        <Cross />
      </button>
      <iframe width={"100%"} height={"100%"} src={paymentData?.link} allow="payment"/>
    </div>
  );
};

export default CardPurchaseModal;
