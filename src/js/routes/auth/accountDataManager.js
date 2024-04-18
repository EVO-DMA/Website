import { httpPost } from "../../http";

/**
 * @typedef {object} InviteCode
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {object} InvitedUser
 * @property {string} username
 * @property {string} discord
 */

/**
 * @typedef {object} AccountData
 * @property {object} user
 * @property {number} user.uid
 * @property {string?} user.Discord
 * @property {string} user.Avatar
 * @property {string} user.Username
 * @property {string} user.Email
 * @property {object} account
 * @property {("administrator"|"customer")} account.type
 * @property {boolean} account.canInvite
 * @property {InviteCode[]} account.inviteCodes
 * @property {Object<string,InvitedUser>} account.invitedUsers
 * @property {number} account.baseDiscount
 * @property {number} account.globalDiscount
 * @property {number} account.accountCredit
 */

/**
 * @typedef {object} Subscription
 * @property {string} Product The name of the product that was purchased.
 * @property {boolean} Active
 * @property {string} Expiration Date in human readable relative format (ex. in 29 days).
 */

/**
 * The status of a PaymentIntent.
 * @typedef {("canceled"|"created"|"failed"|"processing"|"succeeded")} PaymentIntentStatus
 */

/**
 * @typedef {object} Order
 * @property {string} ID
 * @property {PaymentIntentStatus} Status
 * @property {number} Price
 * @property {(7|30|90)} Term
 * @property {string} Date The order date in human readable relative format (ex. 29 days ago).
 */

/**
 * @typedef {object} PurchaseData
 * @property {Subscription[]} subscriptions
 * @property {Order[]} orders
 * @property {number} activeSubscriptions
 */

/** @type {AccountData} */
export let AccountData = null;

/** @type {PurchaseData} */
export let PurchaseData = null;

export async function getAccountData() {
    // Try to get account details
    const result = await httpPost("get-account-data", {}, true);
    const response = result.response;
    if (response.success) {
        AccountData = response.message;
    }

    await getPurchaseData();
}

async function getPurchaseData() {
    // Try to get purchase details
    const result = await httpPost("get-purchase-data", {}, true);
    const response = result.response;
    if (response.success) {
        PurchaseData = response.message;

        const subscriptions = PurchaseData.subscriptions;

        // Get active subscription count
        let activeSubscriptionCount = 0;
        subscriptions.forEach((subscription) => {
            if (subscription.Active) activeSubscriptionCount++;
        });
        PurchaseData.activeSubscriptions = activeSubscriptionCount;
    }
}
