if(document.readyState !== "loading") {
    console.log("loaded");
    initializeCodeLogin();
} else {
    document.addEventListener("DOMContentLoaded", function() {
        console.log("not loaded");
        initializeCodeLogin()
    })
}

function initializeCodeLogin() {
    const loginButton = document.getElementById("login-form");
    console.log("here")
    loginButton.addEventListener("submit", logEvent);
}

async function logEvent(event) {
    event.preventDefault();
    console.log("fetch")
    await fetch("/api/user/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: '{ "email": "' + event.target[0].value +'", "password":"' + event.target[1].value +'" }'
    })
    .then(response => response.json())
    .then(data =>{
        if(data.token) {
            console.log(data);
            storeToken(data.token);
            window.location.href ="/";
        }
    }) 
}

function storeToken(token) {
    localStorage.setItem("auth_token", token)
}