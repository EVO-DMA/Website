import globals from "./globals";

export function httpPost(endpoint, body, sessionToken = null) {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = false;

        xhr.addEventListener("readystatechange", () => {
            if (xhr.readyState === 4) {
                const sessionToken = xhr.getResponseHeader("session-token");

                // localStorage.setItem("session-token", sessionToken);

                console.log(sessionToken);

                resolve(JSON.parse(xhr.responseText));
            }
        });

        xhr.addEventListener("timeout", () => {
            // TODO: Show failure alert
        });

        xhr.open("POST", `${globals.url}/${endpoint}`);
        if (sessionToken !== null) xhr.setRequestHeader("Session-Token", sessionToken);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(JSON.stringify(body));

        xhr.timeout = 6000;
    });
}
