let emailGlobal;
let nombreGlobal;
let apellidoGlobal;
let contrasenyaGlobal;
let puntosGlobal;
let esAdminGlobal;

function getEmail() {
    return emailGlobal;
}

function getNombre() {
    return nombreGlobal;
}

function getApellidos() {
    return apellidoGlobal;
}

function getContrasenya() {
    return contrasenyaGlobal;
}

function getPuntos() {
    return puntos;
}

function datos(email) {
    fetch('/datos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "email": email })
        }).then(res => {
            return res.json()
        })
        .then((response) => {
            let datosUsuarioDB = JSON.stringify(response);
            nombreGlobal = datosUsuarioDB.NOMBRE;
            apellidoGlobal = datosUsuarioDB.APELLIDOS;
            emailGlobal = datosUsuarioDB.EMAIL;
            esAdminGlobal = datosUsuarioDB.ESADMIN;
            contrasenyaGlobal = datosUsuarioDB.CONTRASENYA;
            puntosGlobal = datosUsuarioDB.PUNTOS;
        })
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
            alert("El registro es correcto");
            emailGlobal = email;
            datos(email);
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
        abrirFormularioAcceso();
        //window.location.replace("./perfil.html");
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
            alert("El login es correcto");
            datos(email);
            //crearCookie();
            //window.location.replace("./paginaInicio.html");
        }
    })
}

function crearCookie() {
    document.cookie = "emailUsuario=" + email + "; max-age=20";
}

function rellenarDatosPerfil() {
    document.getElementById("nombrePerfil").value = getNombre();
    document.getElementById("apellidosPerfil").value = getApellidos();
    document.getElementById("emPerfil").value = getEmail();
    document.getElementById("conPerfil").value = getContrasenya();
    document.getElementById("puntosPerfil").value = getPuntos();
}