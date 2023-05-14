import { show as showAccount } from "./account/template";
import { show as showAuth } from "./auth/template";

export const routeManifest = {
    "/auth": showAuth,
    "/account": showAccount
};
