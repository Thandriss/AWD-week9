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
    console.log(event.target[1].value)
    await fetch("/api/user/register", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: '{ "email": "' + event.target[0].value +'", "password":"' + event.target[1].value +'" }'
    })
    .then((data) =>{
        console.log(data);
        window.location.href ="/login.html"
    })
}
