// Elements
const authFormTitleEl = document.getElementById("authFormTitle");

// Buttons
const authSendEmailEl = document.getElementById("authSendEmail");
const authLoginBtnEl = document.getElementById("authLogin");
const authRegisterBtnEl = document.getElementById("authRegister");

const authUsernameEl = document.getElementById("authUsername");
const authEmailEl = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authForgotPassword = document.getElementById("authForgotPassword");
const authInviteEl = document.getElementById("authInvite");

/** @type {("login"|"registration"|"forgot")} */
let shownForm = "login";

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

export function initialize() {
    authLoginBtnEl.addEventListener("click", () => {
        if (shownForm !== "login") {
            shownForm = "login";
            authFormTitleEl.innerText = "Login";
            setRelativesVisibility("authUsername", "hide");
            setRelativesVisibility("authPassword", "show");
            setRelativesVisibility("authForgotPassword", "show");
            setRelativesVisibility("authInvite", "hide");
            setRelativesVisibility("authSendEmail", "hide");
            authLoginBtnEl.classList.replace("btn-secondary", "btn-primary");
            authLoginBtnEl.innerText = "Login";
            setRelativesVisibility("authRegister", "show");
            authRegisterBtnEl.innerText = "Show Registration";
        } else {
            // Do login
        }
    });

    authRegisterBtnEl.addEventListener("click", () => {
        if (shownForm !== "registration") {
            shownForm = "registration";
            authFormTitleEl.innerText = "Registration";
            setRelativesVisibility("authUsername", "show");
            setRelativesVisibility("authForgotPassword", "hide");
            setRelativesVisibility("authInvite", "show");
            authLoginBtnEl.innerText = "Show Login";
            authRegisterBtnEl.innerText = "Register";
        } else {
            // Do registration
        }
    });

    authForgotPassword.addEventListener("click", () => {
        shownForm = "forgot";
        authFormTitleEl.innerText = "Forgot Password";
        setRelativesVisibility("authUsername", "hide");
        setRelativesVisibility("authPassword", "hide");
        setRelativesVisibility("authInvite", "hide");
        setRelativesVisibility("authSendEmail", "show");
        authLoginBtnEl.classList.replace("btn-primary", "btn-secondary");
        authLoginBtnEl.innerText = "Show Login";
        setRelativesVisibility("authRegister", "hide");
    });

    authSendEmailEl.addEventListener("click", () => {
        // Do forgot password
    });
}
