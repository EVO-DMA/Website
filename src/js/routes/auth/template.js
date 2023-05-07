import authLogo from "../../../img/favicon.svg";
import { initialize as initializeLogic } from "./logic";

export function show(queryParams) {
    document.getElementById("baseContainer").innerHTML = getTemplate();
    initializeLogic(queryParams);
}

function getTemplate() {
    return /*html*/ `
        <!-- Login Page -->
        <div class="col-auto mt-5 mb-5 loginContainer">
            <div class="row m-0 mb-3 justify-content-center align-items-center">
                <div class="col-auto">
                    <img src="${authLogo}" class="authLogo p-0" />
                </div>
            </div>

            <!-- Form Title -->
            <div class="row m-0 justify-content-center align-items-center">
                <div class="col-auto">
                    <h1 id="authFormTitle">Loading...</h1>
                </div>
            </div>

            <!-- Alerts -->
            <div class="row m-0 justify-content-center align-items-center" id="authAlerts" style="display: none;"></div>

            <!-- Username -->
            <div class="row m-0 mb-3 justify-content-center align-items-center authUsername" style="display: none">
                <div class="col">
                    <label for="authUsername" class="form-label">Username</label>
                    <input type="text" class="form-control" id="authUsername" />
                </div>
            </div>

            <!-- Password Reset Token -->
            <div class="row m-0 mb-3 justify-content-center align-items-center authPasswordResetToken" style="display: none">
                <div class="col">
                    <label for="authPasswordResetToken" class="form-label">Token</label>
                    <input type="text" class="form-control" id="authPasswordResetToken" />
                </div>
            </div>

            <!-- Email -->
            <div class="row m-0 mb-3 justify-content-center align-items-center authEmail" style="display: none">
                <div class="col">
                    <label for="authEmail" class="form-label">Email</label>
                    <input type="email" class="form-control" id="authEmail" />
                </div>
            </div>

            <!-- Password -->
            <div class="row m-0 mb-3 justify-content-center align-items-center authPassword" style="display: none">
                <div class="col">
                    <label for="authPassword" class="form-label">Password</label>
                    <input type="password" class="form-control" id="authPassword" />
                    <div class="form-text authShowForgotPassword" id="authShowForgotPassword">Forgot password?</div>
                </div>
            </div>

            <!-- New Password -->
            <div class="row m-0 mb-3 justify-content-center align-items-center authNewPassword" style="display: none">
                <div class="col">
                    <label for="authNewPassword" class="form-label">New Password</label>
                    <input type="password" class="form-control" id="authNewPassword" />
                </div>
            </div>

            <!-- Invite Code -->
            <div class="row m-0 mb-3 justify-content-center align-items-center authInviteCode" style="display: none">
                <div class="col">
                    <label for="authInviteCode" class="form-label">Invite Code</label>
                    <input type="text" class="form-control" id="authInviteCode" />
                </div>
            </div>

            <div class="row m-0 mb-3 justify-content-center align-items-center">
                <div class="col-auto">
                    <button class="btn btn-primary authResetPassword" id="authResetPassword" style="display: none">Reset Password</button>
                    <button class="btn btn-primary authSendForgotPasswordEmail" id="authSendForgotPasswordEmail" style="display: none">Send Email</button>
                    <button class="btn btn-primary authLogin" id="authLogin" style="display: none">Login</button>
                    <button class="btn btn-secondary authShowRegister" id="authShowRegistration" style="display: none">Show Registration</button>
                    <button class="btn btn-primary authRegister" id="authRegister" style="display: none">Register</button>
                    <button class="btn btn-secondary authShowLogin" id="authShowLogin" style="display: none">Show Login</button>
                </div>
            </div>
        </div>
    `;
}
