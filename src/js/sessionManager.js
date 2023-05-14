import { getAccountData } from "./routes/auth/accountDataManager";

/** @type {string} */
export let sessionToken = null;

/**
 * Set/save the session token.
 * @param {string} token
 */
export function set(token) {
    sessionToken = token;
    localStorage.setItem("sessionToken", token);
}

/**
 * Get the saved session token.
 */
export async function get() {
    sessionToken = localStorage.getItem("sessionToken");

    await getAccountData();
}
