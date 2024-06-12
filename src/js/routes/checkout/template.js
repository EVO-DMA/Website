import { attachEvents as attachHeaderEvents, header as getHeader } from "../../templates/header";
import { AccountData } from "../auth/accountDataManager";
import { checkoutProduct, initialize as initializeLogic, SubscriptionTerm, SubscriptionTermDays } from "./logic";
import { initialize as initializeStripe } from "./Stripe";

export async function show(queryParams) {
    if (AccountData == null) return;
    document.getElementById("baseContainer").innerHTML = getTemplate();
    attachHeaderEvents();
    await initializeStripe();
    initializeLogic(queryParams);
}

function getTemplate() {
    return /*html*/ `
        ${getHeader("Checkout")}

        <div class="row m-0 p-0 col-auto checkoutContainer" id="checkoutContainer" style="display: none;">
            <!-- Checkout Summary -->
            <div class="row m-0 p-0">
                <div class="row m-0 p-0 checkoutSummary">
                    <div class="col p-0">Checkout Summary</div>
                </div>
                <div class="row justify-content-center align-items-center m-0 mt-3 p-0 pt-3 pb-3 checkoutProduct" id="checkoutProduct"></div>
            </div>
            <div class="form-text mt-3 mb-2 p-0">We have partnered with Stripe to offer secure and convenient payment options.</div>
            <div class="row m-0 mt-2 mb-3 p-0 checkoutErrorsContainer" id="checkoutErrorsContainer" style="display: none;"></div>
            <div class="row m-0 p-0">
                <div class="col p-0" id="paymentElement"><!--Stripe.js injects the Payment Element--></div>
            </div>
            <div class="row justify-content-end align-items-center m-0 mt-3 p-0 pt-3" id="purchaseButton"></div>
        </div>
    `;
}

function getPrice() {
    if (SubscriptionTerm === -1)
        return checkoutProduct[`Price_Lifetime`];
    else
        return checkoutProduct[`Price_${SubscriptionTerm}_Day`];
}

export function createProductMarkup() {
    const price = getPrice();

    return /*html*/ `
        <div class="col-auto">
            <img src="${checkoutProduct.Icon}" class="p-0 checkoutItemIcon" />
        </div>
        <div class="col">
            <div class="row m-0">
                <div class="col-auto">${checkoutProduct.Name}</div>
            </div>
            <div class="row m-0">
                <div class="col-auto">
                    <div class="form-text p-0">${SubscriptionTermDays} Subscription</div>
                </div>
            </div>
        </div>
        <div class="col-auto">$${price}</div>
        <div class="row justify-content-between align-items-center m-0 mt-3 p-0 pt-3 checkoutPriceTotal">
            <div class="col-auto">Total</div>
            <div class="col-auto">$${price}</div>
        </div>
    `;
}

export function createPurchaseButtonMarkup() {
    return /*html*/ `
        <button class="btn btn-secondary" id="PurchaseNowButton">Pay $${getPrice()} Now</button>
    `;
}

export function showError(message) {
    const checkoutErrorsContainerEl = document.getElementById("checkoutErrorsContainer");
    checkoutErrorsContainerEl.style.display = "";
    checkoutErrorsContainerEl.innerHTML = /*html*/ `<div class="col checkoutError">${message}</div>`;
}
