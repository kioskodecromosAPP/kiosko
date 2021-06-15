function cogerCarta(id) {
    return fetch("/getCarta", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"idCarta": id})
    }).then(response => response.json().then(function (json) {
        return json;
    }));
}

function mostrarCartas() {
    return fetch("/getCartasMostrar", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => response.json().then(async function (text) {
        return JSON.parse(text);
    }));
}

async function editarHTML () {
    let cartas = await mostrarCartas();
    for (let i = 0; i < cartas.length; i++) {
        let htmlElement = document.createElement('div');
        htmlElement.id = 'cromo' + i;
        htmlElement.className = 'cromo';
        document.getElementById("principal").appendChild(htmlElement);

        htmlElement = document.createElement('img');
        htmlElement.src = cartas[i].IMAGEN;
        htmlElement.className = 'image';
        document.getElementById("cromo"+i).appendChild(htmlElement);
    }
}