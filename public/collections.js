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

async function getColecciones(email) {
    const response = await fetch('/colecciones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "email": email })
    })
    const aux = await response.json();
    console.log(aux[0].NOMBRE);
    return aux;
}

async function getAlbumes(id) {
    const response = await fetch('/albumes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "id": id })
    })
    const aux = await response.json();
    return aux;
}

async function pepe() {
    var id = document.cookie.split("_");
    const response = await fetch('/getCartasUsuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "id": id[1] })
    });

    const cartas = await response.json();

    for (let i = 0; i < cartas.length; i++) {
        let htmlElement = document.createElement('div');
        htmlElement.id = 'cromo' + i;
        htmlElement.className = 'cromo';
        document.getElementById("principal").appendChild(htmlElement);

        htmlElement = document.createElement('img');
        htmlElement.src = cartas[i].IMAGEN;
        htmlElement.className = 'image';


        document.getElementById("cromo" + i).appendChild(htmlElement);

    }

}

//FUNCIÓN PARA COMPRAR UN CROMO
async function comprar(carta, email) {
    //COMPROBAMOS SI EL USUARIO TIENE ALGUNA COLECCIÓN PARA GUARDAR EL CROMO A COMPRARi
    let numColeciones = await buscarColecciones(email);
    let puntosUs = await datos(email);
    console.log(numColeciones.numCol)
    console.log(puntosUs)

    if (numColeciones.numCol != 0) {
        //SI TIENE ALGUNA COLECCIÓN DISPONIBLE COMPROBAMOS SI TIENE PUNTOS SUFICIENTES
        if (carta.PRECIO <= puntosUs) {
            if (carta.NUMCOPIAS == 0) {
                alert("No hay más unidades de este cromo disponibles");
            } else {
                //SI TIENE PUNTOS Y HAY STOCK PODEMOS COMPRAR EL CROMO
                //PRIMERO ELIGE LA COLECCION DONDE DEBE IR
                elegirColeccion(email, carta, puntosUs);
            }
        } else {
            alert("No dispone de puntos necesarios para comprar este cromo");
        }
    } else {
        alert("No tiene ninguna colección. Debe crear una para comprar cromos");
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
    const json = await response.json();
    console.log(json);
    return json;
}

function puntosUs(email, puntos, puntosUs) {
    let puntoAc = puntosUs - puntos;
    fetch('/upPuntos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "email": email, "puntos": puntoAc })
    })

}

function stock(carta) {
    fetch('/upStock', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "id": carta.ID })
    })
}

function anadirUser(carta) {
    console.log(carta);
    fetch('/upUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "id": carta.ID, "imagen": carta.IMAGEN, "idalbum": carta.IDALBUM })
    })
}

function anadirAlbum(id, idCol) {
    fetch('/addAlbum', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "id": id, "idCol": idCol })
    })
}

//FUNCIÓN PARA ELEGIR LA COLECCIÓN DONDE GUARDAR EL CROMO
async function elegirColeccion(email, carta, puntosUser) {
    //CUESTIONARIO PARA PREGUNTAR POR LA COLECCION DONDE QUIERE GUARDAR EL CROMO
    //SI SE HA ELEGIDO CORRECTAMENTE : COMPRAMOS
    let colecciones = await getColecciones(email);
    let respuesta = prompt("Elija sabiamente, sobre las colecciones existentes:")
    if (respuesta != null) {
        respuesta = respuesta.toLowerCase();
        for (let i = 0; i < colecciones.length; i++) {
            if (respuesta == colecciones[i].NOMBRE && carta.IDALBUM == colecciones[i].IDALBUM) {
                let albumes = await getAlbumes(colecciones[i].IDCOLUSER);
                if (albumes.length == 0) {
                    var albumNuevo = confirm("¿Quieres comprar un album? Es necesario para comprar un cromo");
                    if (albumNuevo) {
                        anadirAlbum(carta.IDALBUM, colecciones[i].IDCOLUSER);
                        puntosUs(email, carta.PRECIO, puntosUser);
                        stock(carta);
                        anadirUser(carta);
                    } else {
                        alert("No puede seguir con la compra");
                        return;
                    }
                } else if (albumes[0].ID != carta.IDALBUM) {
                    alert("No tienes el album de este cromo");
                } else {
                    puntosUs(email, carta.PRECIO, puntosUser);
                    stock(carta);
                    anadirUser(carta);
                }
            } else {
                if (carta.IDALBUM != colecciones[i].IDALBUM) {
                    alert("No tiene un album de la misma coleccion que el cromo");
                } else {
                    alert("Elija otro cromo");
                }
            }
        }
    }

    //RESTAR STOCK DE CROMOS
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
            var email = document.cookie.split("_")[0];
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