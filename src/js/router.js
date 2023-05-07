import { routeManifest } from "./routes/routeManifest";

export function initialize() {
    window.addEventListener("load", router);
    window.addEventListener("popstate", router);

    // Listen for clicks on links and update the route
    document.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const url = link.getAttribute('href');
            history.pushState(null, null, url);
            router();
        });
    });
}

function router() {
    // Get the current URL and parse any query parameters
    const url = new URL(window.location.href);
    const currentUrl = url.pathname;
    const queryParams = Object.fromEntries(url.searchParams.entries());

    // Get the function corresponding to the current route
    const routeHandler = routeManifest[currentUrl];

    if (routeHandler) {
        routeHandler(queryParams);
    } else {
        console.log('404 Error: Page not found.');
    }
}
