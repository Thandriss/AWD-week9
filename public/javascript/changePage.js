if(document.readyState !== "loading") {
    console.log("loaded");
    initializeCodeS();
} else {
    document.addEventListener("DOMContentLoaded", function() {
        console.log("not loaded");
        initializeCodeS()
    })
}

function initializeCodeS() {
    const tok = localStorage.getItem("auth_token");
    let body = document.getElementsByTagName("body")[0];
    if (tok) {
        body.innerHTML = "";
        var button = document.createElement("BUTTON");
        button.innerText = "Log out";
        button.id = "logout";
        button.onclick = logout();
        var textEmail = document.createElement("div");
        fetch("http://localhost:3000/api/private", {
            method: "get",
            headers: {
                "cookie": "cook=" + tok
            }
        })
        .then((response) => response.json())
        .then((data) => {
            textEmail.innerHTML = data.email
        })
        body.appendChild(button);
        body.appendChild(textEmail);
    } else {
        body.innerHTML = "";
        var loginLink = document.createElement("a");
        loginLink.href = "/login.html";
        loginLink.innerText = "Login";
        var registrationLink = document.createElement("a");
        registrationLink.href = "/registration.html";
        registrationLink.innerHTML = "Register";
        body.appendChild(loginLink);
        body.appendChild(registrationLink);
    }
}
function logout() {
    localStorage.removeItem("auth_token");
}