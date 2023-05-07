import "./css/index.sass";

import { hide as hideLoader } from "./js/loader";
import { initialize as initializeRouter } from "./js/router";

initializeRouter();
hideLoader(1000);
