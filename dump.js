function sendReq() {
    showProgressBar();
    document.getElementById("response-textarea").value = "Please wait...";
    const apiUrl = document.getElementById("req-url").value;
    const requestType = document.getElementById("requestType").value;
    if (requestType == "GET") {
        const headers = getHeaderData();
        callGet(apiUrl, headers, hideProgressBar);
    }
}

function callGet(apiUrl, headers, callback) {
    fetch(apiUrl, {
            method: 'GET',
            headers: headers
        })
        .then(response => response.text())
        .then((text) => {
            document.getElementById("response-textarea").value = text;
        })
        .catch(error => {
            console.error("An error occurred:", error);
        })
        .finally(() => {
            if (typeof callback === "function") {
                callback();
            }
        });
}
