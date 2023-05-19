import { routeManifest } from "./routes/routeManifest";

export function initialize() {
    handleRoute();
}

export function handleRoute() {
    // Get the current URL and parse any query parameters
    const url = new URL(window.location.href);
    const currentUrl = url.pathname;
    const queryParams = Object.fromEntries(url.searchParams.entries());

    // Get the function corresponding to the current route
    const routeHandler = routeManifest[currentUrl];

    if (routeHandler) {
        routeHandler(queryParams);
    } else {
        console.log("404 Error: Page not found.");
    }
}
