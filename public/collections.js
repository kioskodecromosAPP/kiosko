function cogerCarta(id) {
    return fetch("/getCarta", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "idCarta": id })
    }).then(response => response.json().then(function(json) {
        return json;
    }));
}

function mostrarCartas() {
    return fetch("/getCartasMostrar", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => response.json().then(async function(text) {
        return JSON.parse(text);
    }));
}

//FUNCIÓN PARA COMPRAR UN CROMO
function comprar(carta, email) {
    //COMPROBAMOS SI EL USUARIO TIENE ALGUNA COLECCIÓN PARA GUARDAR EL CROMO A COMPRAR
    let aux = buscarColecciones(email);
    console.log(aux);
    let puntosUs = datos(email);
    console.log(puntosUs);
    if (aux != 0) {
        //SI TIENE ALGUNA COLECCIÓN DISPONIBLE COMPROBAMOS SI TIENE PUNTOS SUFICIENTES
        if (carta.PUNTOS <= puntosUs) {
            if (cartas[i].NUMCOPIAS != 0) {
                alert("No hay más unidades de este cromo disponibles");
            } else {
                //SI TIENE PUNTOS Y HAY STOCK PODEMOS COMPRAR EL CROMO
                //PRIMERO ELIGE LA COLECCION DONDE DEBE IR
                elegirColeccion(email, carta.PUNTOS);
            }
        } else {
            alert("No dispone de puntos necesarios para comprar este cromo");
        }
    } else {
        alert("No dispone de colecciones. Debe crear una para poder comprar cromos");
    }
}

//FUNCIÓN PARA SABER CUANTAS COLECCIONES TIENE CADA USUARIO
async function buscarColecciones(email) {
    const response = await fetch('/buscarColecciones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "email": email })
    })
    const aux = await response.json();
    console.log(aux);
    return aux;
}

//FUNCIÓN PARA ELEGIR LA COLECCIÓN DONDE GUARDAR EL CROMO
function elegirColeccion(email, puntos) {
    //CUESTIONARIO PARA PREGUNTAR POR LA COLECCION DONDE QUIERE GUARDAR EL CROMO
    //SI SE HA ELEGIDO CORRECTAMENTE : COMPRAMOS
    var coleccion = prompt("¿En que colección quiere añadir el cromo?");
    puntosUs(email, puntos);
    //RESTAR STOCK DE CROMOS
}

async function puntosUs(email, puntos) {
    const response = await fetch('/actualizarPuntos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "puntos": -puntos, "email": email })
    })
}

async function datos(email) {
    const response = await fetch('/datos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "email": email })
    })
    const aux = await response.json();
    console.log(aux);
    return aux.PUNTOS;
}

async function editarHTML() {
    let cartas = await mostrarCartas();
    for (let i = 0; i < cartas.length; i++) {
        let htmlElement = document.createElement('div');
        htmlElement.id = 'cromo' + i;
        htmlElement.className = 'cromo';
        document.getElementById("principal").appendChild(htmlElement);

        htmlElement = document.createElement('img');
        htmlElement.src = cartas[i].IMAGEN;
        htmlElement.className = 'image';

        let htmlElement2 = document.createElement('div');
        htmlElement2.id = 'cromo' + i;
        document.getElementById("principal").appendChild(htmlElement2);

        htmlElement2.textContent = "Número de copias disponibles: " + cartas[i].NUMCOPIAS;

        let htmlElement3 = document.createElement('div');
        htmlElement3.id = 'cromo' + i;
        document.getElementById("principal").appendChild(htmlElement3);

        htmlElement3.textContent = "Nombre del cromo: " + cartas[i].ID;

        let htmlElement4 = document.createElement('div');
        htmlElement4.id = 'cromo' + i;
        document.getElementById("principal").appendChild(htmlElement4);

        htmlElement4.textContent = "Albúm: " + cartas[i].IDALBUM;

        let htmlElement5 = document.createElement('div');
        htmlElement5.id = 'cromo' + i;
        document.getElementById("principal").appendChild(htmlElement5);

        htmlElement5.textContent = "Precio: " + cartas[i].PRECIO + " puntos";

        var boton = document.createElement("button");
        boton.innerHTML = "Comprar";

        boton.onclick = function() {
            var email = document.cookie;
            comprar(cartas[i], email);
        };

        document.getElementById("cromo" + i).appendChild(htmlElement);
        document.getElementById("cromo" + i).appendChild(htmlElement2);
        document.getElementById("cromo" + i).appendChild(htmlElement3);
        document.getElementById("cromo" + i).appendChild(htmlElement4);
        document.getElementById("cromo" + i).appendChild(htmlElement5);
        document.getElementById("cromo" + i).appendChild(boton);
    }

}

function getColecciones(id) {
    return fetch("/getCol", {
        method: "GET",
    }).then(response => response.json().then(function(json) {
        return json;
    }));
}