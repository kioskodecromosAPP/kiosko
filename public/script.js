function abrirFormularioAcceso(){
    document.getElementById("myForm").style.display = "block";
}

function cerrarFormularioAcceso(){
    document.getElementById("myForm").style.display = "none";
}

function registroUsuarios(){
    window.location.replace("./registro.html");
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
        } else {
            alert("El registro es correcto");
            window.location.replace("./perfil.html");
        }
    })

    console.log(name);
    console.log(apellidos);
    console.log(email);
    console.log(contrasenya);
}


function comprobarCookie(){
    
    if(document.cookie == ""){
        abrirFormularioAcceso();
    }else{
        window.location.replace("./perfil.html");
    }

}

function login(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("pwd").value;

    fetch('/login',{
        method: 'POST',
        headers:{
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({"email":email, "password":password})
    }).then(response =>{
        if(response.status == 400){
            alert("El login ha sido incorrecto");
        }else{
            alert("El login es correcto");
            crearCookie();
            window.location.replace("./perfil.html");
        }
    })    
}

function crearCookie(){
    document.cookie = "emailUsuario=" + email + "; max-age=1800";
}