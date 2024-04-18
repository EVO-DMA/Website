import { showAlert } from "../../alert";
import { httpPost } from "../../http";
import { hide as hideLoader, show as showLoader } from "../../loader";
import { handleRoute } from "../../router";
import { confirmPayment, createPaymentElement, retrievePaymentIntent } from "./Stripe";
import { createProductMarkup, createPurchaseButtonMarkup } from "./template";

/** @type {import("../store/template.js").Product} */
export let checkoutProduct = null;
/** @type {number} */
export let SubscriptionTerm = null;

export async function initialize(queryParams) {
    const paymentIntentClientSecret = queryParams["payment_intent_client_secret"];
    if (paymentIntentClientSecret != null) {
        // Purchase has (possibly) been completed

        // Validate query params
        const ProductID = queryParams["ProductID"];
        SubscriptionTerm = Number(queryParams["SubscriptionTerm"]);

        retrievePaymentIntent(paymentIntentClientSecret, ProductID, SubscriptionTerm);
    } else {
        // This is a purchase attempt

        // Validate query params
        const ProductID = queryParams["ProductID"];
        if (ProductID == null) {
            showAlert("error", "Checkout Error", "Missing Product ID. Please try again later.", false, false, "Show Store", "", "", () => {
                history.pushState(null, "", "/store");
                handleRoute();
            });
        }
        SubscriptionTerm = queryParams["SubscriptionTerm"];
        if (SubscriptionTerm == null) {
            showAlert("error", "Checkout Error", "Missing Subscription Term. Please try again later.", false, false, "Show Store", "", "", () => {
                history.pushState(null, "", "/store");
                handleRoute();
            });
        }
        SubscriptionTerm = Number(SubscriptionTerm);

        /**
         * @param {("card"|"cashapp")} type
         */
        const createStripePaymentIntent = async (type) => {
            showLoader("Switching payment method");

            const paymentIntentResult = await httpPost(
                "create-payment-intent",
                {
                    productID: ProductID,
                    subscriptionTerm: SubscriptionTerm,
                    paymentMethod: type
                },
                true
            );

            // Validate response
            const paymentIntentResponse = paymentIntentResult.response;
            if (!paymentIntentResponse.success) {
                showAlert("error", "Checkout Error", "Error creating Payment Intent. Please try again later.", false, false, "Show Store", "", "", () => {
                    history.pushState(null, "", "/store");
                    handleRoute();
                });
                return;
            }

            createPaymentElement(paymentIntentResponse.message.clientSecret);

            let friendlyText = "";
            if (type === "card") friendlyText = "Card";
            else if (type === "cashapp") friendlyText = "Cash App";
            document.getElementById("checkout_selectedPaymentMethodTitle").innerText = `${friendlyText} Checkout`;

            hideLoader(300);
        }

        const removeAllPaymentProviderCardClasses = () => {
            const paymentProviderCards = Array.from(document.getElementsByClassName("paymentProviderCard"));
            paymentProviderCards.forEach(card => {
                card.classList.remove("paymentProviderCardActive");
            });
        }

        // Card
        const checkout_paymentProvider_cardEl = document.getElementById("checkout_paymentProvider_card");
        checkout_paymentProvider_cardEl.addEventListener("click", () => {
            if (checkout_paymentProvider_cardEl.classList.contains("paymentProviderCardActive")) {
                return;
            }

            removeAllPaymentProviderCardClasses();

            checkout_paymentProvider_cardEl.classList.add("paymentProviderCardActive");

            createStripePaymentIntent("card");
        });

        // Cash App
        const checkout_paymentProvider_cashappEl = document.getElementById("checkout_paymentProvider_cashapp");
        checkout_paymentProvider_cashappEl.addEventListener("click", () => {
            if (checkout_paymentProvider_cashappEl.classList.contains("paymentProviderCardActive")) {
                return;
            }

            removeAllPaymentProviderCardClasses();

            checkout_paymentProvider_cashappEl.classList.add("paymentProviderCardActive");

            createStripePaymentIntent("cashapp");
        });

        // Try to get the product details
        const getProductResult = await httpPost(
            "get-product-by-id",
            {
                productID: ProductID,
            },
            true
        );
        const getProductResponse = getProductResult.response;
        if (!getProductResponse.success) {
            showAlert("error", "Checkout Error", "Error getting Product Details. Please try again later.", false, false, "Show Store", "", "", () => {
                history.pushState(null, "", "/store");
                handleRoute();
            });
            return;
        }
        checkoutProduct = getProductResponse.message;

        // Inject product markup
        document.getElementById("checkoutProduct").innerHTML = createProductMarkup();

        // Load card payment method
        createStripePaymentIntent("card");

        // Inject purchase button
        document.getElementById("purchaseButton").innerHTML = createPurchaseButtonMarkup();

        document.getElementById("PurchaseNowButton").addEventListener("click", async () => {
            showLoader("Processing Payment");
            document.getElementById("checkoutErrorsContainer").style.display = "none";
            await confirmPayment();
            hideLoader();
        });

        document.getElementById("checkoutContainer").style.display = "";
    }
}
