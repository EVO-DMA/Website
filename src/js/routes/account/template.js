import { attachEvents as attachHeaderEvents, header as getHeader } from "../../templates/header";
import { AccountData } from "../auth/accountDataManager";
import { initialize as initializeLogic } from "./logic";

export function show(queryParams) {
    if (AccountData == null) return;
    document.getElementById("baseContainer").innerHTML = getTemplate();
    attachHeaderEvents();
    initializeLogic();
}

function getTemplate() {
    return /*html*/ `
        ${getHeader("Account")}

        <!-- Account Page -->
        <div class="row m-0 p-0 col-auto accountContainer">
            <!-- Sidebar -->
            <div class="col-auto p-0 accountContainerSidebar">
                <div class="row m-0">
                    <div class="row m-0 p-0 accountProfilePicture">
                        <img src="data:image/png;base64,${AccountData.user.Avatar}" class="p-0 accountProfilePicture" />
                    </div>
                    <div class="row m-0 pt-2 pb-2 p-0 accountUsername justify-content-center align-items-center">
                        <span class="username-text">${AccountData.user.Username}</span>
                    </div>
                </div>
                <div class="row m-0 accountTabsContainer">
                    <div class="accountTab" id="accountTab_overview">Overview</div>
                    <div class="accountTab" id="accountTab_subscriptions">Subscriptions</div>
                    <div class="accountTab" id="accountTab_orders">Orders</div>
                    <div class="accountTab" id="accountTab_referralProgram">Referral Program</div>
                    <div class="accountTab" id="accountTab_accountInfo">Account Info</div>
                </div>
            </div>
            <!-- Main -->
            <div class="col accountContainerMain" id="accountContainerMain"></div>
        </div>
    `;
}
