// import * as Sentry from "@sentry/browser";
// import { BrowserTracing } from "@sentry/tracing";

// Sentry.init({
//     dsn: "https://25b6e1429f0043939d46892273b13b62@sentry.rw3.io/5",
//     integrations: [new BrowserTracing()],
//     tracesSampleRate: 1.0,
// });

import "./css/index.sass";

import { hide as hideLoader } from "./js/loader";
import { initialize as initializeRouter } from "./js/router";

initializeRouter();
hideLoader(1000);
