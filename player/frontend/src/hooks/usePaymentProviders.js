import { useState, useEffect } from 'react';
import { getCashierAPIData } from '@/actions';
import { useCashierStore } from '@/store/useCashierStore';

export const usePaymentProviders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const {
    setPaymentProviders,
    setApprovelyProvider,
    setPushCashProvider,
    setPaysafeProvider,
    setPayByBankProvider,
    approvelyProvider,
    pushCashProvider,
    paysafeProvider,
    payByBankProvider,
    paymentProviders,
    setFinixProvider,
    finixProvider
  } = useCashierStore();

  const fetchPaymentProviders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { success, data, message } = await getCashierAPIData();
      if ((Array.isArray(data?.result) && data?.result?.length === 0) || !data?.result) {
        resetProviders();
        return;
      }

      if (success && Array.isArray(data?.result)) {
        setPaymentProviders(data.result);
        
        // Find each provider type
        const approvely = data.result.find(p => p.paymentProviderName.toLowerCase() === 'approvely') || null;
        const pushcash = data.result.find(p => p.paymentProviderName.toLowerCase() === 'pushcash') || null;
        const paysafe = data.result.find(p => p.paymentProviderName.toLowerCase() === 'paysafe') || null;
        const payByBank = data.result.find(p => p.paymentProviderName.toLowerCase() === 'pay_by_bank') || null;
        const finix = data.result.find(p => p.paymentProviderName.toLowerCase() === 'finix') || null;
        // Set all providers at once
        setApprovelyProvider(approvely);
        setPushCashProvider(pushcash);
        setPaysafeProvider(paysafe);
        setPayByBankProvider(payByBank);
        setFinixProvider(finix);
      } else {
        resetProviders();
        setError(message || "Failed to load payment providers");
      }
    } catch (err) {
      resetProviders();
      setError(err.message || "An error occurred while fetching payment providers");
    } finally {
      setLoading(false);
    }
  };

  const resetProviders = () => {
    setPaymentProviders([]);
    setApprovelyProvider(null);
    setPushCashProvider(null);
    setPaysafeProvider(null);
    setPayByBankProvider(null);
    setFinixProvider(null);
  };

  useEffect(() => {
    fetchPaymentProviders();
  }, []);

  return {
    loading,
    error,
    paymentProviders,
    approvelyProvider,
    pushCashProvider,
    paysafeProvider,
    payByBankProvider,
    finixProvider,
    refetch: fetchPaymentProviders
  };
}; 