"use client";
import { paysafePay } from "@/actions";
import { stateOptions } from "@/config/data";
import useLocationStore from "@/store/useLocationStore";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { getProfile } from "@/actions";
import useUserStore from "@/store/useUserStore";
import useModalsStore from "@/store/useModalsStore";
import { useRouter } from "next/navigation";
import useCheckoutStore from "@/store/useCheckoutStore";

const publicPaymentKey = process.env.NEXT_PUBLIC_PAYMENT_KEY;
const cardAccountId = process.env.NEXT_PUBLIC_CARD_ACCOUNT_ID;
const ENV = process.env.NEXT_PUBLIC_ENVIRONMENT;
const payByBankAccountId = process.env.NEXT_PUBLIC_PAY_BY_BANK_ACCOUNT_ID;
const skrillAccountId = process.env.NEXT_PUBLIC_SKRILL_KEY;
let instanceObj = null;
const CheckoutCard = ({ pkg, data, userData, onClose }) => {
  const { stateListing } = useLocationStore(); // Access stateListing and fetch action
  const { user, setUser } = useUserStore();
  const { openModal, closeModal, setIsCloseNeed, clearModals } =
    useModalsStore();
  const router = useRouter();
  const { checkoutData, clearCheckoutData } = useCheckoutStore();

  useEffect(() => {
    if (!data || !userData) {
      // toast.error("Invalid payment details.");
      router.push("/");
      onClose(); // Close modal if data is invalid
      clearCheckoutData();
      return;
    }

    // Find the user's state code from the state listing
    const stateCode = stateListing.find(
      (state) => state.state_id == userData.state
    )?.stateCode;

    // If stateCode is undefined, show an error and exit
    if (!stateCode) {
      // toast.error("User's state code is invalid.");
      router.push("/");
      onClose();
      clearCheckoutData();
      return;
    }

    const [year, month, day] = userData.dateOfBirth.split("-");

    try {
      const affiliateId = userData?.affiliateId || "Affiliate ID not available";
      const clickId = userData?.affiliateCode || "Click ID not available";

      paysafe.checkout.setup(
        btoa(publicPaymentKey),
        {
          amount: data.amount,
          currency: "USD",
          environment: ENV === "production" ? "LIVE" : "TEST",
          locale: "en_US",
          companyName: "Phibet",
          merchantRefNum: data?.merchantRefNum,

          singleUseCustomerToken: data?.singleUseCustomerToken,
          simulator: "EXTERNAL",
          customer: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone || "9988776655",
            dateOfBirth: { day: +day, month: +month, year: +year },
          },
          billingAddress: {
            nickName: `${userData.firstName} ${userData.lastName}`,
            street: userData.addressLine_1 || "",
            city: userData.city || "",
            zip: userData.zipCode || "",
            country: "US",
            state: stateCode,
          },
          paymentMethodDetails: {
            card: { accountId: cardAccountId },
            payByBank: {
              accountId: payByBankAccountId,
              consumerId: userData.userId,
            },
            skrill: {
              consumerId: userData?.userId,
              accountID: skrillAccountId,
              emailSubject: "Skrill Payment",
              emailMessage: "Thank you for your payment",
            },
          },
          threeDs: {
            merchantUrl: window.location.href,
            deviceChannel: "BROWSER", // Corrected deviceChannel value for web payments
            messageCategory: "PAYMENT",
            transactionIntent: "GOODS_OR_SERVICE_PURCHASE",
            authenticationPurpose: "PAYMENT_TRANSACTION",
          },
        },
        async (instance, error) => {
          if (error) {
            console.error("Payment setup error:", error);
            router.push("/");
            // toast.error(error?.detailedMessage || "Payment setup failed.");
          }

          instanceObj = instance;

          // Fetch transaction details from the API
          try {
            const transactionResult = await paysafePay(data.merchantRefNum);

            // if (!transactionResult?.data?.isFirstDeposit) {
            //   return;
            // }
            if (transactionResult?.data?.transactionStatus === 1) {
              // Push to data layer
              if (transactionResult?.data?.isFirstDeposit) {
                window.dataLayer.push({
                  event: "purchase",
                  ecommerce: {
                    transaction_id: transactionResult?.data?.transactionId,
                    currency: "USD",
                    value: parseFloat(transactionResult?.data?.amount),
                    items: [
                      {
                        item_id: pkg?.packageId,
                        item_name: `${transactionResult?.data?.amount} Package`,
                        quantity: 1,
                        amount: parseFloat(transactionResult?.data?.amount),
                        price: parseFloat(transactionResult?.data?.amount),
                      },
                    ],
                    scCoin: transactionResult?.data?.scCoin,
                    gcCoin: transactionResult?.data?.gcCoin,
                    payment_type:
                      // transactionResult?.data?.transactionStatus === 1
                      // ?
                      "Deposit",
                    // : "Redeem",
                    // payment_method: transactionResult?.data?.paymentMethod,

                    user_id: userData?.userId,
                    affiliate_id: affiliateId,
                    click_id: clickId,
                    /*     user_detail: {
                      data: [
                        {
                          first_name: userData?.firstName,
                          last_name: userData?.lastName,
                          email: userData?.email,
                          dob: userData?.dateOfBirth,
                          city: userData?.city,
                          state: stateCode,
                          zipcode: userData?.zipCode,
                          country: "US",
                        },
                      ],
                    }, */
                  },
                });
              }

              window.dataLayer.push({
                event: "purchaseall",
                ecommerce: {
                  transaction_id: transactionResult?.data?.transactionId,
                  currency: "USD",
                  value: parseFloat(transactionResult?.data?.amount),
                  items: [
                    {
                      item_id: pkg?.packageId,
                      item_name: `${transactionResult?.data?.amount} Package`,
                      quantity: 1,
                      amount: parseFloat(transactionResult?.data?.amount),
                      price: parseFloat(transactionResult?.data?.amount),
                    },
                  ],
                  scCoin: transactionResult?.data?.scCoin,
                  gcCoin: transactionResult?.data?.gcCoin,
                  payment_type:
                    // transactionResult?.data?.transactionStatus === 1
                    // ?
                    "Deposit",
                  // : "Redeem",
                  // payment_method: transactionResult?.data?.paymentMethod,

                  user_id: userData?.userId,
                  affiliate_id: affiliateId,
                  click_id: clickId,
                  /*     user_detail: {
                    data: [
                      {
                        first_name: userData?.firstName,
                        last_name: userData?.lastName,
                        email: userData?.email,
                        dob: userData?.dateOfBirth,
                        city: userData?.city,
                        state: stateCode,
                        zipcode: userData?.zipCode,
                        country: "US",
                      },
                    ],
                  }, */
                },
              });

              instanceObj?.showSuccessScreen(transactionResult?.data?.message);
              toast.success(transactionResult?.data?.message, {
                duration: 6000, // Duration in milliseconds (6 seconds)
              });
              setTimeout(async () => {
                router.push("/");
              }, 1000);
            } else if (+transactionResult?.data?.transactionStatus === 0) {
              instanceObj?.showSuccessScreen(
                transactionResult?.data?.message +
                " This transaction may take some time to reflect."
              );
              // toast.promise("This transaction may take some time to reflect.", {
              //   duration: 9000, // Duration in milliseconds (6 seconds)
              // });
            } else {
              instanceObj?.showFailureScreen(transactionResult?.data?.message);
              setTimeout(async () => {
                router.push("/");
              }, 1000);
              // toast.error(
              //   transactionResult?.data?.message || "Transaction failed."
              // );
            }
          } catch (apiError) {
            console.error("Error fetching transaction details:", apiError);
            instanceObj?.showFailureScreen(
              "An error occurred while processing the payment."
            );
            setTimeout(async () => {
              const user_profile = await getProfile();

              setUser(user_profile);
              clearModals();
              instanceObj?.close();
              router.push("/");
              onClose();
              clearCheckoutData();
            }, 7000);
            // toast.error("An error occurred while processing the payment.");
          } finally {
            setTimeout(async () => {
              const user_profile = await getProfile();

              setUser(user_profile);
              clearModals();
              instanceObj?.close();
              router.push("/");
              onClose();
              clearCheckoutData();
            }, 7000);
          }
        },
        (stage) => {
          switch (stage) {
            case "PAYMENT_HANDLE_NOT_CREATED":
              toast.error("Payment could not be initialized.", {
                duration: 6000, // Duration in milliseconds (6 seconds)
              });
              onClose(); // Close modal if handle is not created
              setTimeout(() => {
                router.push("/");
              }, 3000);
              clearCheckoutData();
              break;
            case "PAYMENT_HANDLE_CREATED":
              setTimeout(() => {
                router.push("/");
              }, 1000);
              break;
            case "PAYMENT_HANDLE_REDIRECT":
              setTimeout(() => {
                router.push("/");
              }, 1000);
              break;
            case "PAYMENT_HANDLE_PAYABLE":
              setTimeout(() => {
                router.push("/");
              }, 1000);
              break;
            case "PAYMENT_CANCELLED":
              setTimeout(() => {
                router.push("/");
              }, 1000);
              // clearCheckoutData()
              break;
            case "PAYMENT_HANDLE_FAILED":
              setTimeout(() => {
                router.push("/");
              }, 1000);
              // clearCheckoutData()
              break;

            default:
              break;
          }
        }
      );
    } catch (e) {
      console.error("Error setting up Paysafe checkout:", e);
      toast.error("An error occurred during payment setup.", {
        duration: 6000, // Duration in milliseconds (6 seconds)
      });
      router.push("/");
      setTimeout(async () => {
        router.push("/");
      }, 5000);
      onClose(); // Close modal if setup fails
      clearCheckoutData();
    }

    // Cleanup on unmount to prevent multiple instances
    return () => {
      if (instanceObj) {
        instanceObj.close();
        setTimeout(async () => {
          router.push("/");
        }, 7000);
      }
    };
  }, [stateListing]);
};

export default CheckoutCard;
