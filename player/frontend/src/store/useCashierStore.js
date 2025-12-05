import { create } from 'zustand';

export const useCashierStore = create((set) => ({
    paymentProviders: [],
    approvelyProvider: null,
    pushCashProvider: null,
    paysafeProvider: null,
    payByBankProvider: null,
    finixProvider: null,
    setApprovelyProvider: (provider) => set({ approvelyProvider: provider }),
    setPushCashProvider: (provider) => set({ pushCashProvider: provider }),
    setPaysafeProvider: (provider) => set({ paysafeProvider: provider }),
    setPayByBankProvider: (provider) => set({ payByBankProvider: provider }),
    setFinixProvider: (provider) => set({ finixProvider: provider }),
    setPaymentProviders: (providers) => set({ paymentProviders: providers }),
}));
