export const updateTermsAndConditionsAction = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update-terms-conditions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating terms and conditions:', error);
    return {
      success: false,
      message: 'Failed to update terms and conditions',
    };
  }
}; 