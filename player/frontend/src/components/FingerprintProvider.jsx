'use client';

import { FpjsProvider, FingerprintJSPro } from '@fingerprintjs/fingerprintjs-pro-react';

export default function FingerprintProvider({ children }) {
  const apiKey = process.env.NEXT_PUBLIC_FINGERPRINT_PUBLIC_SECRET_KEY;

  return (
    <FpjsProvider
      loadOptions={{
        apiKey: apiKey,
        endpoint: [FingerprintJSPro.defaultEndpoint],
        scriptUrlPattern: [FingerprintJSPro.defaultScriptUrlPattern],
        region: "us",
        
      }}
    >
      {children}
    </FpjsProvider>
  );
} 