let emailGlobal;
let nombreGlobal;
let apellidoGlobal;
let contrasenyaGlobal;
let puntosGlobal;
let esAdminGlobal;
var clicados = "";

function comprobarLogueo() {
    if (document.cookie == "") {
        window.location.replace("./index.html");
        alert("No dispone de acceso a dicha sección. Será redirigido a la página principal.");
    }
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
    console.log(aux.NOMBRE);
    return aux;
}

function getEmail() {
    return emailGlobal;
}

function getNombre() {
    console.log(nombreGlobal);
    return nombreGlobal;
}

function getApellidos() {
    return apellidoGlobal;
}

function getContrasenya() {
    return contrasenyaGlobal;
}

function getPuntos() {
    return puntosGlobal;
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
    nombreGlobal = aux.NOMBRE;
    apellidoGlobal = aux.APELLIDOS;
    emailGlobal = aux.EMAIL;
    esAdminGlobal = aux.ESADMIN;
    contrasenyaGlobal = aux.CONTRASENYA;
    puntosGlobal = aux.PUNTOS;
}

function abrirFormularioAcceso() {
    document.getElementById("myForm").style.display = "block";
}

function cerrarFormularioAcceso() {
    document.getElementById("myForm").style.display = "none";
}

function registroUsuarios() {
    window.location.replace("./registro.html");
}

function registro() {
    const name = document.getElementById("nombre").value;
    const apellidos = document.getElementById("apellidos").value;
    const email = document.getElementById("em").value;
    const contrasenya = document.getElementById("cont").value;

    console.log(name);
    console.log(apellidos);
    console.log(email);
    console.log(contrasenya);

    fetch('/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "name": name, "apellidos": apellidos, "email": email, "contrasenya": contrasenya })
    }).then(response => {
        console.log(response.status);
        if (response.status == 400) {
            alert("El registro ha sido incorrecto");
        } else if (response.status == 200) {
            crearCookie(email);
            alert("El registro es correcto");
            window.location.replace("./paginaInicio.html");
        } else {
            alert("Ya hay un usuario registrado con ese email");
        }
    });

    console.log(name);
    console.log(apellidos);
    console.log(email);
    console.log(contrasenya);
}


function comprobarCookie() {

    if (document.cookie == "") {
        abrirFormularioAcceso();
    } else {
        window.location.replace("./perfil.html");
    }

}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("pwd").value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "email": email, "password": password })
    }).then(response => {
        if (response.status == 400) {
            alert("El login ha sido incorrecto");
        } else {
            crearCookie(email);
            alert("El login es correcto");
            window.location.replace("./paginaInicio.html");
        }
    })
}

function crearCookie(email) {
    document.cookie = email + "; max-age=1800";
    console.log(email);
    console.log(document.cookie);
    cookieCreada = true;
}

async function rellenarDatosPerfil() {
    await datos(document.cookie);
    document.getElementById("nombrePerfil").value = getNombre();
    document.getElementById("apellidosPerfil").value = getApellidos();
    document.getElementById("emPerfil").value = getEmail();
    document.getElementById("puntosPerfil").value = getPuntos();

    const promise = getColecciones(document.cookie);
    promise.then(colecciones => {
        console.log(colecciones)
        for (let i = 0; i < colecciones.length; i++) {
            let button = document.createElement("button");
            button.id = 'colec' + i;
            button.className = 'colec' + i;
            console.log(colecciones[i].IDCOLUSER)
            button.innerHTML = colecciones[i].NOMBRE;
            button.onclick = button.onclick = async function () {
                await fetch('/getCol', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "id": colecciones[i].IDCOLUSER })
                });

                window.location.replace("/colecciones.html")
            };
            document.getElementById("colecciones").appendChild(button);
        }

    })
}


function cerrarSesion() {
    var aux = document.cookie;
    document.cookie = aux + "; max-age=0";
    window.location.replace("./index.html");
}

function resolverPreguntas() {
    var respuestas = [];

    respuestas[0] = document.getElementById("pregunta1").value.toLowerCase();
    respuestas[1] = document.getElementById("pregunta2").value.toLowerCase();
    respuestas[2] = document.getElementById("pregunta3").value.toLowerCase();
    respuestas[3] = document.getElementById("pregunta4").value.toLowerCase();
    respuestas[4] = document.getElementById("pregunta5").value.toLowerCase();
    respuestas[5] = document.getElementById("pregunta6").value.toLowerCase();
    respuestas[6] = document.getElementById("pregunta7").value.toLowerCase();
    respuestas[7] = document.getElementById("pregunta8").value.toLowerCase();
    respuestas[8] = document.getElementById("pregunta9").value.toLowerCase();
    respuestas[9] = document.getElementById("pregunta10").value.toLowerCase();

    var aux = comprobarSol(respuestas);
    let puntos = 0;
    aux.then(respuestas => {
        alert("Has acertado " + respuestas + " preguntas");
        puntos = respuestas * 5;
        document.getElementById("puntosObtenidos").value = puntos;

        fetch('/actualizarPuntos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "email": document.cookie, "puntos": puntos })
        }).then(response => {
            if (response.status == 400) {
                alert("La suma de los puntos ha sido errónea.")
            }
        })

    });

}

function crearColeccion() {
    const nombreColeccion = document.getElementById("nombreColeccion").value;
    const id = document.getElementById("nombreAlbum").value;

    fetch('/crearCol', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "nombreColeccion": nombreColeccion, "id": id, "email": document.cookie })
    }).then(response => {
        console.log(response.status);
        if (response.status == 400) {
            alert("El registro ha sido incorrecto");
        } else if (response.status == 200) {
            alert("El registro de coleccion es correcto");
            window.location.replace("./perfil.html");
        } else {
            alert("El album con ese nombre no existe");
        }
    });
}

function comprobarSol(respuestas) {

    return fetch("/preguntas", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "respuestas": respuestas })

    }).then(response => response.json().then(async function (text) {
        return JSON.parse(text);
    }));
}

function cambioColor(id) {
    var puntos = 0;
    var counter = 0;
    document.getElementById(id).style.backgroundColor = "#11FF00";
    clicados = clicados + " " + id;

    if (clicados.includes('c114') && clicados.includes('c214') && clicados.includes('c314') && clicados.includes('c414') && clicados.includes('c514') && clicados.includes('c614') && clicados.includes('c714')) {
        puntos = puntos + 5;
        document.getElementById("puntosObtenidosSopa").value = puntos;
        counter++;
    }

    if (clicados.includes('c41') && clicados.includes('c42') && clicados.includes('c43') && clicados.includes('c44') && clicados.includes('c45') && clicados.includes('c46') && clicados.includes('c47')) {
        puntos = puntos + 5;
        document.getElementById("puntosObtenidosSopa").value = puntos;
        counter++;
    }

    if (clicados.includes('c85') && clicados.includes('c86') && clicados.includes('c87') && clicados.includes('c88') && clicados.includes('c89') && clicados.includes('c810')) {
        puntos = puntos + 5;
        document.getElementById("puntosObtenidosSopa").value = puntos;
        counter++;
    }

    if (clicados.includes('c112') && clicados.includes('c211') && clicados.includes('c310') && clicados.includes('c49') && clicados.includes('c58') && clicados.includes('c67') && clicados.includes('c76') && clicados.includes('c85') && clicados.includes('c94') && clicados.includes('c103')) {
        puntos = puntos + 5;
        document.getElementById("puntosObtenidosSopa").value = puntos;
        counter++;
    }

    if (clicados.includes('c112') && clicados.includes('c212') && clicados.includes('c312') && clicados.includes('c412') && clicados.includes('c512') && clicados.includes('c612') && clicados.includes('c712') && clicados.includes('c812') && clicados.includes('c912')) {
        puntos = puntos + 5;
        document.getElementById("puntosObtenidosSopa").value = puntos;
        counter++;
    }

    if (clicados.includes('c111') && clicados.includes('c210') && clicados.includes('c39') && clicados.includes('c48') && clicados.includes('c57') && clicados.includes('c66') && clicados.includes('c75')) {
        puntos = puntos + 5;
        document.getElementById("puntosObtenidosSopa").value = puntos;
        counter++;
    }

    if (clicados.includes('c51') && clicados.includes('c62') && clicados.includes('c73') && clicados.includes('c84') && clicados.includes('c95') && clicados.includes('c106')) {
        puntos = puntos + 5;
        document.getElementById("puntosObtenidosSopa").value = puntos;
        counter++;
    }

    if (clicados.includes('c32') && clicados.includes('c33') && clicados.includes('c34') && clicados.includes('c35') && clicados.includes('c36') && clicados.includes('c37') && clicados.includes('c38') && clicados.includes('c39') && clicados.includes('c310')) {
        puntos = puntos + 5;
        document.getElementById("puntosObtenidosSopa").value = puntos;
        counter++;
    }

    if (clicados.includes('c18') && clicados.includes('c27') && clicados.includes('c36') && clicados.includes('c45') && clicados.includes('c54') && clicados.includes('c63') && clicados.includes('c72') && clicados.includes('c81')) {
        puntos = puntos + 5;
        document.getElementById("puntosObtenidosSopa").value = puntos;
        counter++;
    }

    if (counter == 9) {
        alert("¡ENHORABUENA, HAS RESUELTO LA SOPA DE LETRAS COMPLETA!");
    }

    fetch('/actualizarPuntos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "email": document.cookie, "puntos": puntos })
    }).then(response => {
        if (response.status == 400) {
            alert("La suma de los puntos ha sido errónea.")
        }
    })

}