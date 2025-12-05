import * as React from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const ApplePayPage = () => {
  const router = useRouter();
  const { paymentData } = router.query;

  React.useEffect(() => {
    if (!paymentData) return;

    const handleApplePay = async () => {
      if (!window.ApplePaySession) {
        toast.error("Apple Pay is not supported on this device");
        return;
      }

      try {
        const parsedPaymentData = JSON.parse(paymentData);
        const canMakePayments = ApplePaySession.canMakePayments();
        
        if (!canMakePayments) {
          toast.error("Apple Pay is not available on this device");
          return;
        }

        const canMakePaymentsWithActiveCard = await ApplePaySession.canMakePaymentsWithActiveCard(process.env.NEXT_PUBLIC_FINIX_MERCHANT_ID);
        
        if (!canMakePaymentsWithActiveCard) {
          toast.error("No Apple Pay cards available. Please add a card to Apple Pay first.");
          return;
        }

        const paymentRequest = {
          countryCode: 'US',
          currencyCode: 'USD',
          supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
          merchantCapabilities: ['supports3DS'],
          total: {
            label: 'Phibet',
            amount: parsedPaymentData.packageDetail.amount.toString()
          },
          requiredBillingContactFields: ['postalAddress', 'name', 'email', 'phone']
        };

        const session = new ApplePaySession(6, paymentRequest);

        session.onvalidatemerchant = async (event) => {
          try {
            const validationURL = event.validationURL;

            if (validationURL) {
              const request = {
                provider: 'APPLE_PAY',
                validation_url: validationURL,
                merchant_identifier: process.env.NEXT_PUBLIC_FINIX_MERCHANT_ID,
                domain_name: window.location.hostname,
                display_name: 'Phibet'
              };

              const response = await fetch(`${process.env.NEXT_PUBLIC_FINIX_URL}/apple_pay_sessions`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Basic ${btoa(process.env.NEXT_PUBLIC_FINIX_MERCHANT_ID + ':')}`
                },
                body: JSON.stringify(request)
              });

              if (!response.ok) {
                throw new Error('Failed to validate merchant');
              }

              const { session_details } = await response.json();
              const merchantSession = JSON.parse(session_details);
              session.completeMerchantValidation(merchantSession);
            } else {
              session.abort();
              toast.error("Failed to validate merchant");
            }
          } catch (err) {
            session.abort();
            toast.error("Failed to validate merchant");
          }
        };

        session.onpaymentauthorized = async (event) => {
          try {
            const paymentToken = event.payment;
            if (paymentToken) {
              const addressData = {
                country: paymentToken.billingContact.countryCode,
                postal_code: paymentToken.billingContact.postalCode,
              };
              
              const name = `${paymentToken.billingContact.givenName} ${paymentToken.billingContact.familyName}`;
              
              const response = await fetch('/api/create-payment-instrument', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  identity: parsedPaymentData.id,
                  merchant_identity: parsedPaymentData.merchant_identity,
                  name: name,
                  third_party_token: JSON.stringify({ token: paymentToken.token }),
                  type: "APPLE_PAY",
                  address: addressData,
                  fraud_session_id: window.Finix.Auth(process.env.NEXT_PUBLIC_FINIX_ENVIRONMENT, parsedPaymentData.application).getSessionKey(),
                  amount: parsedPaymentData.packageDetail.amount,
                  packageId: parsedPaymentData.packageDetail.packageId,
                  packageDetail: parsedPaymentData.packageDetail,
                }),
              });

              const result = await response.json();

              if (result.success) {
                session.completePayment(ApplePaySession.STATUS_SUCCESS);
                toast.success("Payment successful!");
                window.close(); // Close the window after successful payment
              } else {
                session.completePayment(ApplePaySession.STATUS_FAILURE);
                toast.error(result.message || "Payment failed");
              }
            } else {
              session.completePayment(ApplePaySession.STATUS_FAILURE);
              toast.error("Payment token is null");
            }
          } catch (error) {
            session.completePayment(ApplePaySession.STATUS_FAILURE);
            toast.error("Payment failed");
          }
        };

        session.oncancel = () => {
          window.close(); // Close the window when payment is cancelled
        };

        session.onerror = (event) => {
          toast.error("Apple Pay session error occurred");
          window.close(); // Close the window on error
        };

        session.begin();
      } catch (error) {
        toast.error("Failed to initialize Apple Pay");
      }
    };

    handleApplePay();
  }, [paymentData]);

  return (
    <div className="min-h-screen bg-[#212537] flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-2xl mb-4">Processing Apple Pay Payment</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
      </div>
    </div>
  );
};

export default ApplePayPage; 