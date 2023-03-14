export function httpPost(url, body, sessionToken = null) {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
    
        xhr.addEventListener("readystatechange", () => {
            if (this.readyState === 4) {
                resolve(JSON.parse(this.responseText));
            }
        });

        xhr.addEventListener("timeout", () => {
            // TODO: Show failure alert
        });
    
        xhr.open("POST", url);
        if (sessionToken !== null) xhr.setRequestHeader("Session-Token", sessionToken);
        xhr.setRequestHeader("Content-Type", "application/json");
    
        xhr.send(JSON.stringify(body));

        xhr.timeout = 6000;
    });
}