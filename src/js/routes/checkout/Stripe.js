import { loadStripe } from "@stripe/stripe-js";
import { showAlert } from "../../alert";
import globals from "../../globals";
import { handleRoute } from "../../router";
import { showError } from "./template";

/** @type {import("@stripe/stripe-js").Stripe} */
let stripe = null;
/** @type {import("@stripe/stripe-js").StripeElements} */
let elements = null;

export async function initialize() {
    stripe = await loadStripe(globals.stripe.publishableKey);
}

export function createPaymentElement(clientSecret) {
    elements = stripe.elements({
        clientSecret: clientSecret,
        appearance: {
            theme: "night",
            disableAnimations: true,
            labels: "above",
            variables: {
                fontFamily: "Neo Sans Std",
                fontLineHeight: "1",
                borderRadius: "10px",
                colorText: "#ffffff",
                colorPrimary: "#009d32",
                colorBackground: "#212121",
                colorIconCardError: "#e9002b",
                colorIconCardCvcError: "#e9002b",
                colorDanger: "#e9002b",
                colorDangerText: "#e9002b",
                colorBackgroundText: "#444444",
            },
        },
    });

    const paymentElement = elements.create("payment", {
        layout: "tabs",
    });

    paymentElement.mount("#paymentElement");
}

export async function retrievePaymentIntent(clientSecret, ProductID, SubscriptionTerm) {
    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

    const status = paymentIntent.status;

    if (status === "succeeded") {
        showAlert("success", "Payment Status", "Payment succeeded, thank you for your purchase!", false, false, "Show Account", "", "", () => {
            history.pushState(null, "", "/account");
            handleRoute();
        });
    } else if (status === "processing") {
        showAlert("info", "Payment Status", "Your payment is processing...", false, false, "Refresh", "", "", () => {
            location.reload();
        });
    } else if (status === "requires_payment_method") {
        showAlert("error", "Your payment was not successful, please try again.", false, false, "Try Again", "", "", () => {
            history.pushState(null, "", `/checkout?ProductID=${ProductID}&SubscriptionTerm=${SubscriptionTerm}`);
            handleRoute();
        });
    } else {
        showAlert("error", "Payment Error", "An unknown error occurred. Please try again later.", false, false, "Show Store", "", "", () => {
            history.pushState(null, "", "/store");
            handleRoute();
        });
    }
}

export async function confirmPayment() {
    const { error } = await stripe.confirmPayment({
        elements: elements,
        confirmParams: {
            return_url: location.href,
        },
    });

    // This point will only be reached if there is an immediate error when confirming the payment.
    // Otherwise, your customer will be redirected to your `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
        showError(error.message);
    } else {
        showError("An unknown error occurred while processing your payment. Please try again later.");
    }
}
