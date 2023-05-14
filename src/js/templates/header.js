import headerLogo from "../../img/favicon.svg";
import { handleRoute } from "../router";

/**
 * Get the page header template.
 * @param {("Store"|"Account")} activePage
 */
export function header(activePage) {
    return /*html*/`
        <div class="appHeader row m-0">
            <!-- Header Logo -->
            <div class="col-auto h-100">
                <img src="${headerLogo}" class="headerLogo p-0" />
            </div>
            <!-- Page Title -->
            <div class="col-auto p-0">
                <div class="row m-0 h-100 justify-content-center align-items-center">
                    <div class="col-auto pageTitle">EVO DMA - ${activePage}</div>
                </div>
            </div>
            <!-- Site Navigation -->
            <div class="col p-0">
                <div class="row m-0 h-100 justify-content-end align-items-center">
                    <div class="row col-auto justify-content-end align-items-center m-0 headerNav ${activePage === "Store" ? "headerNavActive" : ""}" id="headerNav_Store">
                        <div class="col-auto headerNavInner"><i class="fa-solid fa-store me-2 buttonIcon"></i>Store</div>
                    </div>
                    <div class="row col-auto justify-content-end align-items-center m-0 headerNav ${activePage === "Account" ? "headerNavActive" : ""}" id="headerNav_Account">
                        <div class="col-auto headerNavInner"><i class="fa-solid fa-user-cowboy me-2 buttonIcon"></i>Account</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function attachEvents() {
    const headerNav_StoreEl = document.getElementById("headerNav_Store");
    const headerNav_AccountEl = document.getElementById("headerNav_Account");

    headerNav_StoreEl.addEventListener("click", () => {
        history.pushState(null, "", "/store");
        handleRoute();
    });

    headerNav_AccountEl.addEventListener("click", () => {
        history.pushState(null, "", "/account");
        handleRoute();
    });
}
