import "./css/index.sass";

import { initialize as initializeRouter } from "./js/router";
import { hide as hideLoader } from "./js/loader";

initializeRouter();
hideLoader(1000);
