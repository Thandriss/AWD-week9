let listItems = [];
if(document.readyState !== "loading") {
    console.log("loaded");
    initializeCodeS();
} else {
    document.addEventListener("DOMContentLoaded", function() {
        console.log("not loaded");
        initializeCodeS()
    })
}


async function initializeCodeS() {
    const tok = localStorage.getItem("auth_token");
    let body = document.getElementsByTagName("body")[0];
    if (tok) {
        body.innerHTML = "";
        var button = document.createElement("BUTTON");
        button.innerText = "Log out";
        button.id = "logout";
        console.log("logout init")
        button.addEventListener("click", logout);
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
        var itemArea = document.createElement("INPUT");
        itemArea.setAttribute("type", "text");
        itemArea.id = "add-item";
        let response = await fetch("/api/todos/list", {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        })
        let data = await response.json();
        listItems = data.items;
        console.log(listItems)
        itemArea.addEventListener('keydown', async function addItem(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                console.log(itemArea.value)
                await fetch("http://localhost:3000/api/todos", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: '{ "items": "' + itemArea.value +'" }'
                })
            }
        });
        console.log(listItems)
        body.appendChild(button);
        body.appendChild(textEmail);
        body.appendChild(itemArea);
        if (listItems.length != 0) {
            console.log("listItems")
            console.log(listItems.length)
            for(let i=0; i<listItems.length; i++) {
                var nameToDo = document.createElement("p");
                nameToDo.innerHTML = listItems[i];
                body.appendChild(nameToDo);
            }
        }
    }
}

function logout() {
    // listItems=[];
    console.log("logout2")
    localStorage.removeItem("auth_token");
}

