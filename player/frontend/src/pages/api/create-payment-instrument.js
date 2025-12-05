import { createPaymentInstrument } from '@/actions';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const result = await createPaymentInstrument(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error?.errors?.[0]?.description || error?.message || 'Payment failed' 
    });
  }
} 