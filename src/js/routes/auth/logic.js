import { showAlert } from "../../alert";
import { httpPost } from "../../http";
import { handleRoute } from "../../router";
import { set as setSessionToken } from "../../sessionManager";

// Elements
/** @type {HTMLDivElement} */
let authFormTitleEl;
/** @type {HTMLDivElement} */
let authAlertsEl;

// Buttons
/** @type {HTMLButtonElement} */
let authResetPasswordEl;
/** @type {HTMLButtonElement} */
let authSendForgotPasswordEmailEl;
/** @type {HTMLButtonElement} */
let authActivateAccountEl;
/** @type {HTMLButtonElement} */
let authShowLoginEl;
/** @type {HTMLButtonElement} */
let authLoginEl;
/** @type {HTMLButtonElement} */
let authShowRegistrationEl;
/** @type {HTMLButtonElement} */
let authRegisterEl;

// Inputs
/** @type {HTMLInputElement} */
let authUsernameEl;
/** @type {HTMLInputElement} */
let authEmailEl;
/** @type {HTMLInputElement} */
let authPasswordResetTokenEl;
/** @type {HTMLInputElement} */
let authAccountActivationTokenEl;
/** @type {HTMLInputElement} */
let authPasswordEl;
/** @type {HTMLInputElement} */
let authNewPasswordEl;
/** @type {HTMLInputElement} */
let authInviteCodeEl;

/** @type {HTMLDivElement} */
let authShowForgotPasswordEl;

/**
 * Display auth alerts from a string array.
 * @param {boolean} success
 * @param {string[]} alerts
 */
function alertHandler(success, alerts) {
    /** @type {string} */
    let alertsClass;

    if (success) {
        alertsClass = "authAlertInfo";
    } else {
        alertsClass = "authAlertError";
    }

    authAlertsEl.innerHTML = "";

    alerts.forEach((alert) => {
        authAlertsEl.innerHTML += /*html*/ `
            <div>
                <div class="col-12 mb-2 authAlert ${alertsClass}">${alert}</div>
            </div>
        `;
    });

    if (alerts.length > 0) {
        authAlertsEl.style.display = "";
    } else {
        authAlertsEl.style.display = "none";
        authAlertsEl.innerHTML = "";
    }
}

/**
 * Show/hide all elements with the given class.
 * @param {string} name
 * @param {("show"|"hide")} action
 */
function setRelativesVisibility(name, action) {
    Array.from(document.getElementsByClassName(name)).forEach((el) => {
        if (action === "show") {
            el.style.display = "";
        } else if (action === "hide") {
            el.style.display = "none";
        }
    });
}

export function initialize(queryParams) {
    // Elements
    authFormTitleEl = document.getElementById("authFormTitle");
    authAlertsEl = document.getElementById("authAlerts");

    // Buttons
    authResetPasswordEl = document.getElementById("authResetPassword");
    authSendForgotPasswordEmailEl = document.getElementById("authSendForgotPasswordEmail");
    authActivateAccountEl = document.getElementById("authActivateAccount");
    authShowLoginEl = document.getElementById("authShowLogin");
    authLoginEl = document.getElementById("authLogin");
    authShowRegistrationEl = document.getElementById("authShowRegistration");
    authRegisterEl = document.getElementById("authRegister");

    // Inputs
    authUsernameEl = document.getElementById("authUsername");
    authEmailEl = document.getElementById("authEmail");
    authPasswordResetTokenEl = document.getElementById("authPasswordResetToken");
    authAccountActivationTokenEl = document.getElementById("authAccountActivationToken");
    authPasswordEl = document.getElementById("authPassword");
    authNewPasswordEl = document.getElementById("authNewPassword");
    authInviteCodeEl = document.getElementById("authInviteCode");

    // Forgot password link
    authShowForgotPasswordEl = document.getElementById("authShowForgotPassword");

    // Login
    authShowLoginEl.addEventListener("click", showLogin);
    authLoginEl.addEventListener("click", async () => {
        const result = await httpPost("login", {
            email: authEmailEl.value,
            password: authPasswordEl.value,
        });

        const response = result.response;
        const xhr = result.xhr;

        alertHandler(response.success, response.message);

        if (response.success) {
            // Try to persist the session token
            try {
                const sessionToken = xhr.getResponseHeader("session-token");

                if (sessionToken != null && sessionToken.length > 0) {
                    setSessionToken(sessionToken);
                    history.pushState(null, null, "/account");
                    handleRoute();
                }
            } catch (error) {
                console.error(`ERROR saving session token: ${error}`);
            }
        }
    });

    // Registration
    authShowRegistrationEl.addEventListener("click", showRegistration);
    authRegisterEl.addEventListener("click", async () => {
        const result = await httpPost("register", {
            username: authUsernameEl.value,
            email: authEmailEl.value,
            password: authPasswordEl.value,
            invite: authInviteCodeEl.value,
        });

        const response = result.response;

        alertHandler(response.success, response.message);

        if (response.success) {
            showAlert(
                "success",
                "Registration",
                /*html*/ `Your account has been created! Please check your inbox at ${authEmailEl.value} for instructions on activating your account.<br>NOTE: It may take 5-10 minutes for the email to arrive.`,
                false,
                false,
                "Show Login",
                "",
                "",
                (result) => {
                    if (result) {
                        showLogin();
                    }
                }
            );
        }
    });

    // Account Activation
    authActivateAccountEl.addEventListener("click", async () => {
        const result = await httpPost("activate-account", {
            email: authEmailEl.value,
            token: authAccountActivationTokenEl.value,
        });

        const response = result.response;

        alertHandler(response.success, response.message);

        if (response.success) {
            showAlert("success", "Account Activation", "Your account has been activated! You may now login.", false, false, "Show Login", "", "", (result) => {
                if (result) {
                    showLogin();
                }
            });
        }
    });

    // Forgot Password
    authShowForgotPasswordEl.addEventListener("click", showForgotPassword);
    authSendForgotPasswordEmailEl.addEventListener("click", async () => {
        const result = await httpPost("forgot-password", {
            email: authEmailEl.value,
        });

        const response = result.response;

        alertHandler(response.success, response.message);

        if (response.success) {
        }
    });

    // Password Reset
    authResetPasswordEl.addEventListener("click", async () => {
        const result = await httpPost("password-reset", {
            email: authEmailEl.value,
            token: authPasswordResetTokenEl.value,
            password: authNewPasswordEl.value,
        });

        const response = result.response;

        alertHandler(response.success, response.message);

        if (response.success) {
            showAlert(
                "success",
                "Password Reset",
                "Your password has been reset successfully! You may now login with your new password.",
                false,
                false,
                "Show Login",
                "",
                "",
                (result) => {
                    if (result) {
                        showLogin();
                    }
                }
            );
        }
    });

    // Parse query params and show appropriate content
    const urlAction = queryParams["action"];
    if (urlAction != null) {
        if (urlAction === "password-reset") {
            showPasswordReset();

            // Try to populate token
            const token = queryParams["token"];
            if (token != null) {
                authPasswordResetTokenEl.value = token;
            }

            // Try to populate email
            const email = queryParams["email"];
            if (email != null) {
                authEmailEl.value = email;
            }
        } else if (urlAction === "account-activation") {
            showAccountActivation();

            // Try to populate token
            const token = queryParams["token"];
            if (token != null) {
                authAccountActivationTokenEl.value = token;
            }

            // Try to populate email
            const email = queryParams["email"];
            if (email != null) {
                authEmailEl.value = email;
            }
        }
    } else {
        showLogin();
    }
}

/**
 * Show the login form.
 */
function showLogin() {
    resetUI();

    authFormTitleEl.innerText = "Login";

    // Email
    setRelativesVisibility("authEmail", "show");

    // Password
    setRelativesVisibility("authPassword", "show");
    setRelativesVisibility("authShowForgotPassword", "show");

    // Buttons
    setRelativesVisibility("authLogin", "show");
    setRelativesVisibility("authShowRegister", "show");
}

/**
 * Show the registration form.
 */
function showRegistration() {
    resetUI();

    authFormTitleEl.innerText = "Registration";

    // Username
    setRelativesVisibility("authUsername", "show");

    // Email
    setRelativesVisibility("authEmail", "show");

    // Password
    setRelativesVisibility("authPassword", "show");

    // Invite Code
    setRelativesVisibility("authInviteCode", "show");

    // Buttons
    setRelativesVisibility("authRegister", "show");
    setRelativesVisibility("authShowLogin", "show");
}

/**
 * Show the account activation form.
 */
function showAccountActivation() {
    resetUI();

    authFormTitleEl.innerText = "Account Activation";

    // Account Activation Token
    setRelativesVisibility("authAccountActivationToken", "show");

    // Email
    setRelativesVisibility("authEmail", "show");

    // Buttons
    setRelativesVisibility("authActivateAccount", "show");
    setRelativesVisibility("authShowLogin", "show");
}

/**
 * Show the forgot password form.
 */
function showForgotPassword() {
    resetUI();

    authFormTitleEl.innerText = "Forgot Password";

    // Email
    setRelativesVisibility("authEmail", "show");

    // Buttons
    setRelativesVisibility("authSendForgotPasswordEmail", "show");
    setRelativesVisibility("authShowLogin", "show");
}

/**
 * Show password reset form.
 */
function showPasswordReset() {
    resetUI();

    authFormTitleEl.innerText = "Password Reset";

    // Password Reset Token
    setRelativesVisibility("authPasswordResetToken", "show");

    // Email
    setRelativesVisibility("authEmail", "show");

    // New Password
    setRelativesVisibility("authNewPassword", "show");

    // Buttons
    setRelativesVisibility("authResetPassword", "show");
    setRelativesVisibility("authShowLogin", "show");
}

/**
 * Resets the auth form to it's default state.
 */
function resetUI() {
    // Form Title
    authFormTitleEl.innerText = "Loading...";

    // Alerts
    authAlertsEl.style.display = "none";
    authAlertsEl.innerHTML = "";

    // Clear sensitive inputs
    authPasswordResetTokenEl.value = "";
    authPasswordEl.value = "";
    authNewPasswordEl.value = "";
    authInviteCodeEl.value = "";

    // Username
    setRelativesVisibility("authUsername", "hide");

    // Password Reset Token
    setRelativesVisibility("authPasswordResetToken", "hide");

    // Account Activation Token
    setRelativesVisibility("authAccountActivationToken", "hide");

    // Email
    setRelativesVisibility("authEmail", "hide");

    // Password
    setRelativesVisibility("authPassword", "hide");
    setRelativesVisibility("authShowForgotPassword", "hide");

    // New Password
    setRelativesVisibility("authNewPassword", "hide");

    // Invite Code
    setRelativesVisibility("authInviteCode", "hide");

    // Buttons
    // Activate Account
    setRelativesVisibility("authActivateAccount", "hide");
    // Reset Password
    setRelativesVisibility("authResetPassword", "hide");
    // Send Email
    setRelativesVisibility("authSendForgotPasswordEmail", "hide");
    // Login
    setRelativesVisibility("authShowLogin", "hide");
    setRelativesVisibility("authLogin", "hide");
    // Register
    setRelativesVisibility("authShowRegister", "hide");
    setRelativesVisibility("authRegister", "hide");
}
