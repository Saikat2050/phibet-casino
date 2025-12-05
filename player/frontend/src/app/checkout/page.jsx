"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useCheckoutStore from "@/store/useCheckoutStore";
import { toast } from 'react-toastify';
import CheckoutCard from "@/components/CheckoutCard";

const CheckoutPage = () => {
  const router = useRouter();
  const { checkoutData, clearCheckoutData } = useCheckoutStore();

  useEffect(() => {
    if (!checkoutData) {
      // toast.error("No data available. Redirecting to home.");
      router.push("/");
    }
  }, [checkoutData, router]);

  if (!checkoutData) {
    return (
      <div className="loading-state">
        <div className="loading"></div>
      </div>
    );
  }

  const { pkg, userData, paymentData } = checkoutData;

  return (
    <CheckoutCard
      pkg={pkg}
      userData={userData}
      data={paymentData}
      onClose={() => router.push("/")}
    />
  );
};

export default CheckoutPage;
