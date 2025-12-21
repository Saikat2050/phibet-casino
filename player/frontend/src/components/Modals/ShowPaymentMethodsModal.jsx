"use client";

import { getCashierAPIData, getProfile, initPay, removePromotionCode, validatePromoCode } from "@/actions";
import AmericanExpressIcon from "@/assets/images/AmericanExpressIcon";
import ArrowForward from "@/assets/images/ArrowForward";
import Cross from "@/assets/images/Cross";
import MasterCardIcon from "@/assets/images/MasterCardIcon";
import VisaIcon from "@/assets/images/VisaIcon";
import useCheckoutStore from "@/store/useCheckoutStore";
import useModalsStore from "@/store/useModalsStore";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from 'react-toastify';
import { SecondaryButton } from "../Common/Button";
import SkrillIcon from "@/assets/images/SkrillIcon";
import PayByBank from "@/assets/images/PayByBankIcon";
import CardPurchaseModal from "./CardPurchaseModal";
import ApplePayIcon from "@/assets/images/ApplePayIcon";
import GooglePayIcon from "@/assets/images/GooglePayIcon";
import VisaDebit from "@/assets/images/VisaDebitIcon";
import MasterCardIcon2 from "@/assets/images/MasterCard.svg";
import AchLogo from "@/assets/images/achlogo.webp";
import { PrimaryButton } from "@/components/Common/Button";
import Confetti from "react-confetti";
import Image from "next/image";
import { useCashierStore } from "@/store/useCashierStore";
import { usePaymentProviders } from '@/hooks/usePaymentProviders';
import AmericanBank from "@/assets/images/png/american.png";
import Bank2 from "@/assets/images/png/bank2.png";
import CitiBank from "@/assets/images/png/Citi.png";
import FinixPaymentInstrumentModal from './FinixPaymentInstrumentModal';
import { useIP } from "@/utils/ipUtils";

const PaymentMethodSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex flex-wrap justify-between items-center bg-white py-4 px-3 my-4 rounded-lg">
        <div className="flex items-center gap-2 max-sm:justify-around max-sm:w-full">
          <div className="w-12 h-8   rounded"></div>
          <div className="w-12 h-8   rounded"></div>
          <div className="w-12 h-8   rounded"></div>
        </div>
        <div className="max-sm:w-full">
          <div className="flex items-center max-sm:w-full max-sm:justify-between max-sm:mt-2 gap-2">
            <div className="w-32 h-6   rounded"></div>
            <div className="w-12 h-12   rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
const ShowPaymentMethodsModal = ({ pkg }) => {
  const { closeModal, clearModals, openModal } = useModalsStore();
  const { user, setUserIp, userIp } = useUserStore();
  useIP(setUserIp);
  const { setCheckoutData } = useCheckoutStore();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isPromoDisplay, setIsPromoDisplay] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeMessage, setPromoCodeMessage] = useState({
    message: "",
    error: false,
  });
  const [iscodeClaimed, setIsCodeClaimed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    loading: providersLoading,
    error: providersError,
    paymentProviders,
    approvelyProvider,
    pushCashProvider,
    paysafeProvider,
    payByBankProvider,
    finixProvider
  } = usePaymentProviders();

  const router = useRouter();

  const clearModal = () => {
    closeModal(<ShowPaymentMethodsModal />);
  };

  const setPromoMessage = (message, isError = false) => {
    setPromoCodeMessage((prevState) => ({
      ...prevState,
      message,
      error: isError,
    }));
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

  async function getUserProfile() {
    try {
      const res1 = await getProfile();
      setIsPromoDisplay(res1?.isAllPromocodeDisabled);
      setShowSkeleton(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setShowSkeleton(false);
    }
  }

  useEffect(() => {
    if (user) {
      getUserProfile();
    } else {
      setShowSkeleton(false);
    }
  }, [user]);

  const handleOnlinePurchase = async () => {
    if (!isUserProfileComplete(user)) {
      toast.error("Please complete your profile before purchasing.");
      router.push("/user/profile");
      return;
    }
    closeModal(<ShowPaymentMethodsModal />);
    try {
      const initPayData = {
        amount: pkg.amount,
        packageId: pkg?.packageId,
        paymentType: "deposit",
        promocode: promoCode,
      };
      const { success, data, message } = await initPay(initPayData,userIp);

      if (data?.limitCheck?.message) {
        toast.error(data?.limitCheck?.message);
        router.push("/");
        clearModals();
        return;
      }

      if (success) {
        setCheckoutData({
          pkg,
          userData: user,
          paymentData: data.paymentData,
        });

        router.push("/checkout");
        clearModals();
        // openModal(
        //   <CheckoutCard
        //     pkg={pkg}
        //     userData={user}
        //     data={data.paymentData}
        //     onClose={clearModals}
        //   />
        // );
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
    }
  };

  useEffect(() => {
    if (promoCode === "") {
      setPromoMessage("", false);
    }
  }, [promoCode]);

  const handlePromoCode = async (promoCode) => {
    // Regex to allow only alphanumeric characters (letters and numbers)
    const promoCodeRegex = /^[a-zA-Z0-9]+$/;

    if (!promoCodeRegex.test(promoCode)) {
      toast.error(
        "Promo code must be alphanumeric and cannot contain special characters or negative values."
      );
      return;
    }
    setLoading(true);
    const promocodePayload = {
      promocode: promoCode,
      packageId: parseInt(pkg?.packageId, 10),
    };

    if (!promoCode) {
      toast.error("Promo code is required");
      return;
    } else {
      const response = await validatePromoCode(promocodePayload);

      const {
        discountedAmount,
        discountPercentage,
        discountedGC,
        discountedSc,
      } = response?.data || {};

      if (response?.success) {
        const scCoin = Number(response?.data?.packageData?.scCoin) || 0; // Ensure it's a number
        // case -1 if we are getting discount on amount we have to show "you will get discount on amount"
        // case - 2 if we are getting bonusSc and bonusGC we will have to show both the balances on toast
        if (discountedAmount) {
          // Case 1: Showing discount on selected amount
          setPromoMessage(
            `You will get ${discountPercentage}% off on the selected amount.`
          );
        } else if (discountedGC || discountedSc) {
          // Case 2: Showing extra USD and USD coins
          let message = "You're getting";
          if (discountedGC) message += ` ${discountedGC} extra USD`;
          if (discountedGC && discountedSc) message += " and";
          if (discountedSc) message += ` ${discountedSc} extra USD`;
          message += " coins!";
          setPromoMessage(message);
        }
        toast.success("Promocode applied successfully");
        setIsCodeClaimed(true);
        setShowConfetti(true);
        setLoading(false);
      } else {
        setPromoMessage(response?.message, true);
        toast.error(response?.message);
        setLoading(false);
      }
    }
  };

  const removePromoCode = async (promoCode) => {
    const promocodePayload = {
      promocode: promoCode,
      userId: user?.userId,
    };

    const response = await removePromotionCode(promocodePayload);

    if (response?.success) {
      setPromoCode("");
      setIsCodeClaimed(false);
      setShowConfetti(false);
      toast.success("Promo code removed successfully");
    } else {
      setPromoMessage(response?.message, true);
      toast.error(response?.message);
    }
  };
  const handleCardPurchase = async () => {
    if (!isUserProfileComplete(user)) {
      toast.error("Please complete your profile before purchasing.");
      router.push("/user/profile");
      return;
    }

    closeModal(<ShowPaymentMethodsModal />);

    try {
      const initPayData = {
        amount: pkg.amount,
        packageId: pkg?.packageId,
        paymentType: "deposit",
        paymentProvider: "CreditCard",
        promocode: promoCode,
      };

      const { success, data, message } = await initPay(initPayData,userIp);

      // First check if there's a limit check message
      if (data?.limitCheck?.message) {
        toast.error(data.limitCheck.message);
        clearModals();
        return; // Prevent further execution
      }

      if(data?.paymentData?.paymentProvider === "FINIX"){
        openModal(<FinixPaymentInstrumentModal paymentData={data.paymentData}  />);
        return;
      }
      else if(data?.paymentData?.paymentProvider === "APPROVELY"){
        openModal(<CardPurchaseModal paymentData={data?.paymentData} />);
        return;
      }
      // Only open the modal if there's no limit check message
      // if (success) {
      //   openModal(<CardPurchaseModal paymentData={data?.paymentData} />);
      //   return;
      // }

      // Handle other error cases
      toast.error(message);
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  const handlePushCashPurchase = async () => {
    if (!isUserProfileComplete(user)) {
      toast.error("Please complete your profile before purchasing.");
      router.push("/user/profile");
      return;
    }

    closeModal(<ShowPaymentMethodsModal />);

    try {
      const initPayData = {
        amount: pkg.amount,
        packageId: pkg?.packageId,
        paymentType: "deposit",
        paymentProvider: "PUSHCASH",
        promocode: promoCode,
      };

      const { success, data, message } = await initPay(initPayData,userIp);

      if (success) {
        const link = data?.paymentData?.link || data?.paymentData?.url;
        if (link) {
          window.open(link, "_blank");
          return;
        }
      }

      if (data?.limitCheck?.message) {
        toast.error(data.limitCheck.message);
        clearModals();
      } else if (!success) {
        toast.error(message);
      }


    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  const handleFinixPurchase = async () => {
    if (!isUserProfileComplete(user)) {
      toast.error("Please complete your profile before purchasing.");
      router.push("/user/profile");
      return;
    }

    closeModal(<ShowPaymentMethodsModal />);

    try {
      const initPayData = {
        amount: pkg.amount,
        packageId: pkg?.packageId,
        paymentType: "deposit",
        paymentProvider: "CreditCard",
        promocode: promoCode,
      };

      const { success, data, message } = await initPay(initPayData,userIp);


      if (data?.limitCheck?.message) {
        toast.error(data.limitCheck.message);
        clearModals();
        return;
      }

      if (success) {
        openModal(<FinixPaymentInstrumentModal paymentData={data.paymentData}  />);
        return;
      }

      if (!success) {
        toast.error(message);
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("Failed to initiate payment. Please try again.");
    }
  };
  return (
    <div className="bg-[#212537] relative w-full max-w-[600px] p-4 md:px-10 md:py-8 rounded-md">
      {showConfetti && (
        <Confetti width={"600px"} height={"420px"} recycle={false} />
      )}
      <button
        onClick={() => clearModals()}
        className="absolute top-5 right-5 inline-block cursor-pointer z-50 hover:rotate-90 transition-transform duration-200"
      >
        <Cross />
      </button>

      <h2 className="font-bold text-xl text-white">Select Payment Method</h2>

      {showSkeleton ? (
        <>
          <PaymentMethodSkeleton />
          <PaymentMethodSkeleton />
          <PaymentMethodSkeleton />
        </>
      ) : (
        <>
          {providersError && (
            <div className="flex flex-col items-center justify-center mt-4">
              <p className="font-bold text-red-400 text-md">{providersError}</p>
            </div>
          )}
          {providersLoading && (
            <div className="flex flex-col items-center justify-center mt-4">
              <p className="font-bold text-white text-md">Loading payment methods...</p>
            </div>
          )}
          {(!Array.isArray(paymentProviders) || paymentProviders.length === 0) && !providersLoading && !providersError && (
            <div className="flex flex-col items-center justify-center mt-4">
              <p className="font-bold text-red-400 text-md">No payment methods available</p>
            </div>
          )}

          {((approvelyProvider && approvelyProvider.paymentProviderName === "APPROVELY" && approvelyProvider.depositAllowed) || (finixProvider && finixProvider.paymentProviderName == "FINIX" && finixProvider.depositAllowed)) && <div
            className={`flex flex-wrap justify-between items-center bg-white py-4 px-3 my-4 rounded-lg hover:scale-105 transition-transform duration-300  ${promoCodeMessage.error ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            onClick={() => {
              if (!promoCodeMessage.error) {
                handleCardPurchase();
              }
            }}
          >
            <div className="flex items-center gap-2 max-sm:justify-around max-sm:w-full ">
              <MasterCardIcon />
              <VisaIcon />
              <AmericanExpressIcon />
              <ApplePayIcon />
              <GooglePayIcon />
            </div>
            <div className="max-sm:w-full">
              <span className="flex items-center max-sm:w-full max-sm:justify-between max-sm:mt-2 gap-2 uppercase font-extrabold text-[#1a7946] text-lg whitespace-nowrap">
                Credit Card{" "}
                <button
                  className={`bg-[#1a7946] p-4 rounded-xl ${promoCodeMessage.error ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  disabled={promoCodeMessage.error}
                >
                  <ArrowForward />
                </button>
              </span>
            </div>
          </div>}

          {(pushCashProvider && pushCashProvider.paymentProviderName === "PUSHCASH" && pushCashProvider.depositAllowed) && <div
            className={`flex flex-wrap justify-between items-center bg-white py-4 px-3 my-3 rounded-lg hover:scale-105 transition-transform duration-300 ${promoCodeMessage.error ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            onClick={() => {
              if (!promoCodeMessage.error) {
                handlePushCashPurchase();
              }
            }}
          >
            <div className="flex items-center gap-6 max-sm:justify-around max-sm:w-full">
              <VisaDebit />
              <Image
                src={MasterCardIcon2}
                width={70}
                height={50}
                alt="MasterCard"
              />
              <Image src={AchLogo} width={70} height={50} alt="AchLogo" />
            </div>
            <div className="max-sm:w-full">
              <span className="flex items-center max-sm:w-full max-sm:justify-between max-sm:mt-2 gap-2 uppercase font-extrabold  text-lg whitespace-nowrap">
                <span className="flex flex-col items-end">
                  <span className="text-lg text-[#1a7946]">Instant Debit</span>
                  <span className="text-xs">(No Fees)</span>
                </span>
                <button
                  className={`bg-[#1a7946] p-4 rounded-xl ${promoCodeMessage.error ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  disabled={promoCodeMessage.error}
                >
                  <ArrowForward />
                </button>
              </span>
            </div>
          </div>}

          {(paysafeProvider && paysafeProvider.paymentProviderName === "PAYSAFE" && paysafeProvider.depositAllowed) && <div
            className={`flex flex-wrap justify-between items-center bg-white py-4 px-3 my-3 rounded-lg hover:scale-105 transition-transform duration-300 ${promoCodeMessage.error ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            onClick={() => {
              if (!promoCodeMessage.error) {
                handleOnlinePurchase();
              }
            }}
          >
            <div className="flex items-center gap-2 justify-start max-sm:w-full">
              <SkrillIcon />
            </div>
            <div className="max-sm:w-full">
              <span className="flex items-center max-sm:w-full max-sm:justify-between max-sm:mt-2 gap-2 uppercase font-extrabold text-[#1a7946] text-lg whitespace-nowrap">
                Skrill{" "}
                <button
                  className={`bg-[#1a7946] p-4 rounded-xl ${promoCodeMessage.error ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  disabled={promoCodeMessage.error}
                >
                  <ArrowForward />
                </button>
              </span>
            </div>
          </div>}

          <div className="w-full text-center mt-4">
            {(!isPromoDisplay) &&
              <>
                <div className="flex-col flex md:flex-row justify-center my-4 gap-4 w-full">
                  <div className="relative w-full grow">
                    <input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      name="promoCode"
                      id="promoCode"
                      type="text"
                      className="  h-11 placeholder  text-white text-sm rounded-md block w-full px-4 py-3 border-2 border-solid border-transparent focus:border-green-300 focus:  focus:outline-none pr-10"
                      placeholder="Enter Promo Code"
                      readOnly={iscodeClaimed}
                    />
                    {promoCode && !iscodeClaimed && (
                      <button
                        onClick={() => setPromoCode("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2  00 hover:text-white focus:outline-none"
                      >
                        ✖
                      </button>
                    )}
                  </div>

                  {iscodeClaimed ? (
                    <SecondaryButton
                      onClick={() => {
                        removePromoCode(promoCode);
                      }}
                    >
                      Remove
                    </SecondaryButton>
                  ) : (
                    <PrimaryButton
                      onClick={() => {
                        handlePromoCode(promoCode);
                      }}
                      disabled={loading}
                    >
                      Activate
                    </PrimaryButton>
                  )}
                </div>

                {promoCodeMessage.message && (
                  <p
                    className={`${promoCodeMessage.error ? "text-white" : "text-white"
                      } text-left`}
                  >
                    {promoCodeMessage.message}
                  </p>
                )}

                <SecondaryButton
                  onClick={() => clearModal()}
                  className="!min-w-20 sm:min-w-36 w-full max-w-sm:full [&>.thirdSpan]:max-sm:flex [&>.thirdSpan]:max-sm:justify-center [&>.thirdSpan]:max-sm:max-w-full [&>.thirdSpan]:text-sm [&>.secondSpan]:max-sm:max-w-full [&>.firstSpan]:max-sm:max-w-full"
                >
                  Cancel Payment
                </SecondaryButton>
              </>
            }
          </div>
        </>
      )}
    </div>
  );
};

export default ShowPaymentMethodsModal;
