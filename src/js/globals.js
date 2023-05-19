const globals = {
    stripe: {
        publishableKey: "pk_test_51N7RRCIKeJsElTL1YrxCSQIFAfStNQPiZdaGugA5vINBZPkMRt2OlMkFitW5e5MQLYLcd8XcDeuMgi0ov9Fy7Y7i00U3TUoIe5",
    },
    apiURL: "http://127.0.0.1:8081",
};

if (window.location.host === "evodma.com") {
    globals.apiURL = "api.evodma.com";
    globals.stripe.publishableKey = "pk_live_51N7RRCIKeJsElTL1qgnJjZhl0hIYk24pOuUigL3S5YlwnBJWhzdiZkUqaOXvO5FAHSNpaqNzSmIOaVGWYJgPbDjJ00wNdEOIpU";
} else if (window.location.host === "dev-web.evodma.com") {
    globals.apiURL = "dev-api.evodma.com";
}

export default globals;
