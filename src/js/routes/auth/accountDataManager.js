import { httpPost } from "../../http";

/**
 * @typedef {object} AccountData
 * @property {object} user
 * @property {string?} user.Discord_ID
 * @property {string} user.Avatar
 * @property {string} user.Username
 * @property {string} user.Email
 * @property {object} account
 * @property {("administrator"|"customer")} account.type
 * @property {boolean} account.canInvite
 */

/** @type {AccountData} */
export let AccountData = null;

export async function getAccountData() {
    // Try to get account details
    const result = await httpPost("get-account-details", {}, true);
    const response = result.response;
    if (response.success) {
        AccountData = response.message;
        console.log(AccountData);
    }
}