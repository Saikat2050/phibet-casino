// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://8795c975c58ecb2a6d78b581886bc0f4@o4509037889126400.ingest.us.sentry.io/4509038420230144",
  tracesSampleRate: 0.02,  // 2%
  sendDefaultPii: true,
});