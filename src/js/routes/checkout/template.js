import { attachEvents as attachHeaderEvents, header as getHeader } from "../../templates/header";
import { AccountData } from "../auth/accountDataManager";
import { toDollarFormat } from "../store/utils";
import { checkoutProduct, initialize as initializeLogic, SubscriptionTerm } from "./logic";
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
            <!-- Promo Code -->
            <div class="row m-0 mt-3 p-0 checkoutSummary">
                <div class="col p-0">Promo Code</div>
            </div>
            <div class="row justify-content-center align-items-center m-0 mt-3 p-0">
                <div class="col ps-0">
                    <input type="text" class="form-control checkout-form-control" id="checkoutPromoCode" placeholder="EVO-ON-TOP" />
                </div>
                <div class="col-auto p-0">
                    <button class="btn btn-secondary" id="ApplyPromoButton"><i class="fa-duotone fa-face-tongue-money me-1"></i>Apply Promo</button>
                </div>
            </div>
            <!-- Payment Provider Selection -->
            <div class="row m-0 mt-3 p-0 checkoutSummary">
                <div class="col p-0">Payment Methods</div>
            </div>
            <div class="form-text mt-3 mb-2 p-0">We have partnered with several payment processors to offer secure and convenient payment options.</div>
            <div class="row m-0 p-0">
                <div class="row m-0 mb-3 p-0">
                    <div class="col-6 paymentProviderCardOuter">
                        <div class="paymentProviderCard paymentProviderCardActive" id="checkout_paymentProvider_card">
                            <!-- Icon -->
                            <div class="row m-0 p-0">
                                <div class="col-auto p-0 paymentProviderIcon"><i class="fa-brands fa-cc-stripe"></i></div>
                            </div>
                            <!-- Text -->
                            <div class="row m-0 p-0">
                                <div class="col-auto p-0">Card</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 paymentProviderCardOuter">
                        <div class="paymentProviderCard" id="checkout_paymentProvider_cashapp">
                            <!-- Icon -->
                            <div class="row m-0 p-0">
                                <div class="col-auto p-0 paymentProviderIcon"><i class="fa-brands fa-cc-stripe"></i></div>
                            </div>
                            <!-- Text -->
                            <div class="row m-0 p-0">
                                <div class="col-auto p-0">Cash App</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row m-0 mb-3 p-0">
                    <div class="col-6 paymentProviderCardOuter">
                        <div class="paymentProviderCard" id="checkout_paymentProvider_paypal">
                            <!-- Icon -->
                            <div class="row m-0 p-0">
                                <div class="col-auto p-0 paymentProviderIcon"><i class="fa-brands fa-paypal"></i></div>
                            </div>
                            <!-- Text -->
                            <div class="row m-0 p-0">
                                <div class="col-auto p-0">PayPal</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 paymentProviderCardOuter">
                        <div class="paymentProviderCard" id="checkout_paymentProvider_crypto">
                            <!-- Icon -->
                            <div class="row m-0 p-0">
                                <div class="col-auto p-0 paymentProviderIcon"><i class="fa-brands fa-bitcoin"></i></div>
                            </div>
                            <!-- Text -->
                            <div class="row m-0 p-0">
                                <div class="col-auto p-0">Crypto</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row m-0 p-0">
                    <div class="col-6 paymentProviderCardOuterSingle">
                        <div class="paymentProviderCard" id="checkout_paymentProvider_evocoin">
                            <!-- Icon -->
                            <div class="row m-0 p-0">
                                <div class="col-auto p-0 paymentProviderIcon"><i class="fa-duotone fa-circle-dollar"></i></div>
                            </div>
                            <div class="row m-0">
                                <!-- Text -->
                                <div class="col p-0">
                                    <div class="row m-0 p-0">
                                        <div class="col p-0">EVO Coin</div>
                                    </div>
                                </div>
                                <!-- Wallet Amount -->
                                <div class="col-auto p-0 evoCoinWalletAmount">
                                    <div class="row m-0 p-0">
                                        <div class="col-auto p-0">${AccountData.account.accountCredit <= 0 ? "" : `<i class="fa-duotone fa-piggy-bank me-1"></i>${toDollarFormat(AccountData.account.accountCredit)}`}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row m-0 mt-3 mb-3 p-0 checkoutSummary">
                <div class="col p-0" id="checkout_selectedPaymentMethodTitle">Card Checkout</div>
            </div>
            <div class="row m-0 mb-3 p-0 checkoutErrorsContainer" id="checkoutErrorsContainer" style="display: none;"></div>
            <div class="row m-0 p-0" id="stripePaymentContainer">
                <div class="col p-0" id="paymentElement"><!--Stripe.js injects the Payment Element--></div>
            </div>
            <div class="row justify-content-end align-items-center m-0 mt-3 p-0 pt-3" id="purchaseButton"></div>
        </div>
    `;
}

export function createProductMarkup() {
    const originalPriceRaw = checkoutProduct[`Original_Price_${SubscriptionTerm}_Day`];
    const purchasePriceRaw = checkoutProduct[`Price_${SubscriptionTerm}_Day`];

    const totalPriceFormatted = toDollarFormat(purchasePriceRaw);
    const originalPriceFormatted = toDollarFormat(originalPriceRaw);
    const discountPriceFormatted = toDollarFormat(originalPriceRaw - purchasePriceRaw);
    const earnedRewardsFormatted = toDollarFormat(purchasePriceRaw * (checkoutProduct.CashBackPercent * 100));

    let discount = "";
    if (originalPriceRaw != purchasePriceRaw) {
        discount = /*html*/`
            <div class="row justify-content-between align-items-center m-0 mt-3 p-0 pt-3 checkoutPriceTotal">
                <div class="col-auto">Discount</div>
                <div class="col-auto checkoutDiscountTotal">-${discountPriceFormatted}</div>
            </div>
        `;
    }

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
                    <div class="form-text p-0">${SubscriptionTerm} Day Subscription</div>
                </div>
            </div>
        </div>
        <div class="col-auto">${originalPriceFormatted}</div>
        ${discount}
        <div class="row justify-content-between align-items-center m-0 mt-3 p-0 pt-3 checkoutPriceTotal">
            <div class="col-auto">Total</div>
            <div class="col-auto">${totalPriceFormatted}</div>
        </div>
        <div class="row justify-content-between align-items-center m-0 mt-3 p-0 pt-3 checkoutPriceTotal">
            <div class="col-auto">Rewards</div>
            <div class="col-auto">
                <div class="checkoutEarnedRewardsTotal text-end">+${earnedRewardsFormatted}</div>
                <div class="form-text mt-3 mb-2 p-0">This purchase earns you ${checkoutProduct.CashBackPercent}% cash back in the form of EVO Coin!</div>
            </div>
        </div>
    `;
}

export function createPurchaseButtonMarkup() {
    const purchasePriceRaw = checkoutProduct[`Price_${SubscriptionTerm}_Day`];
    const totalPriceFormatted = toDollarFormat(purchasePriceRaw);

    return /*html*/ `
        <button class="btn btn-secondary" id="PurchaseNowButton"></i>Pay ${totalPriceFormatted} Now</button>
    `;
}

export function showError(message) {
    const checkoutErrorsContainerEl = document.getElementById("checkoutErrorsContainer");
    checkoutErrorsContainerEl.style.display = "";
    checkoutErrorsContainerEl.innerHTML = /*html*/ `<div class="col checkoutError">${message}</div>`;
}
