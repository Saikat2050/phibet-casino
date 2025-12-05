export const createPaymentInstrument = async (data) => {
  try {
    const response = await fetch('/api/payment/finix/create-instrument', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating payment instrument:', error);
    throw error;
  }
}; 