import React, { useState, useEffect } from 'react';
import { getTermsAndConditionsAction, updateTermsAndConditionsAction } from '@/actions';
import { toast } from 'react-toastify';
import useUserStore from "@/store/useUserStore";
import useModalsStore from "@/store/useModalsStore";
const TermsAndConditionsModal = () => {
  const [termsData, setTermsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    setUser,
    user
  } = useUserStore();
  const {  clearModals } = useModalsStore();
  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const termsRes = await getTermsAndConditionsAction();
      if (termsRes?.success && termsRes?.data?.data) {
        setTermsData(termsRes.data.data);
      } else {
        console.error("Failed to fetch terms:", termsRes?.message || "Unknown error");
        toast.error("Failed to load terms and conditions");
      }
    } catch (error) {
      console.error("Error fetching terms:", error);
      toast.error("Error loading terms and conditions");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!isAccepted) {
      toast.error("Please accept the terms and conditions first");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateTermsAndConditionsAction();
      if (response?.success) {
        // Update user state first
        setUser({ ...user, isTermsAccepted: true });

        // Show success message
        toast.success("Terms and conditions accepted successfully");

        // Add a small delay to ensure the toast is visible before closing
        setTimeout(() => {
          clearModals();
        }, 500);

      } else {
        toast.error(response?.message || "Failed to accept terms and conditions");
      }
    } catch (error) {
      console.error("Error accepting terms:", error);
      toast.error("Error accepting terms and conditions");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Force close function as backup


  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="  p-6 rounded-lg max-w-2xl w-full mx-4">
          <div className="animate-pulse">
            <div className="h-4  00 rounded w-3/4 mb-4"></div>
            <div className="h-4  00 rounded w-full mb-4"></div>
            <div className="h-4  00 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="  p-8 rounded-lg max-w-3xl w-full mx-4">

        <div className="bg-black bg-opacity-30 p-6 rounded-lg mb-6 max-h-[50vh] overflow-y-auto">
          <div className="text-white space-y-4">
            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-4">Important Information</h3>
              {termsData?.description && (
                <div className="whitespace-pre-wrap text-white leading-relaxed">
                  {termsData.description}
                </div>
              )}
              {termsData?.link && (
                <div className="mt-4">
                  <a
                    href={termsData.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white00 underline inline-flex items-center"
                  >
                    <span>Read full terms and conditions</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms-accept"
              checked={isAccepted}
              onChange={(e) => setIsAccepted(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border  text-white focus:ring-green-500"
              disabled={isSubmitting}
            />
            <label htmlFor="terms-accept" className="text-white text-sm">
              I have read and agree to the Terms and Conditions. I understand that by accepting these terms, I am entering into a legally binding agreement.
            </label>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleAccept}
              disabled={!isAccepted || isSubmitting}
              className={`px-8 py-2 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 ${
                isAccepted && !isSubmitting
                  ? 'bg-white hover:bg-white00'
                  : '  cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Accepting...</span>
                </div>
              ) : (
                'Accept Terms'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;