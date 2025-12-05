"use client";
import useCheckoutStore from "@/store/useCheckoutStore";
import useModalsStore from "@/store/useModalsStore";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from 'react-toastify';
import { PrimaryButton } from "../Common/Button";
import ShowPaymentMethodsModal from "../Modals/ShowPaymentMethodsModal";
import ShowCoinPackageMoal from "../ShowCoinsPackagesModal";

const PurchaseButton = ({ pkg }) => {
  const { setCheckoutData } = useCheckoutStore();
  const { openModal, closeModal, clearModals } = useModalsStore();
  const { user } = useUserStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const dummyUser = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@gmail.com",
    phone: "5551234567",
    dateOfBirth: "1990-01-15",
    addressLine_1: "123 Main St",
    addressLine_2: "Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "US",
    userId: "123456789",
  };

  const isUserProfileComplete = (user) => {
    return (
      user?.firstName &&
      user?.dateOfBirth &&
      user?.addressLine_1 &&
      user?.countryCode &&
      user?.state &&
      user?.city &&
      user?.zipCode
    );
  };

  const handlePurchase = async () => {
    if (!isUserProfileComplete(user)) {
      toast.error("Please complete your profile before purchasing.");
      router.push("/user/profile");
      return;
    }
    closeModal(<ShowCoinPackageMoal />);
    openModal(<ShowPaymentMethodsModal pkg={pkg} />);

  };

  /*
    once we get success from the purchase package. on that particular function we need to call below function:
   const trackPurchaseEvent = (purchaseData) => {
    try {
      if (typeof window === 'undefined' || !window.dataLayer) {
        console.warn('DataLayer not available');
        return;
      }

      const requiredFields = ['packageId', 'packageName', 'price', 'transactionId', 'userId'];
      const missingFields = requiredFields.filter(field => !purchaseData[field]);

      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        return;
      }

      window.dataLayer.push({ ecommerce: null });

      window.dataLayer.push({
        event: "purchase",
        ecommerce: {
          transaction_id: purchaseData.transactionId,
          value: purchaseData.price * (purchaseData.quantity || 1),
          currency: purchaseData.currency || "USD",
          item_id: purchaseData.packageId,
          item_name: purchaseData.packageName,
          quantity: purchaseData.quantity || 1,
          price: purchaseData.price
        },
        user_id: purchaseData.userId,
        affiliate_id: purchaseData.affiliateId || '',
        click_id: purchaseData.clickId
      });

    } catch (error) {
      console.error('Error tracking purchase event:', error);
    }
  }; */
  return (
    <PrimaryButton
      onClick={handlePurchase}
      disabled={loading}
      className="max-w-full sm:max-w-[117px] w-full text-xs"
    >
      ${pkg.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
    </PrimaryButton>
  );
};

export default PurchaseButton;
