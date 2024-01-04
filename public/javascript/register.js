if(document.readyState !== "loading") {
    console.log("loaded");
    initializeCode();
} else {
    document.addEventListener("DOMContentLoaded", function() {
        console.log("not loaded");
        initializeCode()
    })
}

function initializeCode() {
    const addTextButton = document.getElementById("login-form");
    console.log("here")
    addTextButton.addEventListener("submit", regEvent);
}
    

async function regEvent(event) {
    console.log("reg");
    event.preventDefault();
    console.log(event.target[0].value)
    console.log('{ "email": "' + event.target[0].value +'", "password":"' + event.target[1].value +'" }')
    let er = document.getElementById("error");
    let response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: '{ "email": "' + event.target[0].value +'", "password":"' + event.target[1].value +'" }'
    })
    let data = await response.json();
    if(data.email || data.errors) {
        console.log("errors")
        if (data.email) {
            er.innerHTML = data.email;
        } else if (data.errors){
            er.innerHTML = "Password is not strong enough";
        }
    } else if (data.status) {
        console.log("no errors");
        window.location.href ="/login.html"
    }
}
