function abrirFormularioAcceso(){
    document.getElementById("myForm").style.display = "block";
}

function cerrarFormularioAcceso(){
    document.getElementById("myForm").style.display = "none";
}

function registroUsuarios(){
    window.location.replace("./registro.html");
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
    crearCookie();

    fetch('/login',{
        method: 'POST',
        headers:{
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({"email":email, "password":password})
    }).then(response =>{
        console.log(response.status);
        if(response.status == 400){
            alert("El login ha sido incorrecto");
        }else{
            alert("El login es correcto");
            window.location.replace("./perfil.html");
        }
    })




    console.log(email);
    console.log(password);

    
}

function crearCookie(){
    document.cookie = "emailUsuario=" + email + "; max-age=60";
}