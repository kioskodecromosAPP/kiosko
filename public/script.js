let emailGlobal;
let nombreGlobal;
let apellidoGlobal;
let contrasenyaGlobal;
let puntosGlobal;
let esAdminGlobal;

function comprobarLogueo() {
    if (document.cookie == "") {
        window.location.replace("./index.html");
        alert("No dispone de acceso a dicha sección. Será redirigido a la página principal.");
    }
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
    document.cookie = email + "; max-age=60";
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
}

function cerrarSesion() {

}

function resolverPreguntas() {
    var respuestas = [];

    document.getElementById("pregunta1").value = respuestas[0];
    document.getElementById("pregunta2").value = respuestas[1];
    document.getElementById("pregunta3").value = respuestas[2];
    document.getElementById("pregunta4").value = respuestas[3];
    document.getElementById("pregunta5").value = respuestas[4];
    document.getElementById("pregunta6").value = respuestas[5];
    document.getElementById("pregunta7").value = respuestas[6];
    document.getElementById("pregunta8").value = respuestas[7];
    document.getElementById("pregunta9").value = respuestas[8];
    document.getElementById("pregunta10").value = respuestas[9];

    return respuestas;
}

function comprobarSol() {
    let respuestas = resolverPreguntas();

    fetch('/pasatiempo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({ "respuestas": respuestas })
    }).then(response => {
        if (response.status != 200) {
            alert("El pasatiempo es incorrecto.")
        } else {
            alert("¡ENHORABUENA! Has resuelto el crucigrama.")

        }
    })
}