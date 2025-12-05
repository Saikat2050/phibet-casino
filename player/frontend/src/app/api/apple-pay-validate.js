// pages/api/apple-pay-validate.js


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { provider, validation_url, merchant_identifier, domain_name, display_name } = req.body;

    // Call Finix's /apple_pay_sessions endpoint
    const finixResponse = await fetch('https://finix.sandbox-payments-api.com/apple_pay_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Finix-Version': '2022-02-01',
        'Authorization': 'Basic ' + Buffer.from('USpavckUM4b4C9kKmDcnE2TJ:6f5fc253-2ed1-4051-9313-24887e18a0da').toString('base64'),
      },
      body: JSON.stringify({
        display_name,
        domain: domain_name,
        merchant_identity: merchant_identifier,
        validation_url,
      }),
    });

    const finixData = await finixResponse.json();

    if (finixResponse.ok) {
      res.status(200).json({ session_details: finixData.session_details });
    } else {
      res.status(500).json({ error: 'Failed to validate merchant with Finix' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}