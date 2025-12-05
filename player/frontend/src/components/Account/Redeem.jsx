"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PrimaryButton } from "../Common/Button";
import { toast } from 'react-toastify';
import useUserStore from "@/store/useUserStore";
import { initPay, getBanksAction, addBankAction, getProfile } from "@/actions";
import RedeemSuccessModal from "../Common/RedeemSuccessModal";
import useModalsStore from "@/store/useModalsStore";
import RedemptionRequestsTable from "./RedemptionRequestsTable";
import SkrillIcon from "@/assets/images/skrill.png";
import PushCashIcon from "@/assets/images/PushCash.svg";
import BankIcon from "@/assets/images/bank.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePaymentProviders } from '@/hooks/usePaymentProviders';
import { getCookie } from "@/utils/clientCookieUtils";
import { IoArrowBack } from "react-icons/io5";
import { useIP } from "@/utils/ipUtils";

const Redeem = () => {
  const [redeemMethod, setRedeemMethod] = useState("");
  const [methodSelected, setMethodSelected] = useState(false);
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [amountError, setAmountError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, setUser,userIp, setUserIp } = useUserStore();
  const { openModal } = useModalsStore();
  const searchParams = useSearchParams();
  const [buttonLoading, setButtonLoading] = useState(false);
  const router = useRouter();
  const [hasShownToast, setHasShownToast] = useState(false);
  const pushcashId = user?.isDepositCompleted;
  const userToken = getCookie("accessToken");
  useIP(setUserIp);
  const {
    loading: providersLoading,
    error: providersError,
    paymentProviders,
    paysafeProvider,
    pushCashProvider
  } = usePaymentProviders();

  async function fetchUserProfile() {
    const res = await getProfile();
    setUser(res);
  }

  useEffect(() => {
    fetchUserProfile()
  },[])
  useEffect(() => {
    const hasIncompleteProfile =
      user?.kycStatus === "K4" || user?.kycStatus === "K5";

    if (!hasIncompleteProfile && !hasShownToast) {
      setHasShownToast(true);
      setTimeout(() => {
        toast.dismiss();
        if(userToken){
        router.replace("/user/profile");
        toast.error("Please complete KYC first");
        }
      }, 1000);
    }
  }, [user, router, hasShownToast,userToken]);
  useEffect(() => {
    if (redeemMethod === "payByBank") {
      fetchBanks();
    }
  }, [redeemMethod]);

  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "true") {
      setRedeemMethod("payByBank");
      setMethodSelected(true);
    }
  }, [searchParams]);

  const fetchBanks = async () => {
    setLoading(true);
    try {
      const { success, data } = await getBanksAction();

      if (success) {
        setBanks(data);
      }
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMaxClick = () => {
    setAmount(user?.userWallet?.scCoin?.wsc);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    setLoading(true);

    if (!/^\d+(\.\d+)?$/.test(amount)) {
      setAmountError("Amount must be a valid number.");
      setLoading(false);
      return;
    }

    if (user.minRedeemableCoins > amount) {
      setAmountError(
        `Minimum redeemable amount is ${user?.minRedeemableCoins}`
      );
      setLoading(false); // Reset loading on error
      return;
    }
    let hasError = false;
    if (!amount) {
      setAmountError("Amount is required");
      hasError = true;
    } else {
      setAmountError("");
    }
    if (redeemMethod === "skrill" && !email) {
      setEmailError("Skrill Email Address is required");
      hasError = true;
    } else {
      setEmailError("");
    }
    if (redeemMethod === "payByBank" && !selectedBank) {
      toast.error("Please select a bank account.");
      hasError = true;
    }

    if (
      (redeemMethod === "skrill" || redeemMethod === "pushcash") &&
      !isConfirmed
    ) {
      toast.error("Please confirm that the information provided is correct.");
      setLoading(false); // Reset loading
      return;
    }

    if (!hasError) {
      const initPayData = {
        amount: parseFloat(amount),
        paymentType: "redeem",
        actionableEmail: redeemMethod === "skrill" ? email : user?.email,
        username: user?.username || "testuser",
        email: user?.email,
      };

      if (redeemMethod === "payByBank") {
        initPayData.paymentProvider = "PAY_BY_BANK";
        initPayData.bankAccountId = selectedBank.id;
      } else if (redeemMethod === "pushcash") {
        initPayData.paymentProvider = "PUSHCASH";
      }

      try {
        const { success, data, message } = await initPay(initPayData,userIp);

        if (success && redeemMethod === "pushcash") {
          const link = data?.paymentData?.url;
          if (link) {
            window.open(link, "_blank");
            return;
          }
        } else if (success) {
          toast.success("Redeem request submitted successfully.");
          openModal(<RedeemSuccessModal />);
        } else {
          toast.error(message || "Failed to submit redeem request.");
        }
      } catch (error) {
        console.error("Error in redeem request:", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setLoading(false); // Reset loading after API call
      }
    } else {
      setLoading(false); // Reset loading if validation fails
    }
  };

  const handleAddBank = async () => {
    try {
      if (!amount) {
        setAmountError("Amount is required");
        hasError = true;
        return;
      } else {
        setAmountError("");
      }

      const { success, data } = await addBankAction({
        amount: parseFloat(amount),
      });
      if (success) {
        // openModal(
        //   <iframe src={data.redirectUrl} className="min-w-[80%] min-h-[90vh]" />
        // );
        window.open(data.redirectUrl, "_blank");
      } else {
        toast.error("Failed to add bank account.");
      }
    } catch (error) {
      console.error("Error adding bank account:", error);
    }
  };

  const handleRedeemMethodSelection = (method) => {
    setRedeemMethod(method);
    setMethodSelected(true);
  };

  const handleBackClick = () => {
    setMethodSelected(false);
    setRedeemMethod("");
    setAmount("");
    setEmail("");
    setSelectedBank(null);
    setBanks([]);
  };
  return (
    <div className="py-[30px] px-3 nlg:px-[50px] max-xl:py-6 md:min-h-[505px]">
      <div>
        <div className="flex items-center justify-between mb-4 md:hidden">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/user')}>
            <IoArrowBack className="text-white text-lg" />
            <span className="text-white text-sm font-bold capitalize">
              Back to Menu
            </span>
          </div>
          <span className="text-white text-sm font-bold capitalize">
            Redeem
          </span>
        </div>
        {!methodSelected ? (
          <div className="max-w-[580px] mx-auto mb-6 mt-6">
            <label className="block text-[1rem] font-bold leading-[1.375rem] text-white mb-4">
              Select Redeem Method
            </label>
            {providersLoading ? (
              <div className="text-center p-4   rounded-lg">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-300"></div>
                  <span className="ml-3 text-white text-lg">Loading redeem methods...</span>
                </div>
              </div>
            ) : (!(paysafeProvider?.paymentProviderName== "PAYSAFE" && paysafeProvider?.withdrawAllowed) && !(pushCashProvider?.paymentProviderName== "PUSHCASH" && pushCashProvider?.withdrawAllowed)) ? (
              <div className="text-center p-4   rounded-lg">
                <p className="text-white text-lg">No redeem methods available</p>
              </div>
            ) : (
              <>
                {(paysafeProvider?.paymentProviderName== "PAYSAFE" && paysafeProvider?.withdrawAllowed) &&
                <div className="grid grid-cols-1 gap-4 my-1 hover:scale-105 transition-transform duration-200">
                <div
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer ${
                    redeemMethod === "skrill"
                      ? "bg-white border-green-500"
                      : "  border "
                  } hover:border-green-400`}
                  onClick={() => handleRedeemMethodSelection("skrill")}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded bg-white">
                      <Image
                        src={SkrillIcon}
                        alt="Skrill"
                        className="w-6 h-6"
                        height={100}
                        width={100}
                      />
                    </div>
                    <span className="text-white text-lg font-bold">Skrill</span>
                  </div>
                </div>

                {/*   <div
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer ${redeemMethod === "payByBank"
                    ? "bg-white border-green-500"
                    : "  border "
                    } hover:border-green-400`}
                  onClick={() => handleRedeemMethodSelection("payByBank")}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded bg-white">
                      <Image
                        src={BankIcon}
                        alt="Pay By Bank"
                        className="w-6 h-6"
                        height={100}
                        width={100}
                      />
                    </div>
                    <span className="text-white text-lg font-bold">
                      Pay By Bank
                    </span>
                  </div>
                </div> */}
                </div>
                }

                {pushcashId && (
                  (pushCashProvider?.paymentProviderName== "PUSHCASH" && pushCashProvider?.withdrawAllowed) &&
                  <div className="grid grid-cols-1 gap-4 hover:scale-105 transition-transform duration-200">
                    <div
                      className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer ${
                        redeemMethod === "skrill"
                          ? "bg-white border-green-500"
                          : "  border "
                      } hover:border-green-400`}
                      onClick={() => handleRedeemMethodSelection("pushcash")}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded bg-white">
                          <Image
                            src={PushCashIcon}
                            alt="Skrill"
                            className="w-6 h-6"
                            height={100}
                            width={100}
                          />
                        </div>
                        <span className="text-white text-lg font-bold capitalize">
                          push cash
                        </span>
                      </div>
                    </div>

                    {/*   <div
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer ${redeemMethod === "payByBank"
                      ? "bg-white border-green-500"
                      : "  border "
                      } hover:border-green-400`}
                    onClick={() => handleRedeemMethodSelection("payByBank")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded bg-white">
                        <Image
                          src={BankIcon}
                          alt="Pay By Bank"
                          className="w-6 h-6"
                          height={100}
                          width={100}
                        />
                      </div>
                      <span className="text-white text-lg font-bold">
                        Pay By Bank
                      </span>
                    </div>
                  </div> */}
                  </div>
                )}
              </>
            )}
          </div>
        ) : redeemMethod === "skrill" || redeemMethod === "pushcash" ? (
          <form onSubmit={handleConfirm}>
            <div className="max-w-[580px] mx-auto">
              <div className="  border border-green-300 rounded-[0.5rem] px-[0.625rem] py-[1rem] mb-2.5 md:mb-12">
                <div className="mb-4">
                  <label
                    className="block text-[1rem] font-bold leading-[1.375rem] text-white mb-[10px]"
                    htmlFor="redeemAmount"
                  >
                    Redeem Your Amount
                  </label>
                  <p className="text-[0.625rem] text-white text-normal mb-[0.313rem]">
                    Maximum redeemable amount:{user?.userWallet?.scCoin?.wsc}
                  </p>
                  <div className="flex">
                    <input
                      type="text"
                      id="redeemAmount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Amount"
                      className="flex-grow p-2   text-white text-sm rounded-l-[5px] placeholder  outline-none focus:ring-2 focus:bg-[rgba(62,62,62,0.3)] focus:ring-green-100 rounded-tr-none rounded-br-none"
                    />
                    <button
                      type="button"
                      onClick={handleMaxClick}
                      className="bg-white text-white font-bold p-2 rounded-r-[5px]"
                    >
                      MAX
                    </button>
                  </div>
                  {amountError && (
                    <p className="text-red-500 text-xs mt-2">{amountError}</p>
                  )}
                </div>

                {redeemMethod === "skrill" && (
                  <div className="mb-4">
                    <label
                      className="block text-[1rem] font-bold leading-[1.375rem] text-white mb-[10px]"
                      htmlFor="skrillEmail"
                    >
                      Skrill Email Address
                    </label>
                    <input
                      type="email"
                      id="skrillEmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Skrill Email Address"
                      className="w-full p-2   text-white text-sm rounded-[5px] placeholder  outline-none focus:ring-2 focus:bg-[rgba(62,62,62,0.3)] focus:ring-green-100"
                    />
                    {emailError && (
                      <p className="text-red-500 text-xs mt-2">{emailError}</p>
                    )}
                  </div>
                )}
                <div className="flex items-start gap-2 pt-2.5 pb-1 mt-4">
                  <input
                    type="checkbox"
                    checked={isConfirmed}
                    onChange={() => setIsConfirmed(!isConfirmed)}
                    className="form-checkbox h-5 min-h-5 w-5 min-w-5 p-0
               checked:bg-checkIcon checked:bg-contain checked:drop-shadow-checkboxShadow
               rounded appearance-none border-2 border-solid border-white bg-transparent cursor-pointer
               transition-all duration-300 ease-in-out transform
               checked:scale-110 checked:shadow-lg checked:border-green-400"
                  />
                  {redeemMethod === "skrill" ? (
                    <p className="text-sm  ">
                      I confirm that the information provided is correct. Skrill
                      redemption email MUST match email on your Phibet
                      account or your redemption will be cancelled.
                    </p>
                  ) : (
                    <p className="text-sm  ">
                      I confirm that the information provided is correct.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between max-sm:flex-col max-sm: gap-4">
                <PrimaryButton
                  type="button"
                  onClick={handleBackClick}
                  className="h-[44px] min-w-[5.3125rem]"
                >
                  Back
                </PrimaryButton>
                <PrimaryButton
                  type="submit"
                  className={`h-[44px] min-w-[11.3125rem] ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Confirm"}
                </PrimaryButton>
                <PrimaryButton
                  onClick={() => openModal(<RedemptionRequestsTable />)}
                >
                  Show Requests
                </PrimaryButton>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleConfirm}>
            <div className="max-w-[580px] mx-auto">
              <div className="  border border-green-300 rounded-[0.5rem] px-[0.625rem] py-[1rem] mb-2.5 md:mb-12">
                <div className="mb-4">
                  <label
                    className="block text-[1rem] font-bold leading-[1.375rem] text-white mb-[10px]"
                    htmlFor="redeemAmount"
                  >
                    Redeem Your Amount
                  </label>
                  <p className="text-[0.625rem] text-white text-normal mb-[0.313rem]">
                    Maximum redeemable amount:{user?.userWallet?.scCoin?.wsc}
                  </p>
                  <div className="flex">
                    <input
                      type="text"
                      id="redeemAmount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Amount"
                      className="flex-grow p-2   text-white text-sm rounded-l-[5px] placeholder  outline-none focus:ring-2 focus:bg-[rgba(62,62,62,0.3)] focus:ring-green-100 rounded-tr-none rounded-br-none"
                    />
                    <button
                      type="button"
                      onClick={handleMaxClick}
                      className="bg-white text-white font-bold p-2 rounded-r-[5px]"
                    >
                      MAX
                    </button>
                  </div>
                  {amountError && (
                    <p className="text-red-500 text-xs mt-2">{amountError}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-[1rem] font-bold leading-[1.375rem] text-white mb-[10px]">
                    Select Your Bank Account
                  </label>
                  {loading ? (
                    <p className=" 00">Loading banks...</p>
                  ) : banks.length > 0 ? (
                    <div className="flex flex-col gap-2   p-2">
                      {banks.map((bank) => (
                        <div
                          key={bank.id}
                          className={`flex items-start border justify-between gap-2 p-2 rounded cursor-pointer  00 ${
                            selectedBank?.id === bank.id
                              ? " border-green-300 "
                              : " border  "
                          }`}
                          onClick={() => setSelectedBank(bank)}
                        >
                          <div className="">
                            <h2 className="text-md text-white font-bold">
                              {bank.bankName}
                            </h2>
                            <h3 className="text-white text-sm">
                              {bank.accountHolderName}
                            </h3>
                          </div>

                          <div className="text-white font-bold text-sm">
                            {bank.lastDigits}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className=" 00">No bank accounts found.</p>
                  )}

                  <button
                    type="button"
                    onClick={() => handleAddBank()}
                    className="mt-2 text-white underline"
                  >
                    Add New Bank
                  </button>
                  <div className="flex-col justify-between max-sm:flex-col mt-4">
                    {banks.length == 0 && (
                      <>
                        <ul className="list-none text-base  ">
                          <li className="before:content-['★'] before:mr-2 before: 00">
                            <a
                              target="_blank"
                              href="https://www.skrill.com/en-us/pay-by-bank-terms-and-conditions"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              Terms and Conditions
                            </a>
                          </li>
                          <li className="before:content-['★'] before:mr-2 before: 00">
                            Pay by Bank is powered by Skrill USA, Inc. Skrill
                            USA, Inc. is registered with FinCEN and duly
                            licensed as a money transmitter in various U.S.
                            states.
                          </li>
                        </ul>

                        {/* <p className="text-sm  ">
                          <ul>
                          <a
                            target="_blank"
                            href="https://www.skrill.com/en-us/pay-by-bank-terms-and-conditions"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            T&Cs:{" "}
                          </a>
                          </ul>
                        </p>
                        <p className="text-sm  ">
                          Pay by Bank is powered by Skrill USA, Inc.  Skrill USA, Inc. is registered with FinCEN and duly licensed as a money transmitter in various U.S. states.
                        </p> */}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between max-sm:flex-col max-sm: gap-4">
                <PrimaryButton
                  type="button"
                  onClick={handleBackClick}
                  className="h-[44px] min-w-[5.3125rem]"
                >
                  Back
                </PrimaryButton>
                <PrimaryButton
                  type="submit"
                  className="h-[44px] min-w-[11.3125rem]"
                >
                  Confirm
                </PrimaryButton>
                <PrimaryButton
                  onClick={() => openModal(<RedemptionRequestsTable />)}
                >
                  Show Requests
                </PrimaryButton>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Redeem;
