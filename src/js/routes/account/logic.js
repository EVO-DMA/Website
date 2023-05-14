import { getTemplate as getOverviewTemplate } from "./tabs/overview";
import { getTemplate as getReferralProgramTemplate } from "./tabs/referralProgram";
import { getTemplate as getAccountInfoTemplate } from "./tabs/accountInfo";

/** @type {HTMLDivElement} */
let accountContainerMainEl;

/** @type {HTMLDivElement} */
let accountTab_overviewEl;
/** @type {HTMLDivElement} */
let accountTab_subscriptionsEl;
/** @type {HTMLDivElement} */
let accountTab_ordersEl;
/** @type {HTMLDivElement} */
let accountTab_referralProgramEl;
/** @type {HTMLDivElement} */
let accountTab_accountInfoEl;

export function initialize() {
    accountTab_overviewEl = document.getElementById("accountTab_overview");
    accountTab_subscriptionsEl = document.getElementById("accountTab_subscriptions");
    accountTab_ordersEl = document.getElementById("accountTab_orders");
    accountTab_referralProgramEl = document.getElementById("accountTab_referralProgram");
    accountTab_accountInfoEl = document.getElementById("accountTab_accountInfo");

    accountContainerMainEl = document.getElementById("accountContainerMain");

    accountTab_overviewEl.addEventListener("click", showOverview);
    accountTab_subscriptionsEl.addEventListener("click", showSubscriptions);
    accountTab_ordersEl.addEventListener("click", showOrders);
    accountTab_referralProgramEl.addEventListener("click", showReferralProgram);
    accountTab_accountInfoEl.addEventListener("click", showAccountInfo);

    // Show default tab
    showOverview();
}

function showOverview() {
    resetUI();

    // Add Active class to tab control
    accountTab_overviewEl.classList.add("accountTabActive");

    // Show tab content
    accountContainerMainEl.innerHTML = getOverviewTemplate(false);

    // Attach events to tab content
    document.getElementById("referralProgramLearnMore").addEventListener("click", showReferralProgram);
}

function showSubscriptions() {
    resetUI();

    // Add Active class to tab control
    accountTab_subscriptionsEl.classList.add("accountTabActive");

    // Show tab content
    accountContainerMainEl.innerHTML = getOverviewTemplate(true);
}

function showOrders() {
    resetUI();

    // Add Active class to tab control
    accountTab_ordersEl.classList.add("accountTabActive");

    // Show tab content
    accountContainerMainEl.innerHTML = getOverviewTemplate();
}

function showReferralProgram() {
    resetUI();

    // Add Active class to tab control
    accountTab_referralProgramEl.classList.add("accountTabActive");

    // Show tab content
    accountContainerMainEl.innerHTML = getReferralProgramTemplate(false);
}

function showAccountInfo() {
    resetUI();

    // Add Active class to tab control
    accountTab_accountInfoEl.classList.add("accountTabActive");

    // Show tab content
    accountContainerMainEl.innerHTML = getAccountInfoTemplate();
}

function resetUI() {
    // Remove Active class from all tab controls
    accountTab_overviewEl.classList.remove("accountTabActive");
    accountTab_subscriptionsEl.classList.remove("accountTabActive");
    accountTab_ordersEl.classList.remove("accountTabActive");
    accountTab_referralProgramEl.classList.remove("accountTabActive");
    accountTab_accountInfoEl.classList.remove("accountTabActive");
}
