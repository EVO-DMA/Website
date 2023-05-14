import { attachEvents as attachHeaderEvents, header as getHeader } from "../../templates/header";

export function show(queryParams) {
    document.getElementById("baseContainer").innerHTML = getTemplate();
    attachHeaderEvents();
}

function getTemplate() {
    return /*html*/`
        ${getHeader("Store")}
    `;
}
