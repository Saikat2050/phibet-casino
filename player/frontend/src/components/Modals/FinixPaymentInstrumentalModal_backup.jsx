import * as React from 'react';
import { toast } from 'react-toastify';
import useModalsStore from "@/store/useModalsStore";
import InfoModal from './InfoModal';
import { createApplePaymentInstrument, createPaymentInstrument } from '@/actions';
import ApplePayIcon from "@/assets/images/ApplePayFinixIcon";
import GooglePayIcon from "@/assets/images/GooglePayIcon";
import MasterCardIcon from "@/assets/images/MasterCardIcon";
import VisaIcon from "@/assets/images/VisaIcon";
import AmericanExpressIcon from "@/assets/images/AmericanExpressIcon";

const FinixPaymentInstrumentModal = ({ paymentData }) => {
  const { closeModal, openModal } = useModalsStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState('card'); // 'card', 'apple', 'google'
  const [googlePayLoaded, setGooglePayLoaded] = React.useState(false);
  const [applePayLoaded, setApplePayLoaded] = React.useState(false);
  const [applePayAvailable, setApplePayAvailable] = React.useState(false);
  const googlePayButtonRef = React.useRef(null);
  const applePayButtonRef = React.useRef(null);
  const [merchant_identity_value, setMerchantIdentityValue] = React.useState(null);

  async function handleApplePayInfo() {
     const userName = process.env.NEXT_PUBLIC_FINIX_USERNAME;
     const userPassword = process.env.NEXT_PUBLIC_FINIX_PASSWORD;
     const response_merchants = await fetch(`${process.env.NEXT_PUBLIC_FINIX_MERCHANT_API}${process.env.NEXT_PUBLIC_FINIX_MERCHANT_ID}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Finix-Version': '2022-02-01',
              Authorization: 'Basic ' + btoa(`${userName}:${userPassword}`)
            },
            // body: JSON.stringify(request),
          });

          const merchant_identity = await response_merchants.json();
          // window.alert(merchant_identity.identity);
          return merchant_identity.identity;
  }


  // Load Google Pay script
  React.useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://pay.google.com/gp/p/js/pay.js';
      script.async = true;
      script.onload = () => setGooglePayLoaded(true);
      document.head.appendChild(script);
    } else {
      setGooglePayLoaded(true);
    }
  }, []);

  // Load Apple Pay script
  React.useEffect(() => {
    if (!window.ApplePaySession) {
      const script = document.createElement('script');
      script.src = 'https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js';
      script.async = true;
      script.onload = () => {
        setApplePayLoaded(true);
        // Check if Apple Pay is available
        if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
          setApplePayAvailable(true);
        }
      };
      document.head.appendChild(script);
    } else {
      setApplePayLoaded(true);
      if (ApplePaySession.canMakePayments()) {
        setApplePayAvailable(true);
      }
    }
  }, []);

  const successToggler = (res) => {
    toast.success(res.data.message || "Payment successful!");
    closeModal();
    setFormSubmitted(false);
  };

  const errorToggler = (error) => {
    const errorMessage = error?.errors[0]?.description || error?.message || "Payment failed. Any deducted amount will be refunded within one to two business days.";
    toast.error(errorMessage);
    closeModal();
    setFormSubmitted(false);
  };

  // Apple Pay Session Creation and Handling
  const createAndStartApplePaySession = async (description, amount) => {
    if (!window.ApplePaySession || !ApplePaySession.canMakePayments()) {
      toast.error("Apple Pay is not available on this device");
      return;
    }

    try {
      // setIsLoading(true);

      const applePaySession = new ApplePaySession(6, {
        countryCode: 'US',
        currencyCode: 'USD',
        merchantCapabilities: ['supports3DS'],
        supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
        total: {
          label: description,
          amount: amount.toString()
        },
        requiredBillingContactFields: ['postalAddress']
      });

      // Validate merchant session
      applePaySession.onvalidatemerchant = async function (event) {
        try {
          const validationURL = event.validationURL;
          // alert(JSON.stringify(validationURL, null, 2));


          const merchant_identity_value = await handleApplePayInfo();
          // window.alert(merchant_identity_value);
          if (validationURL && merchant_identity_value) {
            const request = {
              provider: 'APPLE_PAY',
              validation_url: validationURL,
              merchant_identity: merchant_identity_value,
              domain: process.env.NEXT_PUBLIC_DOMAIN,                  // ✅ corrected field name
              display_name: 'Phibet'
            };

            const userName = process.env.NEXT_PUBLIC_FINIX_USERNAME;
            const userPassword = process.env.NEXT_PUBLIC_FINIX_PASSWORD;

            const response = await fetch(`${process.env.NEXT_PUBLIC_FINIX_APPLEPAY_SESSION}apple_pay_sessions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Finix-Version': '2022-02-01',
                'Authorization': 'Basic ' + btoa(`${userName}:${userPassword}`)
              },
              body: JSON.stringify(request),
            });

            const result = await response.json();

            const sessionDetails = JSON.parse(result.session_details);

            applePaySession.completeMerchantValidation(sessionDetails);
          } else {
            window.alert("Merchant identity value is null");
            console.log("Merchant validation failed");
            applePaySession.abort();
          }
        } catch (err) {
          window.alert("Error during merchant validation");
          console.error("Error during merchant validation:", err);
          applePaySession.abort();
        }
      };
applePaySession.onpaymentauthorized = async (event) => {
  try {
    const paymentToken = event.payment.token;
    const billingContact = event.payment.billingContact;
    const name = `${billingContact?.givenName ?? ""} ${billingContact?.familyName ?? ""}`;

    const addressData = {
      country: billingContact?.countryCode,
      postal_code: billingContact?.postalCode,
    };

    const fraudSessionId = window.Finix
      .Auth(
        process.env.NEXT_PUBLIC_FINIX_ENVIRONMENT,
        process.env.NEXT_PUBLIC_FINIX_MERCHANT_ID
      )
      .getSessionKey();

    const third_party_token = {
      token: paymentToken,
    };

    const stringifiedPaymentToken = JSON.stringify(third_party_token);

    const response = await createPaymentInstrument({
      identity: paymentData.id,
      merchant_identity: paymentData.merchant_identity,
      name,
      thirdPartyToken: stringifiedPaymentToken,
      type: "APPLE_PAY",
      address: addressData,
      fraudSessionId,
      amount: paymentData.packageDetail.amount,
      packageId: paymentData.packageDetail.packageId,
      packageDetail: paymentData.packageDetail,
      promocodeDetail: paymentData.promocodeDetail,
    });



    if (response.data?.success) {

      applePaySession.completePayment(ApplePaySession.STATUS_SUCCESS);
    } else {
      console.error("Payment failed:", response.errors);
      applePaySession.completePayment(ApplePaySession.STATUS_FAILURE);
    }
  } catch (error) {
    console.error("Apple Pay payment error:", error);
    applePaySession.completePayment(ApplePaySession.STATUS_FAILURE);
  }
};

      applePaySession.begin();
    } catch (error) {
      console.error("Apple Pay session error:", error);
      errorToggler(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render Apple Pay button
  const renderApplePayButton = React.useCallback(() => {
    if (!applePayLoaded || !applePayAvailable || !applePayButtonRef.current) return;

    // Clear any existing content
    applePayButtonRef.current.innerHTML = '';

    // Add Apple Pay button styles
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      apple-pay-button {
        --apple-pay-button-width: 100%;
        --apple-pay-button-height: 44px;
        --apple-pay-button-border-radius: 6px;
        --apple-pay-button-padding: 0px 0px;
        --apple-pay-button-box-sizing: border-box;
        cursor: pointer;
      }
    `;
    document.head.appendChild(styleEl);

    // Create Apple Pay button element
    const applePayButton = document.createElement('apple-pay-button');
    applePayButton.setAttribute('buttonstyle', 'black');
    applePayButton.setAttribute('type', 'buy');
    applePayButton.setAttribute('locale', 'en');

    // Add click handler
    applePayButton.addEventListener('click', () => {
      createAndStartApplePaySession('Phibet', paymentData.packageDetail.amount);
    });

    applePayButtonRef.current.appendChild(applePayButton);
  }, [applePayLoaded, applePayAvailable, paymentData]);

  // Google Pay button click handler
  const onGooglePayButtonClick = async (paymentsClient, cardPaymentMethod) => {
    setIsLoading(true);
    try {
      const baseRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
      };
      const paymentDataRequest = Object.assign({}, baseRequest, {
        allowedPaymentMethods: [cardPaymentMethod],
        transactionInfo: {
          countryCode: 'US',
          currencyCode: 'USD',
          totalPrice: paymentData.packageDetail.amount.toString(),
          totalPriceStatus: 'FINAL',
        },
        merchantInfo: {
          merchantId: process.env.NEXT_PUBLIC_FINIX_MERCHANT_ID,
          merchantName: 'Phibet',
        },
      });
      const paymentDataResp = await paymentsClient.loadPaymentData(paymentDataRequest);

      // Extract billing details
      const billingAddress = paymentDataResp.paymentMethodData.info?.billingAddress;
      const address = billingAddress ? {
        country: billingAddress.countryCode,
        postal_code: billingAddress.postalCode,
      } : null;

      await createPaymentInstrument({
        identity: paymentData.id,
        merchant_identity: paymentData.merchant_identity,
        name: billingAddress?.name || 'Google Pay User',
        thirdPartyToken: paymentDataResp.paymentMethodData.tokenizationData.token,
        type: "GOOGLE_PAY",
        address,
        fraudSessionId: window.Finix.Auth(process.env.NEXT_PUBLIC_GOOGLE_PAY_ENVIRONMENT, process.env.NEXT_PUBLIC_FINIX_MERCHANT_ID).getSessionKey(),
        amount: paymentData.packageDetail.amount,
        packageId: paymentData.packageDetail.packageId,
        packageDetail: paymentData.packageDetail,
        promocodeDetail: paymentData.promocodeDetail,
      });
      successToggler({ data: { message: "Your Deposit Was Successful. Coins Will Be Added To Your Balance Momentarily." } });
    } catch (error) {
      if (error.statusCode !== 'CANCELED') {
        errorToggler(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Render Google Pay button when selected
  const renderGooglePayButton = React.useCallback(() => {
    if (!window.google || !window.google.payments || !window.google.payments.api) return;
    const paymentsClient = new window.google.payments.api.PaymentsClient({
      environment: process.env.NEXT_PUBLIC_GOOGLE_PAY_ENVIRONMENT,
    });
    const allowedCardNetworks = [
      "AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"
    ];
    const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];
    const baseRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
    };
    const tokenizationSpecification = {
      type: "PAYMENT_GATEWAY",
      parameters: {
        gateway: "finix",
        gatewayMerchantId: process.env.NEXT_PUBLIC_FINIX_MERCHANT_ID,
      },
    };
    const baseCardPaymentMethod = {
      type: "CARD",
      parameters: {
        allowedAuthMethods: allowedCardAuthMethods,
        allowedCardNetworks: allowedCardNetworks,
        billingAddressRequired: true,
        billingAddressParameters: {
          format: "FULL",
        },
      },
    };
    const cardPaymentMethod = Object.assign(
      { tokenizationSpecification: tokenizationSpecification },
      baseCardPaymentMethod
    );
    const isReadyToPayRequest = Object.assign({}, baseRequest, {
      allowedPaymentMethods: [baseCardPaymentMethod],
    });
    paymentsClient.isReadyToPay(isReadyToPayRequest).then(function (response) {
      if (response.result) {
        const button = paymentsClient.createButton({
          onClick: () => onGooglePayButtonClick(paymentsClient, cardPaymentMethod),
          buttonColor: "black",
          buttonType: "buy",
        });
        if (googlePayButtonRef.current) {
          googlePayButtonRef.current.innerHTML = "";
          googlePayButtonRef.current.appendChild(button);
        }
      }
    }).catch(function (err) {
      console.error(err);
    });
  }, [paymentData]);

  React.useEffect(() => {
    if (googlePayLoaded && selectedPaymentMethod === 'google') {
      renderGooglePayButton();
    }
  }, [googlePayLoaded, selectedPaymentMethod, renderGooglePayButton]);

  React.useEffect(() => {
    if (applePayLoaded && selectedPaymentMethod === 'apple') {
      renderApplePayButton();
    }
  }, [applePayLoaded, selectedPaymentMethod, renderApplePayButton]);

  React.useEffect(() => {
    if (paymentData?._links?.payment_instruments?.href && selectedPaymentMethod === 'card') {
      const FinixAuth = window.Finix.Auth(
        process.env.NEXT_PUBLIC_FINIX_ENVIRONMENT,
        process.env.NEXT_PUBLIC_FINIX_MERCHANT_ID
      );

      // Add custom styles
      const styleEl = document.createElement('style');
      styleEl.id = 'finix-custom-styles';
      styleEl.innerHTML = `
      #finix-submit-button {
        position: relative;
        font-size: 16px !important;
        font-weight: bold !important;
        background-color: #1a7946 !important;
        color: white !important;
        cursor: pointer;
      }
      #finix-submit-button.loading {
        cursor: not-allowed;
        opacity: 0.7;
      }
      #finix-submit-button.loading,
      #finix-submit-button.loading * {
        animation: none !important;
        transform: none !important;
      }
      #finix-submit-button.loading::after {
        content: "Processing...";
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        background-color: rgba(26, 121, 70, 0.9);
      }
      #finix-form-container {
        color: white !important;
      }
      #finix-submit-button::before {
        content: "Buy Coins Now";
      }
      #purchase-info {
        color: white;
        font-weight: bold;
        text-align: center;
        margin-bottom: 15px;
        padding: 10px;
        font-size: 16px;
      }
    `;

      document.head.appendChild(styleEl);

      // Handle mutation to adjust button text
      const handleMutations = (mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'attributes') {
            const submitButton = document.getElementById('finix-submit-button');
            if (submitButton && submitButton.textContent === 'Submit') {
              submitButton.textContent = '';
            }

            // If submit button exists and purchaseInfo is not yet added
            if (
              submitButton &&
              submitButton.parentNode &&
              !document.getElementById('purchase-info')
            ) {
              const purchaseInfoEl = document.createElement('div');
              purchaseInfoEl.id = 'purchase-info';
              purchaseInfoEl.innerText = `You are buying a $${paymentData.packageDetail.amount} coin package on Phibet.`;

              submitButton.parentNode.insertBefore(purchaseInfoEl, submitButton);
            }
          }
        });
      };

      const observer = new MutationObserver(handleMutations);
      observer.observe(document.body, { childList: true, subtree: true });

      // Finix form submission
      const onSubmit = () => {
        const submitButton = document.getElementById('finix-submit-button');
        if (submitButton) {
          submitButton.classList.add('loading');
          submitButton.disabled = true;
        }

        finixForm.submit(
          process.env.NEXT_PUBLIC_FINIX_ENVIRONMENT,
          paymentData.application,
          async function (err, res) {
            if (err) {
              errorToggler(err);
              if (finixForm && finixForm.destroy) {
                finixForm.destroy();
              }
              if (submitButton) {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
              }
              return;
            }

            const tokenData = res.data || {};
            const token = tokenData.id;

            try {
              createPaymentInstrument({
                token,
                identity: paymentData.id,
                type: 'TOKEN',
                fraudSessionId: FinixAuth.getSessionKey(),
                amount: paymentData.packageDetail.amount,
                packageId: paymentData.packageDetail.packageId,
                packageDetail: paymentData.packageDetail,
                promocodeDetail: paymentData.promocodeDetail,
              })
                .then((response) => {
                  const { data, errors } = response;

                  if (data?.success !== undefined) {
                    if (data.success) {
                      if (data.status === 'SUCCEEDED') {
                        successToggler(response);
                      } else if (data.status === 'FAILED') {
                        errorToggler({
                          errors: [{ description: data.message || 'Unfortunately Your Deposit Was Declined. Please Reach Out To Customer Support.' }]
                        });
                      }
                    } else {
                      errorToggler({
                        errors: [{ description: data.message || 'Unfortunately Your Deposit Was Declined. Please Reach Out To Customer Support.' }]
                      });
                    }
                  } else if (Array.isArray(errors) && errors.length > 0) {
                    errorToggler({ errors });
                  } else {
                    errorToggler({ errors: [{ description: 'Unfortunately Your Deposit Was Declined. Please Reach Out To Customer Support.' }] });
                  }
                })
                .catch((error) => {
                  errorToggler(error);
                })
                .finally(() => {
                  if (submitButton) {
                    submitButton.classList.remove('loading');
                    submitButton.disabled = false;
                  }
                  setIsLoading(false);
                });
            } catch (error) {
              errorToggler(error);
              if (finixForm && finixForm.destroy) {
                finixForm.destroy();
              }
              if (submitButton) {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
              }
              setIsLoading(false);
            }
          }
        );
      };

      // Initialize Finix form
      const finixForm = window.Finix.CardTokenForm('form', {
        showAddress: true,
        onSubmit,
        color: 'red',
        submitText: 'Buy Coins Now'
      });

      return () => {
        if (finixForm && finixForm.destroy) {
          finixForm.destroy();
        }

        const infoElement = document.getElementById('purchase-info');
        if (infoElement) {
          infoElement.remove();
        }

        const styleElement = document.getElementById('finix-custom-styles');
        if (styleElement) {
          styleElement.remove();
        }

        if (observer) {
          observer.disconnect();
        }
      };
    }
  }, [paymentData, selectedPaymentMethod]);

  return (
    <div className="bg-[#212537] relative w-full max-w-[600px] p-4 md:px-10 md:py-8 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h6 className="text-white font-bold text-xl">
          Buy Coin Package
        </h6>
        <button
          className="text-white p-2 hover:  rounded-full transition-colors"
          onClick={() => {
            closeModal();
            setFormSubmitted(false);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col items-center">
        {isLoading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        ) : (
          <div className="w-full">
            {/* <p className="text-white text-lg mb-4">
              Please select a payment method
            </p> */}

            <div className="grid grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => setSelectedPaymentMethod('card')}
                className={`p-4 rounded-lg border-2 ${selectedPaymentMethod === 'card'
                  ? 'border-[#1a7946] bg-[#1a7946]/10'
                  : 'border  hover:border '
                  }`}
              >
                <div className="flex items-center gap-2 justify-center">
                  <MasterCardIcon />
                  <VisaIcon />
                  <AmericanExpressIcon />
                </div>
                <span className="text-white text-sm mt-2 block text-center">Credit Card</span>
              </button>

              <button
                onClick={() => setSelectedPaymentMethod('apple')}
                disabled={!applePayAvailable}
                className={`p-4 rounded-lg border-2 ${selectedPaymentMethod === 'apple'
                  ? 'border-[#1a7946] bg-[#1a7946]/10'
                  : 'border  hover:border '
                  } ${!applePayAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex justify-center">
                  <ApplePayIcon />
                </div>
                <span className="text-white text-sm mt-2 block text-center">Apple Pay</span>
              </button>

              {/* <button
                onClick={() => setSelectedPaymentMethod('google')}
                className={`p-4 rounded-lg border-2 ${selectedPaymentMethod === 'google'
                  ? 'border-[#1a7946] bg-[#1a7946]/10'
                  : 'border  hover:border '
                  }`}
              >
                <div className="flex justify-center">
                  <GooglePayIcon />
                </div>
                <span className="text-white text-sm mt-2 block text-center">Google Pay</span>
              </button> */}
            </div>

            {selectedPaymentMethod === 'card' && (
              <div id="form" className="w-full" />
            )}
            {selectedPaymentMethod === 'apple' && applePayAvailable && (
              <div ref={applePayButtonRef} className="w-full flex justify-center" />
            )}
            {selectedPaymentMethod === 'google' && (
              <div ref={googlePayButtonRef} className="w-full flex justify-center" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinixPaymentInstrumentModal;